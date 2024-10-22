import React from "react";
import { useState,useEffect } from 'react'

import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';

import VideoPlayer from "../../features/video/video_player.component";
import video from "../music.mp4"
import '../scss/channel_page.scss'
import Carousel from "react-multi-carousel";
import { FaFire,FaCheck } from "react-icons/fa";  

const Featured = ()=>{

           const responsive = {
        desktop: {
            breakpoint: { max: 3000, min: 1470 },
            items: 6,
            slidesToSlide: 2 // optional, default to 1.
        },
        smalldesktop:{
             breakpoint: { max: 1470, min: 1285 },
            items: 5,
            slidesToSlide: 2 
        },
         largetablet: {
            breakpoint: { max: 1285, min: 1080 },
            items: 4,
            slidesToSlide: 1 // optional, default to 1.
        },
        tablet: {
            breakpoint: { max: 1080, min: 700 },
            items: 3,
            slidesToSlide: 1 // optional, default to 1.
        },
        mobile: {
            breakpoint: { max: 700, min: 0 },
            items: 2,
            slidesToSlide: 1 // optional, default to 1.
        }
        };
        
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
       <div className="block">
            <div className="video-primary">
                <div className="video-player">
                 <VideoPlayer src={video} className=""/>
                </div>
                <div className="video-info">
                    <span className="title">NHỮNG ĐỘI BÓNG NÀO ĐỦ SỨC ĐÔI CÔNG VỚI MAN CITY THỜ  VỚI MAN CITY THỜ</span>
                    <div className="views-time">
                        <FaFire className="view-icon mb-2 me-1"/>
                        <span>92.243 lượt xem</span>
                        <span> • </span>
                        <span> 20 giờ trước</span>
                    </div>
                    <span className="descriptions">Lorem ipsum dolor, sit amet consectetur adipisicing elit. Nihil consequuntur omnis beatae dolore veritatis aperiam placeat tempore. Earum iusto unde dignissimos quis voluptas ut, praesentium debitis illo, excepturi ex hic. Lorem ipsum dolor sit amet consectetur adipisicing elit. Esse consequatur excepturi inventore iure repellendus? Nobis, fuga. Cum non, laboriosam, est vel saepe nesciunt nostrum voluptatum nisi deleniti fuga molestiae sunt.</span>
                </div>
            </div>
        <hr />
        <span className="block-title my-3">Videos</span>
         <div className="block-carousel">
            <div className="second-block-carousel">

                    <Carousel  responsive={responsive} containerClass="carousel-container" infinite={false}>
                            
                         {
                        items.map((item,index)=>(
                                <>
                                    <div className="video-item ">
                                            <img  className="" src={item.thumbnail} alt="" />
                                            <div className="video-info d-flex flex-column">
                                                <span className="video-title">{item.title}</span>
                                                 <div className="views-time">
                                                    <FaFire className="view-icon mb-2 me-1"/>
                                                    <span>921k lượt xem</span>
                                                    <span> • </span>
                                                    <span> 20 giờ trước</span>
                                                </div>
                                            </div>
                                        </div>
                                </>
                        ))

                        }
                        </Carousel>
                    </div>

                    </div>
           
                      

       </div>
       <hr />
         <div className="block">
        <span className="block-title my-3">Video noi bat</span>
         <div className="block-carousel">
            <div className="second-block-carousel">

                    <Carousel  responsive={responsive} containerClass="carousel-container" infinite={false}>
                            
                         {
                        items.map((item,index)=>(
                                <>
                                    <div className="video-item ">
                                            <img  className="" src={item.thumbnail} alt="" />
                                            <div className="video-info d-flex flex-column">
                                                <span className="video-title">{item.title}</span>
                                                 <div className="views-time">
                                                    <FaFire className="view-icon mb-2 me-1"/>
                                                    <span>921k lượt xem</span>
                                                    <span> • </span>
                                                    <span> 20 giờ trước</span>
                                                </div>
                                            </div>
                                        </div>
                                </>
                        ))

                        }
                        </Carousel>
                    </div>

                    </div>
           
                      

       </div>
       <hr />
         <div className="block">
        <span className="block-title my-3">Video pho bien</span>
         <div className="block-carousel">
            <div className="second-block-carousel">

                    <Carousel  responsive={responsive} containerClass="carousel-container" infinite={false}>
                            
                         {
                        items.map((item,index)=>(
                                <>
                                    <div className="video-item ">
                                            <img  className="" src={item.thumbnail} alt="" />
                                            <div className="video-info d-flex flex-column">
                                                 <div className="views-time">
                                                    <FaFire className="view-icon mb-2 me-1"/>
                                                    <span>921k lượt xem</span>
                                                    <span> • </span>
                                                    <span> 20 giờ trước</span>
                                                </div>
                                            </div>
                                        </div>
                                </>
                        ))

                        }
                        </Carousel>
                    </div>

                    </div>
           
                      

       </div>
    </>
)
}
export default Featured

