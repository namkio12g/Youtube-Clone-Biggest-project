import React from "react";

import {FaBars} from "react-icons/fa6"
import {FaRegBell} from "react-icons/fa"
import { FaSearch } from "react-icons/fa";
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import './header.scss'
const Header = ({handleToggleSideBar})=>{
    
    return(
        <Row className=" header">
            <Col xs={7} className="left-side">
                <FaBars className="menu_bars" size={45} onClick={()=>handleToggleSideBar()}/>
                <div className="logo-section">
                    <img src="public/logo/primary-logo.png" alt=""  className="logo"/>
                    <img src="public/logo/logo-text1.png" alt=""  className="logo-text"/>
                </div>
                <form action="">
                    <FaSearch size={20} className="search-icon mx-4"/>
                    <input type="text" placeholder="Search"/>
                </form>
            </Col>
            <Col xs={2} className="right-side ">
                <img src="https://plus.unsplash.com/premium_photo-1683121366070-5ceb7e007a97?fm=jpg&q=60&w=3000&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8dXNlcnxlbnwwfHwwfHx8MA%3D%3D" alt="" className="user-icon"/>
                <FaRegBell className="notification-icon" size={45}/>
            </Col>
            


        </Row>
    )
}

export default Header