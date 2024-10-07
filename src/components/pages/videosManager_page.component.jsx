import React from "react";
import { useState,useEffect } from 'react'
import DataTable from "react-data-table-component";

import VideoPlayer from "../video/video_player.component";
import DragDropVideos from "../other/dragDropVideos.components";
import AutoResizeTextarea from "../other/textareaWidthAuto.component";

import { FaSearch,FaPlayCircle  } from "react-icons/fa";
import { RiEdit2Fill } from "react-icons/ri";
import { IoIosExit } from "react-icons/io";
import { FaImage } from "react-icons/fa6";

import './scss/videosManager.scss'

import video from "./music.mp4"
import { MdHeight } from "react-icons/md";
const VideosManagerPage=()=>{
    const [fileVideo,setFileVideo]=useState(null)
    const [fileThumbnail,setThumbnail]=useState(null)
    const [flagModalCreate,setFlagModalCreate]=useState(false)


      useEffect(() => {
    document.querySelector(".app_container").style.backgroundColor = '#282828'; 
    return () => {
       document.querySelector(".app_container").style.backgroundColor = ''; // Reset to default color
    };
  }, []);
    const columns=[
       
        {
            name:"Video",
            width:"550px",
            cell:(row)=>(
                <div className="d-flex flex-row">
                    <img src={row.thumbnail} width="250" alt="" />
                    <div className="video-info ms-2">
                        <span className="title">{row.title} </span>
                        
                        <span className="descriptions mt-1">Lorem ipsum dolor sit amet consectetur adipisicing elit. Nobis, architecto quisquam est harum voluptatum nisi quis veritatis sequi! Autem eos reiciendis cupiditate excepturi velit unde blanditiis pariatur libero sunt ipsam. Lorem ipsum, dolor sit amet consectetur adipisicing elit. Hic, earum odit! Dicta, harum consequuntur sapiente necessitatibus est laboriosam facilis sint tenetur, beatae officiis quae deserunt qui expedita dolor exercitationem perferendis?</span>
                         <div className="expand">
                            <FaPlayCircle size={35} className="item"/>
                            <RiEdit2Fill size={35} className="item"/>

                        </div>
                    </div>
                   
                </div>
            ),
            style:{
              padding:"10px 0px",
              width:"300px"
            }

        },
         
          {
            name:"Chế độ xem",
            selector:row=>row.mode
        },
          {
            name:"Thể loại",
            selector:row=>row.category
        },
         {
            name:"Ngày đăng",
            selector:row=>row.category
        },
          {
            name:"Số lượt xem",
            selector:row=>row.view,
            sortable: true,
        },  {
            name:"Số bình luận",
            selector:row=>row.comments,
            sortable: true,
        },  {
            name:"Lượt thích(%)",
            selector:row=>row.like,
            sortable: true,
        },


     ]
    const items=[
        {
            thumbnail:"https://i.ytimg.com/vi/DtBPnnWHR-Y/hq720.jpg?sqp=-oaymwEcCNAFEJQDSFXyq4qpAw4IARUAAIhCGAFwAcABBg==&rs=AOn4CLBwOfSm8rpmWUE3aDeiQiuNhb-WRw",
            title:"Nicon Corporation",
            view:2500,
            time:"22:43",
            like:20,
            comments:5500,
            video:video,
            category:"Music",
            mode:"public"
        },
         {
            thumbnail:"https://img.freepik.com/free-vector/modern-youtube-background-thumbnail-with-papercut-effect_1361-2739.jpg",
            title:"Canon EOS REBEL",
            view:6543,
            time:"59:43",
            like:20,
            comments:5500,
            video:video,
            category:"Music",
            mode:"public"
        },
         {
            thumbnail:"https://img.freepik.com/free-psd/creative-youtube-thumbnail-design-template_505751-6054.jpg",
            title:"Nicon unilll",
            view:7789,
            time:"11:43",
            like:20,
            comments:5500,
            video:video,
            category:"Music",
            mode:"public"
        },
         {
            thumbnail:"https://i.ytimg.com/vi/WzDmoTydaEk/hq720.jpg?sqp=-oaymwEhCK4FEIIDSFryq4qpAxMIARUAAAAAGAElAADIQj0AgKJD&rs=AOn4CLAdjWUCBXuCPTYOaERM1cVXjs3H8A",
            title:"Sony , ILCE-7M2",
            view:2501,
            time:"01:43",
            like:20,
            comments:5500,
            video:video,
            category:"Music",
            mode:"public"
        },
         {
            thumbnail:"https://img.freepik.com/free-psd/education-template-design_23-2151095367.jpg",
            title:"Template Duecation",
            view:5500,
            time:"05:43",
            like:20,
            comments:5500,
            video:video,
            category:"Music",
            mode:"public"
        }, {
            thumbnail:"https://img.freepik.com/free-psd/e-learning-template-design_23-2151081798.jpg",
            title:"Your learn lets learn",
            view:25000,
            time:"11:03",
            like:20,
            comments:5500,
            video:video,
            category:"Music",
            mode:"public"
        }
        , {
            thumbnail:"https://img.freepik.com/premium-psd/youtube-thumbnail-design-cover-design-template_941802-3172.jpg",
            title:"Nicon Corporation version 1",
            view:44000,
            time:"07:56",
            like:20,
            comments:5500,
            video:video,
            category:"Music",
            mode:"public"
        }
    ]
        const [btnActive,setBtnActive] = useState(items.map(()=>false))
        const handleBtnActive=(index)=>{
            setBtnActive((prev)=>{
                const newSelectedItems = [...prev];
                newSelectedItems[index] = !newSelectedItems[index];
                return newSelectedItems
            })
        }
    return(
        <>  
             {flagModalCreate?
             <>
             <div className="modal-div d-flex flex-row justify-content-center align-items-center">
                        <div className="center-div position-relative d-flex flex-column">
                            {fileVideo?
                                <>
                                    
                                    <div className="top-div d-flex flex-row justify-content-between">
                                        <span className="title">Cập nhật thông tin video</span>
                                        <IoIosExit className="exit-icon" size={35} onClick={()=>setFlagModalCreate(false)}/>
                                    
                                    </div>
                                    <hr />
                                    <div className="bottom-div d-flex flex-row">
                                        <div className="left-div d-flex flex-column">
                                            <span className="title"> Chi tiết</span>
                                            <AutoResizeTextarea placeholder={"thêm mô tả tiêu đề video của bạn "} title={"Tiêu đề(bắt buộc)"}/>
                                            <div className="descriptions">
                                                <AutoResizeTextarea placeholder={"Giới thiệu video của bạn cho người xem "} title={"Mô tả"}/>
                                            </div>
                                            <span className="small-title"> Hình thu nhỏ</span>
                                            <div className="thumbnail-box my-2 d-flex flex-row" >
                                                <input type="file" name="thumbnail" id="thumbnail" onChange={(event)=>setThumbnail(URL.createObjectURL(event.target.files[0]))} accept="image/png, image/jpeg"/>
                                                <label htmlFor="thumbnail" className=""> Tải ảnh lên
                                                    <FaImage className="ms-2"/>
                                                </label>
                                                <img src={fileThumbnail?fileThumbnail:"https://media.istockphoto.com/id/1226328537/vector/image-place-holder-with-a-gray-camera-icon.jpg?s=612x612&w=0&k=20&c=qRydgCNlE44OUSSoz5XadsH7WCkU59-l-dwrvZzhXsI="} alt="" />
                                            </div>
                                            <div className="d-flex flex-row">
                                                <div className="selection-item my-3">
                                                    <span>Thể loại</span>
                                                    <select name="cars" id="cars" className="ms-2">
                                                        <option value="volvo">.....</option>
                                                        <option value="saab">Saab</option>
                                                        <option value="mercedes">Mercedes</option>
                                                        <option value="audi">Audi</option>
                                                    </select>
                                                </div>
                                                <div className="selection-item my-3 ms-2">
                                                    <span>Chọn chế độ</span>
                                                    <select name="cars" id="cars" className="ms-2" disabled>
                                                        <option value="volvo">Volvo</option>
                                                        <option value="saab">Saab</option>
                                                        <option value="mercedes">Mercedes</option>
                                                        <option value="audi">Audi</option>
                                                    </select>
                                                </div>
                                            </div>
                                        
                                        </div>
                                        <div className="right-div">
                                            {/* <div className="loading-video">Loading video ...</div> */}
                                            <VideoPlayer src={fileVideo }/>
                                        </div>
                                        
                                    </div>
                                     <div className="fixed-div">
                                        <span className="title">Hoàn thành thông tin trước khi cập nhật</span>
                                        <button> Cập nhật</button>
                                    
                                    </div>
                                </>
                                :
                                <>
                                    <div className="top-div d-flex flex-row justify-content-between">
                                        <span className="title">Tải video lên</span>
                                        <IoIosExit className="exit-icon" size={35} onClick={()=>setFlagModalCreate(false)}/>
                                    </div>
                                    <hr/>
                                    <DragDropVideos file={fileVideo} setFileVideo={setFileVideo} firstText="Kéo và thả tệp video để tải lên" secondText="Các video của bạn sẽ ở chế độ riêng tư cho đến khi bạn xuất bản."/>
                                </>
                                
                            }
                        </div>
                </div>
                </>
                :
                <></>
            }           
            <div className="videos-manager-page">
                <div className="top-div">
                    <span className="page-title">Quản lý các video</span>
                    <div className="block">
                        <div className="searched-name-inp">
                            <input type="text" name="" id="" className="searched-name-inp" placeholder="Search"/>
                            <FaSearch size={25} className="search-icon"/>
                        </div>
                        <div className="selection-item ms-4">
                            <span>Thể loại</span>
                            <select name="cars" id="cars" className="ms-2">
                                <option value="volvo">Volvo</option>
                                <option value="saab">Saab</option>
                                <option value="mercedes">Mercedes</option>
                                <option value="audi">Audi</option>
                            </select>
                        </div>
                        <div className="selection-item ms-4 me-5">
                            <span>Chế độ xem</span>
                            <select name="cars" id="cars" className="ms-2">
                                <option value="volvo">Volvo</option>
                                <option value="saab">Saab</option>
                                <option value="mercedes">Mercedes</option>
                                <option value="audi">Audi</option>
                            </select>
                        </div>
                        <div className="button-section">
                            <button className="create-button" onClick={()=>setFlagModalCreate(true)}> + Tạo mới</button>
                            <button className="delete-button"> - Gỡ bỏ</button>

                        </div>
                    </div>
                </div>
                <div className="bottom-div">
                    <DataTable
                        columns={columns}
                        data={items}
                        pagination
                        selectableRows
                        className="videos-data-table"
                    ></DataTable>
                </div>
            </div>
        </>
    )
}
export default VideosManagerPage 