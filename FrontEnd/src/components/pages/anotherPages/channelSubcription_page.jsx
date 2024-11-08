import React from "react";
import { useState,useEffect, useContext  } from 'react'
import {UserContext} from "../../context/user.context"
import VideoPlayer from "../../features/video/video_player.component";
import LoadingPage from "../../features/loading.component";
import { Link } from 'react-router-dom';
import { FaCheck } from "react-icons/fa";  
import { HiUserGroup } from "react-icons/hi";
import { MdOndemandVideo } from "react-icons/md";

import { ImUser } from "react-icons/im";
import '../scss/channelSubcription.scss'
import axios from "axios";
import video from "../music.mp4"
const SubcriptionPage=()=>{
 
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
    const [loading,setLoading]=useState(true);
    const [error,setError]=useState(null);
    const [btnActive,setBtnActive] = useState(items.map(()=>false))
    const handleBtnActive=(index)=>{
        setBtnActive((prev)=>{
            const newSelectedItems = [...prev];
            newSelectedItems[index] = !newSelectedItems[index];
            return newSelectedItems
        })
    }

    
    const handleRemoveSubscription=async(channelId)=>{
        await axios.post(`/api/channel//subscribe-channel`,{ channelSucribedId:channelId,channelId:user.id})
        .then(res=>{
            setData(prevVideos=>{
                return prevVideos.filter(item=>item._id!==channelId)
            })
        })
        .catch(error=>console.log(error))
    }
    useEffect(()=>{
         async function fetchData(channelId){
            await axios.get(`/api/channel/subscriptions/${channelId}`)
            .then(res=>{setData(res.data);console.log(res);setLoading(false)})
            .catch(error=>{setError(error),console.log(error)})
            
        }
        if(user){
            setLoading(true);
            fetchData(user.id)
        }
    },[user])
    return(
        <>  
            {user
                ?loading
                    ?<>
                        <LoadingPage/>
                    </>
                    
                    :<>
                        <div className="subcription-page">
                            <span className="page-title">Các kênh đã đăng ký</span>
                            
                            <div className="channels mt-4 d-flex flex-column">
                                {data&&data.length!=0
                                    ?data.map((item,index)=>(
                                        <Link to={`/channel/${item._id}`} style={{ textDecoration: 'none' }}>
                                            <div key={index} className="item mb-4 d-flex flex-row">
                                                <img src={item.thumbnail} alt="" />
                                                <div className="channel-info d-flex flex-column">
                                                    <div className="">
                                                        <span className="title d-inline">{item.title} </span>
                                                        <FaCheck className="check-icon ms-1 mb-2    d-inline" size={25}/>
                                                    </div>
                                                <div className="channelTitle-video">
                                                            <span>{item.subscribersCount} người đăng ký</span>
                                                            <ImUser className="group-icon mx-2" size={20}/>   
                                                            <span> • </span>
                                                            <MdOndemandVideo className="video-icon mx-2" size={20}/>   
                                                            <span>{item.videosCount} videos</span>
                                                            
                                                    </div>
                                                    <span className="descriptions">Lorem ipsum dolor sit amet consectetur adipisicing elit. Nobis, architecto quisquam est harum voluptatum nisi quis veritatis sequi! Autem eos reiciendis cupiditate excepturi velit unde blanditiis pariatur libero sunt ipsam. Lorem ipsum, dolor sit amet consectetur adipisicing elit. Hic, earum odit! Dicta, harum consequuntur sapiente necessitatibus est laboriosam facilis sint tenetur, beatae officiis quae deserunt qui expedita dolor exercitationem perferendis?</span>
                                                    <div className="button">
                                                        <div className="position-relative">
                                                            <span onClick={()=>handleBtnActive(index)}>Đã đăng ký</span>
                                                            <div className={btnActive[index]?"expand active":"expand"}>
                                                                <span onClick={()=>handleRemoveSubscription(item._id)}>Hủy đăng ký</span>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </Link>
                                    ))
                                    :<>
                                        <div className="cant-find-container d-flex flex-row justify-content-center align-items-center">
                                            <div className="d-flex flex-row">
                                                    <div>
                                                        <h2>You havent subcribed any channel</h2>
                                                        <h5 className="text-center">Sub more</h5>
                                                    </div>
                                            </div>
                                        </div>
                                    </>
                                }
                                
                            </div>
                        </div>
                    </>
               :<>
                <div className="cant-find-container d-flex flex-row justify-content-center align-items-center text-center">
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
export default SubcriptionPage  