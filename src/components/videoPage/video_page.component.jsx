import React from "react";
import { useState,useEffect } from 'react'

import VideoPlayer from "../video/video_player.component";

import { GrDislike } from "react-icons/gr";
import { GrLike } from "react-icons/gr";
import { GrCatalogOption } from "react-icons/gr";

import './video_page.scss'
import video from "./music.mp4"
const VideoPage = ()=>{
       const [disableInp,setDisableInp] = useState(true)
        const handleDisableInp=(e)=>{

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
        <div className="video-container">
            <div className="primary">
                <div className="wrapper">
                    <VideoPlayer src={video} className=""/>
                </div>
                <div className="info-section my-2">
                    <span className="video-title">Nicon Corporation version 1</span>
                    <div className="top d-flex flex-row my-3 align-items-center">
                        <div className="left d-flex flex-row align-items-center">
                            <img src="https://img.freepik.com/premium-psd/youtube-thumbnail-design-cover-design-template_941802-3172.jpg" alt="" className="channel-thumbnail me-3"/>
                            <div className="channel-info d-flex flex-column">
                                <span className="channel-title">The Reviewer</span>
                                <span>1,08 M subscriber</span>
                            </div>
                            <button className="subscriber-button ms-3">Subscribe</button>
                        </div>
                        <div className="right d-flex flex-row">
                            <div className="like-section text-center d-flex flex-row">
                                <button className="like d-flex flex-row align-items-center justify-content-center">
                                    <GrLike className="me-2"/>
                                    Liked 
                                </button>
                                <button className="dislike mx-0">
                                    <GrDislike className=""/>
                                </button>

                            </div>
                            <button className="d-flex flex-row align-items-center">
                                <GrCatalogOption className="me-2"/>
                                Save
                                </button>
                        </div>

                    </div>
                    <div className="bottom">
                        <div className="mb-3">
                            <span className="me-3">386.677 views</span>
                            <span>12 Oct, 2023</span>
                        </div>
                        <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Optio dignissimos laborum consequatur corporis dolores? Blanditiis soluta laborum sunt pariatur aliquam quasi recusandae ratione assumenda aliquid. Corrupti, deleniti delectus. Id, nulla. Lorem ipsum dolor sit, amet consectetur adipisicing elit. Dolorem velit quis quisquam, et explicabo dolor error ipsum soluta qui saepe praesentium laudantium aspernatur earum temporibus nam ad eaque neque illum.</p>

                    </div>
                </div>
                <div className="comment-section d-flex flex-column">
                    
                    <span className="comments-count">129 comments</span>
                    <div className="comment-input">
                        <img src="https://img.freepik.com/premium-psd/youtube-thumbnail-design-cover-design-template_941802-3172.jpg" alt="" className="channel-thumbnail me-3"/>
                        <textarea name="comment" className="mt-2" id="" placeholder="Write your comment"></textarea>
                        <div className="mt-2">
                            <button className="comment-button me-2"> Comment </button>
                            <button className="clear-button"> Clear </button>
                        </div>
                    </div>

                    <div className="comments mt-5">
                        <div className="item d-flex flex-row mb-3">
                            <img src="https://img.freepik.com/premium-psd/youtube-thumbnail-design-cover-design-template_941802-3172.jpg" alt="" className="channel-thumbnail me-3"/>
                            <div className="comment-content">
                                <div>
                                    <span className="channel-title"> The Reviewer</span>
                                    <span className="ms-3">1 years</span>
                                </div>
                                <p>Lorem, ipsum dolor sit amet consectetur adipisicing elit. Deleniti, explicabo veritatis cumque maiores consequuntur voluptatibus voluptas unde amet? Minima magnam, corporis adipisci reprehenderit labore alias nam aspernatur blanditiis vel explicabo.</p>
                            </div>
                        </div>
                        <div className="item d-flex flex-row mb-3">
                            <img src="https://img.freepik.com/premium-psd/youtube-thumbnail-design-cover-design-template_941802-3172.jpg" alt="" className="channel-thumbnail me-3"/>
                            <div className="comment-content">
                                <div>
                                    <span className="channel-title"> The Reviewer</span>
                                    <span className="ms-3">1 years</span>
                                </div>
                                <p>Lorem, ipsum dolor sit amet consectetur adipisicing elit. Deleniti, explicabo veritatis cumque maiores consequuntur voluptatibus voluptas unde amet? Minima magnam, corporis adipisci reprehenderit labore alias nam aspernatur blanditiis vel explicabo.</p>
                            </div>
                        </div>

                    </div>

                </div>
            </div>
            <div className="secondary">
                {items.map((item,index)=>
                <div key={index} className="video-item">
                    <img src={item.thumbnail} alt="" className="video-thumnnail" />
                    <div className="video-info">
                        <span className="title">{item.title}</span>
                        <div className="video-info-bottom">
                            <span className="">{item.view} views</span>
                            <span className="time">- 9 days</span>
                        </div>
                    </div>
                </div>
                )}
            </div>
        </div>
    )
}

export default VideoPage