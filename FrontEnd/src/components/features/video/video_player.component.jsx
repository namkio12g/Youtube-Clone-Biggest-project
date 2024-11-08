import React,{useState,useRef,useEffect} from "react";


import { MdOutlineRemoveRedEye } from "react-icons/md";        
        
import { FaPlay,FaBackward,FaPause,FaForward } from "react-icons/fa";
import { HiSpeakerWave,HiSpeakerXMark} from "react-icons/hi2";
import { HiDotsHorizontal } from "react-icons/hi";
import { MdSlowMotionVideo,MdHighQuality, MdFullscreen   } from "react-icons/md";
import { TbPictureInPictureFilled } from "react-icons/tb";
import { RxExitFullScreen } from "react-icons/rx";

import './video_player.scss'
const VideoPlayer = ({video,onIcreaseViews=null})=>{
    const playSpeeds=[
        {
            value:0.25,
            text:"0.25"
        },
         {
            value:0.5,
            text:"0.5"
        },
         {
            value:0.75,
            text:"0.75"
        },
         {
            value:1,
            text:"Normal"
        },
         {
            value:1.25,
            text:"1.25"
        },
         {
            value:1.5,
            text:"1.5"
        },
         {
            value:1.75,
            text:"1.75"
        },
         {
            value:2.0,
            text:"2.0"
        },
    ]

    const lineVolumeRef=useRef(null);
    const videoRef=useRef(null);
    const videoWrapperRef=useRef(null);
    const speedOptionsRef=useRef(null);
    const qualityOptionsRef=useRef(null);
    const progressBarRef=useRef(null);
    const currentTimeRef=useRef(null);
    const progressAreaRef=useRef(null);
    const timerRef=useRef(null)




    const [speed, setSpeed] = useState(1);
    const [volume, setVolume] = useState(0.5);
    const [isPlaying, toggleIsPlaying] = useState(onIcreaseViews?true:false);
    const [isFullScreen, toggleIsFullScreen] = useState(false);
    const [duration, setDuration] = useState(0);
    const [currTime, setCurrTime] = useState(0);
    const [showControls,setShowControls]=useState(true)
    const [activeSpeedIndex, setActiveSpeedIndex] = useState(3);
    const [activeQualityIndex, setActiveQualityIndex] = useState(0);
    

    
   

    const handleLoadedMetadata = () => {
        if (videoRef.current) {
        setDuration(videoRef.current.duration);
        }
    };

    const handleShowSpeedOptions=(e)=>{
        e.stopPropagation();
        speedOptionsRef.current.classList.toggle("show")
        qualityOptionsRef.current.classList.remove("show");

    }
    const handleShowQualityOptions=(e)=>{
        e.stopPropagation();
        qualityOptionsRef.current.classList.toggle("show")
        speedOptionsRef.current.classList.remove("show");

    }

    const handleSpeed=(speed,index)=>{
        setActiveSpeedIndex(index)
        videoRef.current.playbackRate=speed;
    }
    const handleChangeUrl=(url,index)=>{
        setActiveQualityIndex(index)
        let CurrTime=videoRef.current.currentTime;
        videoRef.current.src=url;
        videoRef.current.currentTime=CurrTime;
        videoRef.current.play();
    }
    const handleSpeakerVolume=()=>{
        progressAreaRef.current.addEventListener("mousemove",()=>{});
        if(volume==0){
            videoRef.current.volume = 1;
            lineVolumeRef.current.style.width=`100%`
            setVolume(1)
        }
        else{
            videoRef.current.volume = 0;
            lineVolumeRef.current.style.width=`0%`
            setVolume(0)
        }
    }

    const handleVolume = (e)=>{
        lineVolumeRef.current.style.width=`${e.target.value*100}%`;
        videoRef.current.volume = e.target.value;
        setVolume(e.target.value)
    }

    const handleIsPlaying = (e)=>{
        if(isPlaying){
            videoRef.current.pause();
        }
        else{
            videoRef.current.play();
        }
        toggleIsPlaying(value=>!value)
    }

    const handleIsFullScreen = (e)=>{
        if(isFullScreen){
            document.exitFullscreen()
        }
        else{
            if (videoWrapperRef.current.requestFullscreen) {
                videoWrapperRef.current.requestFullscreen();
            } else if (videoWrapperRef.current.webkitRequestFullscreen) { /* Safari */
                videoWrapperRef.current.webkitRequestFullscreen();
            } else if (videoWrapperRef.current.msRequestFullscreen) { /* IE11 */
                videoWrapperRef.current.msRequestFullscreenWrapper
            }
        }
        toggleIsFullScreen(value=>!value)
    }
    const handlePictureInPicture = (e)=>{
        videoRef.current.requestPictureInPicture()
    }

    const handleVideoTimeUpdate =(e)=>{
        let {currentTime,duration} = e.target;
        let percent=(currentTime/duration)*100;
        progressBarRef.current.style.width=`${percent}%`
        currentTimeRef.current.innerHTML=formaTime(currentTime);
        setCurrTime(percent)

    }
    const formaTime = time =>{
        let seconds=Math.floor(time%60),
        minutes = Math.floor(time/60)%60,
        hours = Math.floor((time/3600))
        seconds=seconds<10?`0${seconds}`:seconds;
        minutes=minutes<10?`0${minutes}`:minutes;
        hours=hours<10?`0${hours}`:hours;
        if(hours=="00"){
            return `${minutes}:${seconds}`;
        }
        else{
            return `${hours}:${minutes}:${seconds}`;

        }

    }

    const handleChangeCurrTime=(e)=>{
        videoRef.current.currentTime=e.target.value/100*duration;
        progressBarRef.current.style.width=`${e.target.value}%`;
        setCurrTime(e.target.value);


    }   


    let hideControlsTimeout;
    const handleUserActivity = () => {
        clearTimeout(hideControlsTimeout);
        setShowControls(true);
        hideControlsTimeout = setTimeout(() => {
            setShowControls(false);
        }, 3000);
    };


     useEffect(()=>{
            if(videoWrapperRef.current){
                videoRef.current.volume = volume;
                videoWrapperRef.current.addEventListener('mousemove', handleUserActivity);
                videoWrapperRef.current.addEventListener('touchmove', handleUserActivity);
            }
        const handleClickOutside=(e)=>{
            if(speedOptionsRef.current && speedOptionsRef.current.classList.contains("show")){
                speedOptionsRef.current.classList.remove("show");
            }
             if(qualityOptionsRef.current && qualityOptionsRef.current.classList.contains("show")){
                qualityOptionsRef.current.classList.remove("show");
             }
        }
      
        document.addEventListener('click', handleClickOutside);


        return () => {
        if(videoWrapperRef.current){
            videoWrapperRef.current.removeEventListener('mousemove', handleUserActivity);
            videoWrapperRef.current.removeEventListener('touchmove', handleUserActivity);
        }
        document.removeEventListener('click', handleClickOutside);
        clearTimeout(hideControlsTimeout);
      

        };
    }, []);

     useEffect(()=>{
        if(onIcreaseViews){
            videoRef.current.play()
            const restartTime=()=>{
                timerRef.current= setTimeout(() => {
                onIcreaseViews()
             }, video.duration/2.5*1000);
            }
            const resetTimer = () => {

            clearTimeout(timerRef.current); 
            }
            if(videoRef.current){
                videoRef.current.addEventListener("play",restartTime);
                videoRef.current.addEventListener("pause",resetTimer);

            }
            return ()=>{
                 if(videoRef.current){
                    videoRef.current.removeEventListener("play",restartTime);
                    videoRef.current.removeEventListener("pause",resetTimer);

                }
                clearTimeout(timerRef.current)
            }
            
        
        }
    }, [onIcreaseViews]);
    return(
        <div className="video-wrapper" ref={videoWrapperRef} >
            <div className={showControls?"controls-wrapper show":"controls-wrapper"}>
                <div className="video-timeline">
                    <span className="current-time"ref={currentTimeRef}>00:00</span>
                    <div className="progress-area">
                        <div className="progress-bar" ref={progressBarRef}></div>
                        <input  type="range" min="0" max="100" step={0.001} value={currTime} onChange={handleChangeCurrTime}/>
                    </div>
                    <span className="max-time">{video.durationText}</span>
                </div>
                <div className="video-controls">

                    <div className="left-options">
                        <FaBackward size={22}/>
                        {isPlaying ? <FaPause onClick={handleIsPlaying} size={20}/> : <FaPlay onClick={handleIsPlaying}/> }
                        <FaForward size={22}/>
                        {volume==0? <HiSpeakerXMark size={23} className="speaker"  onClick={handleSpeakerVolume}/>:<HiSpeakerWave size={23} className="speaker" onClick={handleSpeakerVolume}/>}
                        <div className="range-box">
                            <div className="line" ref={lineVolumeRef}></div>
                            <input type="range" min="0" max="1" onChange={handleVolume} step={0.01} value={volume}/>
                        </div>
                    </div>

                    <div className="right-options d-flex flex-row align-items-center justify-content-end">

                        <div className="position-relative d-flex flex-row align-items-center justify-content-end">

                            <MdSlowMotionVideo size={25} onClick={handleShowSpeedOptions}/>
                                <div className="options" ref={speedOptionsRef} >
                                {playSpeeds.map((item,index)=>
                                    <span key={index} onClick={()=>handleSpeed(item.value,index)}  className={activeSpeedIndex === index ? 'active' : ''}>{item.text}</span>
                                )}
                            </div>
                            
                        </div>
                        <div className="position-relative d-flex flex-row align-items-center">

                            <MdHighQuality size={25} onClick={handleShowQualityOptions}/>

                            <div className="options" ref={qualityOptionsRef}>
                                {video.videoUrl.map((item,index)=>
                                    <span key={index} onClick={()=>handleChangeUrl(item.url,index)}  className={activeQualityIndex === index ? 'active' : ''}>{item.value}</span>
                                )}
                            </div>
                        </div>
                     

                        <TbPictureInPictureFilled size={24} onClick={handlePictureInPicture}/>

                        {isFullScreen?<RxExitFullScreen size={26} onClick={handleIsFullScreen}/> :<MdFullscreen size={30} onClick={handleIsFullScreen}/>}
                    </div>

                </div>
            </div>
            <video ref={videoRef} src={video.videoUrl[0].url} className="responsive-video" onClick={handleIsPlaying} onTimeUpdate={handleVideoTimeUpdate}onLoadedMetadata={handleLoadedMetadata} autoplay></video>
        </div>
    )
}

export default React.memo(VideoPlayer)