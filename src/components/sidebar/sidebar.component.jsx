import {React} from "react";
import { useNavigate } from "react-router-dom";

import { RiHome2Line } from "react-icons/ri";
import { MdOutlineSubscriptions } from "react-icons/md";
import { BiLike } from "react-icons/bi";
import { FaRegHeart } from "react-icons/fa";
import { BsClockHistory } from "react-icons/bs";
import { BiSolidCategory } from "react-icons/bi";
import { RiLogoutBoxLine } from "react-icons/ri";

import './sidebar.scss'
const Sidebar = ({sidebar,user})=>{
    const navigate = useNavigate()
    const gotToNewPage=(url)=>{
    navigate(url);
  }

    return(
        <div className={sidebar ? "sidebar active": "sidebar"}>
            <img src="https://plus.unsplash.com/premium_photo-1683121366070-5ceb7e007a97?fm=jpg&q=60&w=3000&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8dXNlcnxlbnwwfHwwfHx8MA%3D%3D" alt="" className="user-icon"/>
            <div className="link-section">
                <li onClick={()=>gotToNewPage("/video")} >
                    <RiHome2Line size={20} /><span> Home </span>
                </li>
                 <li onClick={()=>gotToNewPage("/channel/")}>
                    <BiSolidCategory size={20}/><span> Categories </span>
                </li>
                 <li onClick={()=>gotToNewPage("/subcription")}>
                    <MdOutlineSubscriptions size={20}/><span> Subscriptions </span>
                </li >
                 <li onClick={()=>gotToNewPage("/videos-liked")}>
                    <BiLike size={20}/><span> Liked </span>
                </li>
                 <li onClick={()=>gotToNewPage("/history")}>
                    <BsClockHistory size={20}/><span> History </span>
                </li>
                 <li onClick={()=>gotToNewPage("/videos-manager")}>
                    <FaRegHeart size={20}/><span> Favourites </span>
                </li>
                {user?
                     <>
                        <hr />
                        <li>
                            <RiLogoutBoxLine size={20}/><span> Log out </span>
                        </li>
                    </>
                    :<></>
                }
            </div>
        </div>
    )
}

export default Sidebar