import React from "react";

import { MdOutlineRemoveRedEye } from "react-icons/md";        
import { FaFire,FaCheck,FaClock  } from "react-icons/fa";       
import './video_thumbnail.scss'
const VideoThumbnail = ({videoInfo})=>{
        return(
        <div className="video-item" >
            <img className="video-thumbnail" src={videoInfo.thumbnail} alt="" />
            <div className="video-info">
                <div className="d-flex flex-row justify-content-between align-items-center">
                        <span className="video-view d-flex flex-row justify-content-between align-items-center">
                            <FaFire className="me-1  view-icon" size={20}/>
                            {videoInfo.views}
                        </span>
                        <span className="video-date d-flex flex-row justify-content-between align-items-center">
                            <FaClock className=" time-icon" size={20}/>
                            <span className="ms-1 video-date" > {videoInfo.timeDifferenceText} </span>
                        </span>
                        

                </div>
                <span className="video-title">{videoInfo.title}</span>
                <div className="d-flex flex-row align-items-center">
                    <span className="channel-title">{videoInfo.channelTitle}</span>
                    <FaCheck className="check-icon ms-2"/>
                </div>
                
            </div>
        </div>
    )
}

export default VideoThumbnail