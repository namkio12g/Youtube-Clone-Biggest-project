const express = require("express")
const {
    AWS_ACCESS_KEY,
    AWS_SECRET_KEY,
    REGION,
    BUCKE,
    BUCKET
} = require("../config")

const ffmpegStatic = require('ffmpeg-static')
const ffprobe = require('ffprobe-static');
const ffmpeg = require('fluent-ffmpeg')
const crypto = require('crypto')
const path = require("path")
const fs = require('fs');
const AWS = require("aws-sdk")


const outputDir = path.join(__dirname, '../output');
ffmpeg.setFfmpegPath(ffmpegStatic)
ffmpeg.setFfprobePath(ffprobe.path);

AWS.config.update({
    accessKeyId: AWS_ACCESS_KEY,
    region: REGION,
    secretAccessKey: AWS_SECRET_KEY
})
const s3 = new AWS.S3();

const RandomName = (bytes = 16) => crypto.randomBytes(bytes).toString('hex')

class uploadService {
    async encodeVideo(file, resolutions) {
        let files = [];
        console.log("file")
        return new Promise((resolve, reject) => {
            if (resolutions.length === 0) {
                return resolve(files);
            }
            const generatedName = RandomName();
            console.log("processing")
            const promises = resolutions.map(resol => {
                return new Promise((resResol, resReject) => {
                    const videoNamePath = path.join(outputDir, `${generatedName}_${resol.output}.mp4`);
                    ffmpeg(file)
                        .videoCodec('libx264')
                        .size(resol.value)
                        .output(videoNamePath)
                        .on('end', () => {
                            console.log(`Processed ${resol.value}`);
                            files.push({
                                path: videoNamePath,
                                value: resol.value,
                                name: `${generatedName}_${resol.output}`
                            });
                            resResol();
                        })
                        .on('error', (error) => {
                            console.error(`Error processing ${resol.value}`, error);
                            resReject(error);
                        })
                        .run();
                });
            });

            Promise.all(promises)
                .then(() => resolve(files))
                .catch(reject);
        });
    }
    async uploadVideoCloud(files) {
        try {
            const params = files.map(file => {
                const filestream = fs.createReadStream(file.path)
                return {
                    Bucket: BUCKET,
                    Key: file.name,
                    Body: filestream,
                    ContentType: "video/mp4"
                }
            })
            const results = await Promise.all(params.map(param => s3.upload(param).promise()))
            console.log("uploaded")
            files.map(file => {
                fs.unlinkSync(file.path)
            })
            return results
        } catch (error) {
            throw error
        }
    }


      async uploadImageCloud(file) {
          try {
              
                  const filestream = fs.createReadStream(file.path)
                  const params= {
                      Bucket: BUCKET,
                      Key: file.name,
                      Body: filestream,
                      ContentType: "image/jpeg"
                  }
              const result = await s3.upload(params).promise();
              await fs.unlinkSync(file.path)
              return result.Location
          } catch (error) {
              throw error
          }



      }
    async getVideoDuration(pathToFile) {
        try {
            
            return new Promise((resolve, reject) => {
                ffmpeg.ffprobe(pathToFile, (err, metadata) => {
                    if (err) {
                        reject(err);
                    } else {
                        const duration = metadata.format.duration;
                        fs.unlinkSync(pathToFile)
                        resolve(duration);
                    }
                });
            });
        } catch (error) {
            console.log(error)
        }
    }
   async extractFrameFromVideo(file, timestamp ,resolution) {
       return new Promise((resolve, reject) => {
            const generatedName = RandomName();
            const videoNamePath = path.join(outputDir, `${generatedName}.jpg`);
           ffmpeg(file)
               .on('end', () => {
                   console.log('Frame extracted successfully');
                   resolve({
                    path:videoNamePath,
                    name: `${generatedName}.jpg`
                });
               })
               .on('error', (err) => {
                   console.error('Error extracting frame:', err);
                   reject(err);
               })
               .screenshot({
                   timestamps: [timestamp], 
                   filename: `${generatedName}.jpg`,
                   folder: outputDir, 
                   size: resolution
               });
       });
   }
    async processsAndUploadCloud(file, resolutions) {
        try {
            const files = await this.encodeVideo(file, resolutions)
            console.log("processedd")
            console.log("uploading")

            const result = await this.uploadVideoCloud(files)
             const videoUrl = [];
             for (let i = 0; i < result.length; i++) {
                 videoUrl.push({
                     value: files[i].value,
                     url: result[i].Location
                 })
             }
            return videoUrl;
        } catch (error) {
            throw error
        }
    }
    async resizeImage(file,resolution) {
        return new Promise((resolve, reject) => {
            const generatedName = RandomName();
            const filePath = path.join(outputDir, `${generatedName}.jpg`);
            ffmpeg(file)
                .size(resolution)
                .on('end', () => {
                    console.log('Resizing finished');
                    resolve({
                        name: `${generatedName}.jpg`,
                        path: filePath
                    });
                })
                .on('error', (err) => {
                    console.error('Error during resizing:', err);
                    reject(err);
                })
                .save(filePath);
        });
    }

    async deleteObjectFromS3(key) {
        const params = {
            Bucket: BUCKET,
            Key: key 
        };

        return new Promise((resolve, reject) => {
            s3.deleteObject(params, (err, data) => {
                if (err) {
                    console.log('Error deleting object:', err);
                    reject(err);
                } else {
                    console.log('Successfully deleted object:', data);
                    resolve(data);
                }
            });
        });
    }

    async processsAndUploadImageCloud(file) {
        try {
            const data=await this.resizeImage(file,"1280x720")
            console.log("processedd image")
            console.log("uploading")
            const result = await this.uploadImageCloud(data)
            return result
        } catch (error) {
            throw error
        }
    }

    async SubscribeEvent(payload) {
        paylod = JSON.parse(payload)
        const {
            event,
            data
        } = payload;
        const {
            video_id,
            file,
            resolutions
        } = data;
        switch (event) {
            case "UPLOAD_VIDEO":
                await this.processsAndUploadCloud(file, resolutions)
                break;




        }
    }
}
module.exports = uploadService;