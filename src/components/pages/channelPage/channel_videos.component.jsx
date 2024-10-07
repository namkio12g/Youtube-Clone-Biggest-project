import React from "react";
import { useState,useEffect } from 'react'

import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';

import VideoPlayer from "../../video/video_player.component";
import video from "../music.mp4"
import '../scss/channel_page.scss'
const Videos = ()=>{


        
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
        <div className="button-section">
            <button className="active">Mới nhất</button>
            <button>Phổ biến</button>
            <button>Cũ nhất</button>
        </div>
        <div className="videos-seciton">
            <Row className="videos-row">
                {
                    items.map((item,index)=>(
                        <Col lg={3} className="video-col">
                            <div className="video ">
                                <img  className="video-thumbnail" src={item.thumbnail} alt="" />
                                <div className="video-info d-flex flex-column">
                                    <span className="video-title">{item.title}</span>
                                    <span className="views-time">50 N lượt xem • 10 ngày trước</span>
                                </div>
                            </div>

                        </Col>
                    ))
                }
            </Row>
        </div> 
    </>
)
}
export default Videos

