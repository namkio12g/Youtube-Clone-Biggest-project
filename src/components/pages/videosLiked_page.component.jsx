import React from "react";
import { useState,useEffect } from 'react'

import VideoPlayer from "../video/video_player.component";
import { RxCross2 } from "react-icons/rx";
import { HiMiniBars3BottomLeft } from "react-icons/hi2";
import { FaFire,FaCheck } from "react-icons/fa";  


import './scss/videosLiked_page.scss'
import video from "./music.mp4"
const VideosLiked=()=>{
    const [filterActive,setFilterActive] = useState(false)
        const handleFilterActive=()=>{
            setFilterActive(prev=>!prev)
        }
    const items=[
        {
            thumbnail:"https://i.ytimg.com/vi/DtBPnnWHR-Y/hq720.jpg?sqp=-oaymwEcCNAFEJQDSFXyq4qpAw4IARUAAIhCGAFwAcABBg==&rs=AOn4CLBwOfSm8rpmWUE3aDeiQiuNhb-WRw",
            title:"Nicon Corporation",
            view:2500,
            time:"22:43"
        },
         {
            thumbnail:"https://img.freepik.com/free-vector/modern-youtube-background-thumbnail-with-papercut-effect_1361-2739.jpg",
            title:"Canon EOS REBEL",
            view:6543,
            time:"59:43"
        },
         {
            thumbnail:"https://img.freepik.com/free-psd/creative-youtube-thumbnail-design-template_505751-6054.jpg",
            title:"Nicon unilll",
            view:7789,
            time:"11:43"
        },
         {
            thumbnail:"https://i.ytimg.com/vi/WzDmoTydaEk/hq720.jpg?sqp=-oaymwEhCK4FEIIDSFryq4qpAxMIARUAAAAAGAElAADIQj0AgKJD&rs=AOn4CLAdjWUCBXuCPTYOaERM1cVXjs3H8A",
            title:"Sony , ILCE-7M2",
            view:2501,
            time:"01:43"
        },
         {
            thumbnail:"https://img.freepik.com/free-psd/education-template-design_23-2151095367.jpg",
            title:"Template Duecation",
            view:5500,
            time:"05:43"
        }, {
            thumbnail:"https://img.freepik.com/free-psd/e-learning-template-design_23-2151081798.jpg",
            title:"Your learn lets learn",
            view:25000,
            time:"11:03"
        }
        , {
            thumbnail:"https://img.freepik.com/premium-psd/youtube-thumbnail-design-cover-design-template_941802-3172.jpg",
            title:"Nicon Corporation version 1",
            view:44000,
            time:"07:56"
        }
    ]
    return(
        <>  
            <div className="videosLiked-page">
                <div className="page-content">
                    <div className="d-flex left-block flex-column">
                        
                        <div className="left-content d-flex flex-column">
                            <img src="https://i.ytimg.com/vi/DtBPnnWHR-Y/hq720.jpg?sqp=-oaymwEcCNAFEJQDSFXyq4qpAw4IARUAAIhCGAFwAcABBg==&rs=AOn4CLBwOfSm8rpmWUE3aDeiQiuNhb-WRw" alt="" className="image-showing" />
                            <span className="page-title">Video đã thích</span>
                            <span> Nam nguyên thành</span>
                            <span> 429 videos</span>
                        </div>
                        
                        <div className="background-wrapper d-flex justify-content-center align-items-center flex-row">
                             <img className="background-img" src="https://i.ytimg.com/vi/DtBPnnWHR-Y/hq720.jpg?sqp=-oaymwEcCNAFEJQDSFXyq4qpAw4IARUAAIhCGAFwAcABBg==&rs=AOn4CLBwOfSm8rpmWUE3aDeiQiuNhb-WRw" alt="" />
                        </div>
                        <div className="background-blur">

                        </div>
                    </div>
                    <div className="right-block videos d-flex flex-column">
                        <div className="filter">
                            <div className="position-relative">
                                <HiMiniBars3BottomLeft className="button mt-1" size={25} onClick={handleFilterActive}/>
                                <span className="ms-2">Sắp xếp</span>
                                <div className={filterActive?"filter-expand active  d-flex flex-column":"filter-expand d-flex flex-column"}>
                                    <span>
                                        Ngày thêm(cũ nhất)
                                    </span>
                                     <span>
                                         Ngày thêm(mới nhất)
                                    </span>
                                     <span>
                                        Phổ biến nhất
                                    </span>
                                </div>
                            </div>
                        </div>
                        {
                            items.map((item,index)=>(
                                    <div key={index} className="item mb-3 d-flex flex-row">
                                        <img src={item.thumbnail} alt="" />
                                        <div className="video-info d-flex flex-column">
                                            <span className="title">{item.title} </span>
                                            <div className="channelTitle-view">
                                                <span>Einzelgänger</span>
                                                <FaCheck className="check-icon ms-1"/>   
                                                <span> • </span>
                                                <FaFire className="view-icon me-1   "/> 
                                                <span>2,3 Tr lượt xem</span>
                                                  
                                            </div>
                                        </div>
                                        <RxCross2 className="delete-button" size={30}/>
                                    </div>
                            ))
                        }
                        
                    </div>
                </div>
            </div>
        </>
    )
}
export default VideosLiked