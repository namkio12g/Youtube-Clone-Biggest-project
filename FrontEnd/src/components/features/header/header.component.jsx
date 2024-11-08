import React, { useEffect, useRef, useState,useContext } from "react";
import { useNavigate } from "react-router-dom";

import {FaBars,FaRegCircleUser} from "react-icons/fa6"
import {FaRegBell,FaSearch} from "react-icons/fa"
import { IoMdArrowBack ,IoMdSettings} from "react-icons/io";
import { IoSettingsOutline } from "react-icons/io5";
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import 'bootstrap/dist/css/bootstrap.min.css'
import './header.scss'
import axios from "axios";
import { UserContext } from "../../context/user.context";
import { SearchContext } from "../../context/search.content";

const Header = ({handleToggleSideBar})=>{
    const {user} = useContext(UserContext);
    const { setSearchTerm } = useContext(SearchContext);
    const searchInpRef=useRef(null);
    const [notifcations,setNotification]=useState(null)
    const [searchActive,setSearchActive]=useState(false);
    const [infoUserBoxActive,setInfoUserBoxActive]=useState(false);
    const [notificationBoxActive,setNotificationBoxActive]=useState(false);
    const infoUserBoxRef=useRef(null);
    const notificationBoxRef=useRef(null);

    const navigate = useNavigate()
    const gotToChannelPage=()=>{
        navigate(`/channel/${user.id}`);
    }
    const navigateByURL=(url)=>{
        navigate(url);
    }
    const handleSearchAcvtive=()=>{
        setSearchActive(prev=>!prev)
    }
    const handleInfoUserBoxActive=()=>{
        setInfoUserBoxActive(prev=>!prev)
    }
  
    const handleSearchInpSubmit=(e)=>{
        e.preventDefault();
        if(searchInpRef.current){
            setSearchTerm(searchInpRef.current.value)
            let hrefArr=window.location.href.toString().split("/")
            if(!hrefArr.includes("search"))
                navigate("/search")
        }
       
    }
    
  
    useEffect(()=>{
        const getRidOfBox=(e)=>{
       
            if(infoUserBoxActive&&infoUserBoxRef.current&&!infoUserBoxRef.current.contains(e.target)){
                setInfoUserBoxActive(false)
            }
            if(notificationBoxActive&&notificationBoxRef.current&&!notificationBoxRef.current.contains(e.target)){
                setNotificationBoxActive(false)
            }
        }
        if(infoUserBoxRef&&notificationBoxRef)
            document.addEventListener("mousedown",getRidOfBox);


        return ()=>{
            document.removeEventListener("mousedown",getRidOfBox);
        }
    },[infoUserBoxActive,notificationBoxActive])
    useEffect(()=>{
        
        async function getNotifications (channelId){
            await axios.get(`/api/channel/notifcation/${channelId}`)
                .then(res=>{setNotification(res.data)})
                .catch(err=>console.log(err))
        }
        if(user){
            getNotifications(user.id) 
           
        }
        
    },[user])
    return(
        <Row className=" header">
            <Col lg={8} md={10} sm={9} xs={8} className="left-side">
                <FaBars className="menu_bars" size={45} onClick={()=>handleToggleSideBar()}/>
                <div className="logo-section" onClick={()=>{window.location.href="/"}}>
                    <img src="/logo/primary-logo.png" alt=""  className="logo"/>
                    <img src="/logo/logo-text1.png" alt=""  className="logo-text"/>
                    
                </div>
                    <FaSearch  className="search-icon-hidden" onClick={handleSearchAcvtive}/>
                    <form  className={searchActive?"search-form active":"search-form"} action="" onSubmit={handleSearchInpSubmit}>
                            <FaSearch  className="search-icon"/>
                            <input type="text" placeholder="Search" ref={searchInpRef}/>
                    </form>
      
            </Col>
            <Col lg={2} md={2} sm={3} xs={4}className="right-side ">
                {user
                    ?<>
                        <div className="position-relative">
                            <img src={user?user.thumbnail:""} alt="" className="user-icon" onClick={handleInfoUserBoxActive}/>
                            <div ref={infoUserBoxRef} className={(infoUserBoxActive?"profile-hidden active":"profile-hidden")+" d-flex flex-column py-3"}>
                                <div className="block d-flex flex-row  px-3 ">
                                    <img src={user?user.thumbnail:""} alt="" />
                                    <div className="profile-info  d-flex flex-column mx-2">
                                        <span>{user.title}</span>
                                        <span>{user.email}</span>
                                        <span className="goToChannel-link" onClick={gotToChannelPage}>Go to your channel</span>
                                    </div>
                                
                                </div>
                                <hr />
                                    <div className="block block-li d-flex flex-row  px-3 py-3">
                                        <IoSettingsOutline size={25}/>
                                        <div className="profile-info  d-flex flex-column ms-4">
                                            <span>Setting</span>
                                        </div>
                                    </div>
                            </div>
                        </div>
                        <div className="notifcation-section">
                            <FaRegBell className="notification-icon" size={45} onClick={()=>setNotificationBoxActive(prev=>!prev)}/>
                            <div ref={notificationBoxRef} className={`expended-div ${notificationBoxActive?'active':''} `}>     
                                <span className="title"> Thông báo</span>
                                <hr/>
                                <div className="main-section">
                                    {notifcations
                                        ?notifcations.map((item,index)=>(
                                            <div className="item" key={index} onClick={()=>navigateByURL(`/video/${item.videoId}`)}>
                                                <div className="mt-1">
                                                    <img src={item.channelInteractionThumbnail} alt="" />

                                                </div>
                                                <div className="ms-3">
                                                    <span >{item.channelInteractionTitle} {item.content}</span>
                                                    <p>{item.timeDifferenceText}</p>
                                                </div>
                                            </div>
                                        ))

                                        :<></>

                                    }
                                    
                                     
                                </div>
                               
                            </div>
                        </div>
                    </>
                   :<>
                        <form action="/api/channel/auth/google" method="get">
                            <button type="submit" >
                                <FaRegCircleUser className="notification-icon" size={45}/>
                            </button>
                        </form>
                        
                    </>
                }
            </Col>
            


        </Row>
    )
}

export default Header