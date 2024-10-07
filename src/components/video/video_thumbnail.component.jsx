import React from "react";

import { MdOutlineRemoveRedEye } from "react-icons/md";        
import { FaFire,FaCheck } from "react-icons/fa";       

import './video_thumbnail.scss'
const VideoThumbnail = ({videoInfo})=>{
    
    return(
        <a className="video-item" href="#">
            <img className="video-thumbnail" src={videoInfo.thumbnail} alt="" />
            <div className="video-info">
                <div className="d-flex flex-row justify-content-between align-items-center">
                        <span className="video-view">
                            <FaFire className="me-2 view-icon" size={20}/>
                            {videoInfo.view}
                        </span>
                        <span className="ms-1 video-date" > 28 minutes </span>

                </div>
                <span className="video-title">{videoInfo.title}</span>
                <div className="d-flex flex-row align-items-center">
                    <span className="channel-title">{videoInfo.channel}</span>
                    <FaCheck className="check-icon ms-2"/>
                </div>
                
            </div>
        </a>
    )
}

export default VideoThumbnail