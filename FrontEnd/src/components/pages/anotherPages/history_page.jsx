import React from "react";
import { useState,useEffect, useContext  } from 'react'
import { Link } from 'react-router-dom';

import VideoPlayer from "../../features/video/video_player.component";
import {UserContext} from "../../context/user.context"
import { MdDelete,MdHistory } from "react-icons/md";
import { FaFire,FaCheck } from "react-icons/fa";  
import LoadingPage from "../../features/loading.component";
import '../scss/history_page.scss'
import video from "../music.mp4"
import axios from "axios";
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
    const {user}=useContext(UserContext);
    const [data,setData]=useState(null);
    const [loading,setLoading]=useState(null);
    const [error,setError]=useState(null);
    
    const hanldeRemoveHistory=async(videoId)=>{
        await axios.delete(`/api/channel/remove-history`,{ data:{videoId:videoId,id:user.id}})
        .then(res=>{
            setData(prevVideos=>{
                return prevVideos.filter(video=>video._id!==videoId)
            })
        })
        .catch(error=>console.log(error))
    }
    useEffect(()=>{
        console.log("123")
         async function fetchData(channelId){
            await axios.get(`/api/channel/history/${channelId}`)
            .then(res=>{setData(res.data);console.log(res);setLoading(false)})
            .catch(error=>{setError(error);setLoading(false);console.log(error)})
        
        }
        if(user){
            setLoading(true);
            fetchData(user.id)
        }
    },[user])
    return(
        <>  
            {user?
                loading
                ?<>
                    <LoadingPage/>
                </>
                :<div className="history-page">
                    <span className="page-title">Nhật ký xem</span>
                    <div className="videos mt-4 d-flex flex-column">
                        {data&&data.length!=0
                            ?data.map((item,index)=>(
                                <>
                                    <div className="item mb-4">
                                         <Link to={`/video/${item._id}`} style={{ textDecoration: 'none' }}>
                                            <div className="d-flex flex-row">
                                                <img src={item.thumbnail} alt="" />
                                                <div className="video-info d-flex flex-column">
                                                    <span className="title">{item.title} </span>
                                                <div className="channelTitle-view">
                                                            <span>{item.channelTitle}</span>
                                                            <FaCheck className="check-icon ms-1"/>   
                                                            <span> • </span>
                                                            <FaFire className="view-icon me-1   "/> 
                                                            <span>{item.views} lượt xem</span>
                                                            
                                                    </div>
                                                    <span className="descriptions">{item.description}</span>
                                                </div>
                                            </div>
                                        </Link>
                                        <MdDelete className="delete-button" size={33} onClick={()=>hanldeRemoveHistory(item._id)}/>
                                    </div>
                                </>
                            ))
                            :<>
                                <div className="cant-find-container d-flex flex-row justify-content-center align-items-center">
                                    <h2>Cant find video</h2>
                                </div>
                            </>
                        }
                        
                    </div>
                </div>
            :<>
                <div className="cant-find-container d-flex flex-row justify-content-center align-items-center">
                    <MdHistory size={40}  className="mx-3"/>
                    <div>
                        <h2>Keep track of what you watch</h2>
                        <h5>Login First</h5>
                    </div>
                </div>
            </>
            }
        </>
    )
}
export default HistoryPage