import React from "react";
import { useState,useEffect } from 'react'

import VideoPlayer from "../video/video_player.component";

import { MdDelete } from "react-icons/md";
import { FaFire,FaCheck } from "react-icons/fa";  

import './scss/history_page.scss'
import video from "./music.mp4"
const HistoryPage=()=>{
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
            <div className="history-page">
                <span className="page-title">Nhat ky Xem</span>
                <div className="videos mt-4 d-flex flex-column">
                    {
                        items.map((item,index)=>(
                            <>
                                <div className="item mb-4 d-flex flex-row">
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
                                        <span className="descriptions">Lorem ipsum dolor sit amet consectetur adipisicing elit. Nobis, architecto quisquam est harum voluptatum nisi quis veritatis sequi! Autem eos reiciendis cupiditate excepturi velit unde blanditiis pariatur libero sunt ipsam. Lorem ipsum, dolor sit amet consectetur adipisicing elit. Hic, earum odit! Dicta, harum consequuntur sapiente necessitatibus est laboriosam facilis sint tenetur, beatae officiis quae deserunt qui expedita dolor exercitationem perferendis?</span>
                                    </div>
                                    <MdDelete className="delete-button" size={33}/>
                                </div>
                            </>
                        ))
                    }
                    
                </div>
            </div>
        </>
    )
}
export default HistoryPage