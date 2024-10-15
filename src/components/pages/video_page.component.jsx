import React from "react";
import axios from "axios"
import { useState,useEffect } from 'react'
import { useParams } from 'react-router-dom';
import { useNavigate } from "react-router-dom";

import InfiniteScroll from "react-infinite-scroll-component";

import VideoPlayer from "../video/video_player.component";
;
import spinner from '../../assets/xspinner.svg'

import { VscRunErrors } from "react-icons/vsc";
import { GrDislike } from "react-icons/gr";
import { GrLike } from "react-icons/gr";
import { GrCatalogOption } from "react-icons/gr";
import { FaFire,FaClock  } from "react-icons/fa";
import './scss/video_page.scss'
const VideoPage = ()=>{
        const navigator=useNavigate()


        const { videoId } = useParams();
        const [videoMain,setVideoMain]=useState(null);
        const [videosSidebar,setVideosSidebar]=useState(null);
        const [comments,setComments]=useState(null);

        const [disableInp,setDisableInp] = useState(true)
        const handleDisableInp=(e)=>{

        }

        const handleNavigateVideo=(id)=>{
            navigator(`/video/${id}`)
        }

    useEffect(()=>{
        if(videoId){
            async function fetchData() {
                try {
                const video=await (await axios.get(`/api/get-video/${videoId}`)).data.data
                if(video)
                    setVideoMain(video)
                const res=await axios.get(`/api/get-videos-sidebar/?videoId=${video._id}&channelId=${video.channelId}&categoryId=${video.categoryId}&pagination=0`)
                setVideosSidebar(res.data.data)
                } catch (error) {
                    console.log(error)
                }
            }
        fetchData();
        }
            
    },[videoId])
    return(
        <div className="video-container">
            {videoMain?
                    <>
                
                    <div className="primary">
                        <div className="wrapper">
                            <VideoPlayer video={videoMain} className=""/>
                        </div>
                        <div className="info-section my-2">
                            <span className="video-title">{videoMain.title}</span>
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
                                    <span className="me-3">{videoMain.views}</span>
                                    <span>{videoMain.formatCreatedAt}</span>
                                </div>
                                <p>{videoMain.description}</p>

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
                        {videosSidebar
                        ?
                            <>
                                {videosSidebar.map((item,index)=>
                                <div key={index} className="video-item" onClick={()=>handleNavigateVideo(item._id)}>
                                    
                                    <img src={item.thumbnail} alt="" className="video-thumnnail" />
                                    <div className="video-info">
                                        <span className="title">{item.title}</span>
                                        <div className="video-info-bottom">
                                                <FaFire className="view-icon me-1"/>
                                                <span className="">{item.views}</span>
                                                <span className="mx-2">-</span>
                                                <span className="time">{item.timeDifferenceText}</span>
                                                <FaClock className="time-icon ms-1"/>

                                        </div>
                                    </div>
                                </div>
                                )}
                            </>
                        :
                            <>
                                <div className="loading-box d-flex flex-row justify-content-center align-items-center">
                                    <img src={spinner} alt=""  />
                                </div>
                            </>
                        }       
                    </div>
                    </>
                    :
                    <>
                        <div className="cant-find-container d-flex flex-row justify-content-center align-items-center">
                            <VscRunErrors size={40}  className="mx-3"/>
                            <h2>Cant find video</h2>
                        </div>
                    </>
                }
        </div>
        
    )
}

export default React.memo(VideoPage)