import React from "react";
import { useState,useEffect,useContext } from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Featured from "./channel_featured"
import Videos from "./channel_videos"

import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';

import VideoPlayer from "../../features/video/video_player.component";
import video from "../music.mp4"
import { UserContext } from "../../context/user.context";

import { GrDislike } from "react-icons/gr";
import { GrLike } from "react-icons/gr";
import { GrCatalogOption } from "react-icons/gr";
import { useParams  } from "react-router-dom";
import { Link } from 'react-router-dom';

import '../scss/channel_page.scss'
import axios from "axios";

const ChannelPage = ()=>{
    const { channelId } = useParams();
    const {user}=useContext(UserContext)
    const [channel,setChannel]=useState(null);
    const [site,setSite]=useState("features")

    const handleSubcribeButton=async ()=>{
        if(user&&channel)
            await axios.post(`/api/channel/subcribe-channel`,{channelId:user.id,channelSucribedId:channel._id})
            .then(res=>{
                setChannel(prev=>({...prev,subcribedByMe:res.data.addFlag}))
            })
            .catch(error=>console.log(error))

    }
    useEffect(()=>{
        if(channelId){
            axios.get(`/api/channel/get-channel-info-page/${channelId}`,{params:{userId:user?user.id:null}})
            .then(res=>setChannel(res.data))
            .catch(err=>console.log(err))
        }

    },[channelId])


    const Layout=({children})=>{
            return(
            <>
            {channel
                ?
                <>
                <div className="channel-container d-flex flex-column">
                    <div className="profile-block d-flex flex-row">
                        <img className="profile-picture" src={channel.profilePicture} alt="" />
                        <div className="profile-info d-flex flex-column ms-4">
                            <span className="title fs-1">{channel.title}</span>
                            <span className="email-subcribe-video"> {channel.subcribersCount} người đăng ký • {channel.videosCount} video</span>
                            {user
                                ?user.id==channelId
                                    ?<Link to={`/videos-manager`} style={{ textDecoration: 'none' }}>
                                        <button className={`subcribe-button mt-3`}>Quản lý video</button>
                                     </Link>
                                    :<button className={`subcribe-button  ${!channel.subcribedByMe?"active":""} mt-3`}> {!channel.subcribedByMe?"Subcribed":"Subcribe"}</button>
                                :
                                <button onClick={handleSubcribeButton} className={`subcribe-button  ${!channel.subcribedByMe?"active":""} mt-3`}> {!channel.subcribedByMe?"Subcribed":"Subcribe"}</button>
                            }   
                        </div>
                    </div>
                    <div className="featured-section mt-5">
                                <Link to={`/channel/${channelId}/`} style={{ textDecoration: 'none' }}>
                                     <button className={site=="features"?"active":""} onClick={()=>setSite("features")}>Trang chủ</button>
                                </Link>       
                                <Link to={`/channel/${channelId}/videos`}  style={{ textDecoration: 'none' }}>
                                    <button className={site=="videos"?"active":""} onClick={()=>setSite("videos")}>Video</button>
                                </Link>       

                    </div>
                    <hr/>
                     <div className="videos-block">
                            {children}
                     </div>
                </div>
                </>
                :
                <>
                     <div className="cant-find-container d-flex flex-row justify-content-center align-items-center">
                         {/* <VscRunErrors size={40}  className="mx-3"/> */}
                        <h2>Cant find the channel</h2>
                    </div>
                </>
            }
            </>
            )
    }

    return(
            <Routes>
            <Route path="videos"
                    element={
                    <Layout>
                        <Videos channelId={channelId}/>
                    </Layout>
                    }
                    >
            </Route>
            <Route path=""
                    element={
                    <Layout>
                        <Featured channelId={channelId}/>
                    </Layout>
                    }
                    >
            </Route>
            </Routes>
  )
        
}

export default ChannelPage