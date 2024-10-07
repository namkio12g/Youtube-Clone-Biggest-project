const express=require("express")
const {AWS_ACCESS_KEY,AWS_SECRET_KEY,REGION,BUCKE, BUCKET} =require("../config")

const ffmpegStatic=require('ffmpeg-static')
const ffmpeg = require('fluent-ffmpeg')
const crypto = require('crypto')
const path = require("path")
const fs = require('fs');
const AWS=require("aws-sdk")


const outputDir = path.join(__dirname, '../output');
ffmpeg.setFfmpegPath(ffmpegStatic)

AWS.config.update({
    accessKeyId: AWS_ACCESS_KEY,
    region: REGION,
    secretAccessKey: AWS_SECRET_KEY
})
const s3 = new AWS.S3();

const RandomName=(bytes=16)=>crypto.randomBytes(bytes).toString('hex')

class uploadvideoService{
    async encodeVideo(video, resolutions, videoName) {
        let files = [];
        return new Promise((resolve, reject) => {
            if (resolutions.length === 0) {
                return resolve(files);
            }
            console.log("processing")
            // Process the resolutions using Promise.all to wait for all encoding tasks to complete
            const promises = resolutions.map(resol => {
                return new Promise((resResol, resReject) => {
                    const videoNamePath = path.join(outputDir, `${videoName}_${resol.output}.mp4`);
                    ffmpeg("C:/Users/84355/Desktop/WebProject2/youtube-clone/services/uploadVideo.services/service/video.mp4")
                        .videoCodec('libx264')
                        .size(resol.value)
                        .output(videoNamePath)
                        .on('end', () => {
                            console.log(`Processed ${resol.value}`);
                            files.push({
                                path: videoNamePath,
                                value: resol.value
                            });
                            resResol(); // Resolve this specific resolution process
                        })
                        .on('error', (error) => {
                            console.error(`Error processing ${resol.value}`, error);
                            resReject(error); // Reject if any error happens during processing
                        })
                        .run();
                });
            });

            // Wait for all resolutions to be processed

            Promise.all(promises)
                .then(() => resolve(files))
                .catch(reject);
        });
    }
    async uploadCloud(files){
        try {
                const generatedName=RandomName();
                const params=files.map(file=>{
                    const filestream = fs.createReadStream(file.path)
                    return{
                        Bucket:BUCKET,
                        Key:`${generatedName}_${file.value}`,
                        Body:filestream,
                        ContentType:"video/mp4"
                    }
                })
                const results = await Promise.all(params.map(param =>{ s3.upload(param).promise()}))
                console.log("uploaded")
                return results
        } catch (error) {
            throw error
        }



    }
    async processsAndUploadCloud(file, resolutions, title) {
        try {
            const files =await this.encodeVideo(file,resolutions,title)
            console.log("processedd")
            console.log("uploading")

            const result= await this.uploadCloud(files)
            return result
        } catch (error) {
            throw error
        }
    }

    async SubcribeEvent(payload){
        const {event,data}=payload;

        switch(event){
          
        }
    }
}
module.exports = uploadvideoService;