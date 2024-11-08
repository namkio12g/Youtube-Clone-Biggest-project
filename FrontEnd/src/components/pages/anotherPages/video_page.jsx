import React from "react";
import { Link } from 'react-router-dom';

import axios from "axios"
import { useState,useEffect,useContext,useRef } from 'react'
import { useNavigate, useParams  } from "react-router-dom";
import InfiniteScroll from "react-infinite-scroll-component";

import CommentSection from "../../features/comment/commentSection.component";
import CommentForm from "../../features/comment/commentForm.component";
import LoadingPage from "../../features/loading.component";
import UserUnknownModal from "../../modal/userUnknown.component";
import { CommentsProvider } from "../../context/comments.context";
import VideoPlayer from "../../features/video/video_player.component";
import spinner from '../../../assets/images/xspinner.svg'
import { VscRunErrors } from "react-icons/vsc";
import { GrLike,GrCatalogOption,GrDislike } from "react-icons/gr";
import { FaFire,FaClock,FaCheck  } from "react-icons/fa";
import { UserContext } from "../../context/user.context";
import '../scss/video_page.scss'
import { Prev } from "react-bootstrap/esm/PageItem";
const VideoPage = ()=>{
    let timeOutIncViews;
    const {user } = useContext(UserContext);
    const navigator=useNavigate()
    const { videoId } = useParams();
    const [videoMain,setVideoMain]=useState(null);
    const [channelMain,setChannelMain]=useState(null);
    const [videosSidebar,setVideosSidebar]=useState(null);
    const [likeFavSub,setLikeFavSub]=useState(null)
    const [comments,setComments]=useState(null);
    const [disableInp,setDisableInp] = useState(true);
    const [loading,setLoading]=useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [modalPosition, setModalPosition] = useState({ top: 0, left: 0 });
    const modalRef=useRef(null)

    const handleDisableInp=(e)=>{
    }
                

    const handleNavigateVideo=(id)=>{
        navigator(`/video/${id}`)
    }
    const setModalUserUnknown=(rect)=>{
        setModalPosition({
                top: rect.y-180, 
                left: rect.x-330+50,
                });
        setIsModalOpen(true);
    }
    const closeModal = () => setIsModalOpen(false);
    const handleSubscribeButton=async(e)=>{
        if(user){
            await axios.post(`/api/channel/subscribe-channel`,{channelId:user.id,channelSucribedId:channelMain._id})
            .then(res=>{
                if(res.data.addFlag)
                    setLikeFavSub(prev=>({...prev,channelSubscribed:[...prev.channelSubscribed,channelMain._id]}))
                else
                    setLikeFavSub(prev=>(
                {...prev,
                    channelSubscribed:prev.channelSubscribed.filter((item)=>item!==channelMain._id)
                }
                ))
            })
            .catch(error=>console.log(error))
            return;
        }
        const rect = e.currentTarget.getBoundingClientRect();
        setModalUserUnknown(rect)
    }
 
    const handleLikedButton=async(e)=>{
        if(user){
            await axios.post(`/api/channel/add-videos-liked`,{id:user.id,videoId:videoMain._id})
            .then(res=>{
                if(res.data.addFlag)
                    setLikeFavSub(prev=>({...prev,likesVideo:[...prev.likesVideo,videoMain._id]}))
                else
                    setLikeFavSub(prev=>(
                {...prev,
                    likesVideo:prev.likesVideo.filter((item)=>item!==videoMain._id)
                }
                ))

            })
         
            .catch(error=>console.log(error))
         }
        setModalUserUnknown(e.currentTarget.getBoundingClientRect())
    
    }
    const handleSaveButton=async(e)=>{
        if(user){
         await axios.post(`/api/channel/add-favourite-videos`,{id:user.id,videoId:videoMain._id})
        .then(res=>{
            if(res.data.addFlag)
                setLikeFavSub(prev=>({...prev,favouriteVideos:[...prev.favouriteVideos,videoMain._id]}))
            else
                setLikeFavSub(prev=>(
            {...prev,
                favouriteVideos:prev.favouriteVideos.filter((item)=>item!==videoMain._id)
            }
            ))

        })
        .catch(error=>console.log(error))
        }
        setModalUserUnknown(e.currentTarget.getBoundingClientRect())

    }
    
    useEffect(()=>{
        if(videoId){
            async function fetchData() {
                try {
                    const data=(await axios.get(`/api/get-video/${videoId}`)).data;
                    if(data.video){
                        setChannelMain(data.channel)
                        setVideoMain(data.video)
                        setLoading(false)
                    }

                    const res=await axios.get(`/api/get-videos-sidebar/?videoId=${data.video._id}&channelId=${data.video.channelId}&categoryId=${data.video.categoryId}&pagination=0`)
                    setVideosSidebar(res.data.data)

                    } catch (error) {
                        console.log(error)
                    }
                    
            }
            fetchData();
        }
         return(
            clearTimeout(timeOutIncViews)
             )   
    },[videoId])

    useEffect(()=>{
        if(user){
            async function fetchLikeSub() {
                try {
                    setLikeFavSub((await axios.get(`/api/channel/get-like-favourite-subscribe/${user?user.id:""}`)).data[0])
                    } catch (error) {
                        console.log(error)
                    }
            }
            fetchLikeSub();
        }
            
    },[user])

    useEffect(()=>{
        if(user&&videoMain){
            axios.post(`/api/channel/add-history`,{id:user.id,videoId:videoMain._id})
        }
    },[user,videoMain])

    const onIcreaseViews=()=>{
        console.log("update views")
        if(videoMain)
            axios.post(`/api/increase-views/${videoMain._id}`)

    }
    return(
        <div className="video-container">
            <UserUnknownModal modalRef={modalRef} isOpen={isModalOpen} onClose={closeModal} position={modalPosition}/>
            {loading
            ?<>
                <LoadingPage/>
            </>
            
            :videoMain
                ?<>
                    <div className="primary">
                        <div className="wrapper">
                            <VideoPlayer video={videoMain} onIcreaseViews={onIcreaseViews} className=""/>
                        </div>
                        <div className="info-section my-2">
                            <span className="video-title">{videoMain.title}</span>
                            <div className="d-flex flex-row justify-content-between  align-items-center">
                                <div className="mb-3 d-flex flex-row    align-items-center">
                                    <FaFire className="view-icon me-1"/>
                                    <span className="me-3 views-span">{videoMain.views}</span>
                                    <span className="time-diff">{videoMain.timeDifferenceText}</span>

                                </div>
                                <div>
                                    <div className="d-flex align-items-center">
                                        <div className="top d-flex flex-row my-3 align-items-center">
                                            <div className="right d-flex flex-row">
                                                <div className="like-section text-center d-flex flex-row">
                                                    <button onClick={handleLikedButton} className={`like ${likeFavSub?(likeFavSub.likesVideo.includes(videoMain._id)?"active":""):""} d-flex flex-row align-items-center justify-content-center`}>
                                                        <GrLike className="me-2"/>
                                                       {videoMain.likesCounts}
                                                    </button>
                                                    <button className="dislike mx-0">
                                                        <GrDislike className=""/>
                                                    </button>

                                                </div>
                                                <button onClick={handleSaveButton} className={`save-button ${likeFavSub?likeFavSub.favouriteVideos.includes(videoMain._id)?"active":"":""} d-flex flex-row align-items-center`}>
                                                    <GrCatalogOption className="me-2"/>
                                                    {likeFavSub?likeFavSub.favouriteVideos.includes(videoMain._id)?"Saved":"Save":"Save"}
                                                </button>
                                            </div>
                                         </div>
                                    </div>
                                </div>
                            </div>
                            <div className="bottom">
                                <div className="left d-flex flex-row align-items-center justify-content-between mb-4 mt-2">
                                    <div className="d-flex flex-row align-items-center">
                                        <Link to={`/channel/${channelMain._id}`} style={{ textDecoration: 'none' }}>
                                            <img src={channelMain.profilePicture} alt="" className="channel-thumbnail me-3"/>
                                        </Link>
                                        <div className="channel-info d-flex flex-column ">
                                            <Link to={`/channel/${channelMain._id}`} style={{ textDecoration: 'none' }} >
                                                <span className="channel-title d-flex flex-row align-items-center">{channelMain.title}
                                                    <FaCheck className="channel-icon ms-2"/>
                                                </span>
                                            </Link>
                                            <span className="subscriber-count">{channelMain.subscribersCount} subscribers</span>
                                        </div>
                                    </div>
                                    <button onClick={handleSubscribeButton} className={`subscriber-button ${likeFavSub?(likeFavSub.channelSubscribed.includes(channelMain._id)?"active":""):""} ms-3`}>{likeFavSub?likeFavSub.channelSubscribed.includes(channelMain._id)?"Subscribed":"Subscribe":"Subscribe"}</button>
                                </div>
                                <p>{videoMain.description}</p>

                            </div>
                        </div>
                            <CommentsProvider videoId={videoMain._id}  channelId={user?user.id:""}>
                                <CommentSection counts={videoMain.commentsCount}/>
                            </CommentsProvider>
                    </div>
                    <div className="secondary">
                        {videosSidebar
                            ?<>
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
                            :<>
                                <div className="loading-box d-flex flex-row justify-content-center align-items-center">
                                    <img src={spinner} alt=""  />
                                </div>
                            </>
                        }       
                    </div>
                </>
                :<>
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