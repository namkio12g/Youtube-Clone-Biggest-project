import React from "react";
import axios from "axios";

import { BiSolidCategory } from "react-icons/bi";

import VideoThumbnail from "../video/video_thumbnail.component"; 

import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Container from 'react-bootstrap/Container';
import Carousel from "react-multi-carousel";

import './scss/home.scss'
import "react-multi-carousel/lib/styles.css";

const Home = ({handleToggleSideBar})=>{
    const responsive = {
        desktop: {
            breakpoint: { max: 3000, min: 1200 },
            items: 6,
            slidesToSlide: 2 // optional, default to 1.
        },
        tablet: {
            breakpoint: { max: 1200, min: 700 },
            items: 4,
            slidesToSlide: 1 // optional, default to 1.
        },
        mobile: {
            breakpoint: { max: 700, min: 0 },
            items: 2,
            slidesToSlide: 1 // optional, default to 1.
        }
        };
    const itemss=[
        {
            thumbnail:"https://i.ytimg.com/vi/DtBPnnWHR-Y/hq720.jpg?sqp=-oaymwEcCNAFEJQDSFXyq4qpAw4IARUAAIhCGAFwAcABBg==&rs=AOn4CLBwOfSm8rpmWUE3aDeiQiuNhb-WRw",
            title:"Nicon Corporation",
            view:2500,
            time:"22:43",
            channel:"Avacado"
        },
         {
            thumbnail:"https://img.freepik.com/free-vector/modern-youtube-background-thumbnail-with-papercut-effect_1361-2739.jpg",
            title:"Canon EOS REBEL",
            view:6543,
            time:"59:43",
            channel:"Avacado"
        },
         {
            thumbnail:"https://img.freepik.com/free-psd/creative-youtube-thumbnail-design-template_505751-6054.jpg",
            title:"Nicon unilll",
            view:7789,
            time:"11:43",
            channel:"Avacado"
        },
         {
            thumbnail:"https://i.ytimg.com/vi/WzDmoTydaEk/hq720.jpg?sqp=-oaymwEhCK4FEIIDSFryq4qpAxMIARUAAAAAGAElAADIQj0AgKJD&rs=AOn4CLAdjWUCBXuCPTYOaERM1cVXjs3H8A",
            title:"Sony , ILCE-7M2",
            view:2501,
            time:"01:43",
            channel:"Avacado"
        },
         {
            thumbnail:"https://img.freepik.com/free-psd/education-template-design_23-2151095367.jpg",
            title:"Template Duecation",
            view:5500,
            time:"05:43",
            channel:"Avacado"
        }, {
            thumbnail:"https://img.freepik.com/free-psd/e-learning-template-design_23-2151081798.jpg",
            title:"Your learn lets learn",
            view:25000,
            time:"11:03",
            channel:"Avacado"
        }
        , {
            thumbnail:"https://img.freepik.com/premium-psd/youtube-thumbnail-design-cover-design-template_941802-3172.jpg",
            title:"Nicon Corporation version 1",
            view:44000,
            time:"07:56",
            channel:"Avacado"
        }
    ]
   
    return(
        <div className="media-container">
            <div className="home-screen">
                <div className="category-carousel">
                    <div className="title">
                        <BiSolidCategory size={30}/><span>Categories</span>
                    </div>
                    <div className="carousel">
                    <Carousel  responsive={responsive} containerClass="carousel-container" infinite={true}>
                            
                            <div className="item">
                                Educational
                            </div>
                            <div className="item">
                                Sports
                            </div>
                            <div className="item">
                                Cartoon
                            </div>
                            <div className="item">
                                Anime
                            </div>
                            <div className="item">
                                News
                            </div>
                            <div className="item">
                                Polistic
                            </div>
                            <div className="item">
                                Musician
                            </div>
                            <div className="item">
                                Movies
                            </div>
                            <div className="item">
                                TV shows
                            </div>
                        </Carousel>

                    </div>
                </div>
                <div className="videos-section">
                    <Row>
                        {itemss.map((item,index)=>(
                            <Col md={6} xl={4} key={index}>
                                <VideoThumbnail videoInfo={item}/>
                            </Col>
                            ))}
                    </Row>
                </div>
            </div>
        </div>
    )
}

export default Home

