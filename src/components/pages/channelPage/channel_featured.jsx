import React from "react";
import { useState,useEffect} from 'react'
import { Link } from 'react-router-dom';

import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';

import LoadingPage from "../../features/loading.component";
import VideoPlayer from "../../features/video/video_player.component";
import video from "../music.mp4"
import '../scss/channel_page.scss'
import Carousel from "react-multi-carousel";
import { FaFire,FaCheck } from "react-icons/fa";  
import axios from "axios";

const Featured = ({channelId})=>{
        const [data,setData]=useState(null);
        const [loading,setLoading]=useState(null);
        const [error,setError]=useState(null);
        const responsive = {
        desktop: {
            breakpoint: { max: 3000, min: 1470 },
            items: 6,
            slidesToSlide: 1 // optional, default to 1.
        },
        smalldesktop:{
             breakpoint: { max: 1470, min: 1285 },
            items: 5,
            slidesToSlide: 1 
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

    useEffect(()=>{
        async function fetchData(){
            await axios.get(`/api/channel-home-videos/${channelId}`)
            .then(res=>{setData(res.data);setLoading(false)})
            .catch(err=>{console.log(err);setLoading(false)})
        }
        if(channelId){
            setLoading(true);
            fetchData();
        }
    },[channelId])
return(
    <>
    {loading
       ?<>
        <LoadingPage/>
       </>
       :
       (data&&data.newVideos[0]
        ?<>
            <div className="block">
                    <div className="video-primary">
                        <div className="video-player">
                        <VideoPlayer video={data.newVideos[0]} className=""/>
                        </div>
                        <div className="video-info">
                            <span className="title">{data.newVideos[0].title}</span>
                            <div className="views-time">
                                <FaFire className="view-icon mb-2 me-1"/>
                                <span>{data.newVideos[0].view} lượt xem</span>
                                <span> • </span>
                                <span> {data.newVideos[0].timeDifferenceText}</span>
                            </div>
                            <span className="descriptions">{data.newVideos[0].description}</span>
                        </div>
                    </div>
                <hr />
                <span className="block-title my-3">Videos</span>
                <div className="block-carousel">
                    <div className="second-block-carousel">

                            <Carousel  responsive={responsive} containerClass="carousel-container" infinite={false}>
                                    
                                {
                                data.newVideos.map((item,index)=>(
                                
                                        <Link key={index} to={`/video/${item._id}`} style={{ textDecoration: 'none' }}>
                                                            
                                                <div  key={index} className="video-item  ">
                                                        <img  className="" src={item.thumbnail} alt="" />
                                                        <div className="video-info d-flex flex-column">
                                                            <span className="video-title">{item.title}</span>
                                                            <div className="views-time">
                                                                <FaFire className="view-icon mb-2 me-1"/>
                                                                <span>{item.views} lượt xem</span>
                                                                <span> • </span>
                                                                <span>{item.timeDifferenceText}</span>
                                                            </div>
                                                        </div>
                                                    </div>
                                        </Link>
                                
                                ))

                                }
                                </Carousel>
                            </div>

                            </div>
                
                            

            </div>
            <hr />
            <div className="block">
                <span className="block-title my-3">Video nổi bật</span>
                <div className="block-carousel">
                    <div className="second-block-carousel">

                            <Carousel  responsive={responsive} containerClass="carousel-container" infinite={false}>
                                    
                                {
                                data.mostLikedVideos.map((item,index)=>(
                          
                                            <Link key={index} to={`/video/${item._id}`} style={{ textDecoration: 'none' }}>
                                                            
                                            <div key={index} className="video-item ">
                                                    <img  className="" src={item.thumbnail} alt="" />
                                                    <div className="video-info d-flex flex-column">
                                                        <span className="video-title">{item.title}</span>
                                                        <div className="views-time">
                                                            <FaFire className="view-icon mb-2 me-1"/>
                                                            <span>{item.views} lượt xem</span>
                                                            <span> • </span>
                                                            <span>{item.timeDifferenceText}</span>
                                                        </div>
                                                    </div>
                                                </div>
                                            </Link>
                                    
                                ))

                                }
                                </Carousel>
                            </div>

                            </div>
                
                            

            </div>
            <hr />
            <div className="block">
                <span className="block-title my-3">Videos phổ biến</span>
                <div className="block-carousel">
                    <div className="second-block-carousel">

                            <Carousel  responsive={responsive} containerClass="carousel-container" infinite={false}>
                                    
                                {
                                data.mostViewsVideos.map((item,index)=>(
                                 
                                            <Link  key={index} to={`/video/${item._id}`} style={{ textDecoration: 'none' }}>           
                                                <div key={index} className="video-item ">
                                                        <img  className="" src={item.thumbnail} alt="" />
                                                        <div className="video-info d-flex flex-column">
                                                            <span className="video-title">{item.title}</span>
                                                            <div className="views-time">
                                                                <FaFire className="view-icon mb-2 me-1"/>
                                                                <span>{item.views} lượt xem</span>
                                                                <span> • </span>
                                                                <span>{item.timeDifferenceText}</span>
                                                            </div>
                                                        </div>
                                                    </div>
                                            </Link>
                                     
                                ))

                                }
                                </Carousel>
                            </div>

                            </div>
                
                            

            </div>
       </>
       :
       <>
            <div className="cant-find-container d-flex flex-row justify-content-center align-items-center">
                {/* <VscRunErrors size={40}  className="mx-3"/> */}
                <h2>This channel doesn't have any videos</h2>
            </div>
       </>
       )
    }
    </>
)
}
export default Featured

