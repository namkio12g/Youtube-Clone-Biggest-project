import React from "react";
import { useState,useEffect } from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Featured from "./channel_featured..component"
import Videos from "./channel_videos.component"



import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';

import VideoPlayer from "../../video/video_player.component";
import video from "../music.mp4"

import { GrDislike } from "react-icons/gr";
import { GrLike } from "react-icons/gr";
import { GrCatalogOption } from "react-icons/gr";

import '../scss/channel_page.scss'
const ChannelPage = ()=>{
     const Layout=({children})=>{
            return(
            <>
                <div className="channel-container d-flex flex-column">
                    <div className="profile-block d-flex flex-row">
                        <img className="profile-picture" src="https://img-cdn.pixlr.com/image-generator/history/65bb506dcb310754719cf81f/ede935de-1138-4f66-8ed7-44bd16efc709/medium.webp" alt="" />
                        <div className="profile-info d-flex flex-column ms-4">
                            <span className="title fs-1">Zeros</span>
                            <span className="email-subcribe-video">@mazuong2k • 266 N người đăng ký • 619 video</span>
                            <button className="subcribe-button mt-3"> Subcribe</button>
                        </div>
                    </div>
                    <div className="featured-section mt-5">
                                <button className="active">Trang chủ</button>
                                <button>Video</button>
                    </div>
                    <hr/>
                     <div className="videos-block">
                            {children}
                     </div>
                </div>
            </>
            )
        }

    return(
            <Routes>
            <Route path="videos"
                    element={
                    <Layout>
                        <Videos/>
                    </Layout>
                    }
                    >
            </Route>
            <Route path=""
                    element={
                    <Layout>
                        <Featured/>
                    </Layout>
                    }
                    >
            </Route>
            </Routes>
  )
        
}

export default ChannelPage