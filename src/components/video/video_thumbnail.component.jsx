import React from "react";

import { MdOutlineRemoveRedEye } from "react-icons/md";        
        

import './video_thumbnail.scss'
const VideoThumbnail = ({videoInfo})=>{
    
    return(
        <a className="video-item" href="#">
            <img className="video-thumbnail" src={videoInfo.thumbnail} alt="" />
            <div className="video-info">
                <span className="video-title">{videoInfo.title}</span>
                <div className="d-flex flex-row justify-content-between align-items-center">
                    <span className="channel-title">{videoInfo.channel}</span>
                    <div className="d-flex flex-row">
                        <span className="video-view">
                            {videoInfo.view}
                            <MdOutlineRemoveRedEye className="ms-1" size={20}/>
                        </span>
                        <span className="ms-1 video-date" > - 3 years </span>

                    </div>
                </div>

            </div>
        </a>
    )
}

export default VideoThumbnail