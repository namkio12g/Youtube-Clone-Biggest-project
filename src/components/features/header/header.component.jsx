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

const Header = ({handleToggleSideBar})=>{
    const {user} = useContext(UserContext);

    const [searchActive,setSearchActive]=useState(false);
    const [infoUserBoxActive,setInfoUserBoxActive]=useState(false);
    const navigate = useNavigate()
    const gotToChannelPage=()=>{
        navigate("/channel");
    }
    const handleSearchAcvtive=()=>{
        setSearchActive(prev=>!prev)
    }
    const handleInfoUserBoxActive=()=>{
        setInfoUserBoxActive(prev=>!prev)
    }
    const handleAuthGoogle=(e)=>{
       
    }
    return(
        <Row className=" header">
            <Col lg={8} md={10} sm={9} xs={8} className="left-side">
                <FaBars className="menu_bars" size={45} onClick={()=>handleToggleSideBar()}/>
                <div className="logo-section">
                    <img src="/logo/primary-logo.png" alt=""  className="logo"/>
                    <img src="/logo/logo-text1.png" alt=""  className="logo-text"/>
                    
                </div>
                <form className="search-form" action="">
                    <FaSearch  className="search-icon"/>
                    <input type="text" placeholder="Search"/>
                </form>
                <div  className="search-form-hidden" action="">
                    <FaSearch  className="search-icon-hidden" onClick={handleSearchAcvtive}/>
                    <div className={searchActive?"search-section active":"search-section"}>
                        <form className="search-form" action="">
                            <FaSearch  className="search-icon"/>
                        <input type="text" placeholder="Search"/>
                        </form>
                    </div>
                </div>
            </Col>
            <Col lg={2} md={2} sm={3} xs={4}className="right-side ">
                {user
                    ?<>
                        <div className="position-relative">
                            <img src={user?user.thumbnail:""} alt="" className="user-icon" onClick={handleInfoUserBoxActive}/>
                            <div className={(infoUserBoxActive?"profile-hidden active":"profile-hidden")+" d-flex flex-column py-3"}>
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
                        <FaRegBell className="notification-icon" size={45} onClick={handleAuthGoogle}/>
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