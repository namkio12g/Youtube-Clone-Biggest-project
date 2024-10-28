import React,  { useState,useEffect,useRef,useContext } from "react";
import axios from "axios";
import DataTable from "react-data-table-component";
import VideoPlayer from "../../features/video/video_player.component";
import DragDropVideos from "../../features/dragDropVideos.components";
import AutoResizeTextarea from "../../features/textareaWidthAuto.component";

import { FaSearch,FaPlayCircle,FaCheck  } from "react-icons/fa";
import { RiEdit2Fill } from "react-icons/ri";
import { IoIosExit } from "react-icons/io";
import { FaImage } from "react-icons/fa6";
import { GiCancel } from "react-icons/gi";
import video from "../music.mp4"
import { MdHeight } from "react-icons/md";
import { UserContext } from "../../context/user.context";

import '../scss/videosManager.scss'
const VideosManagerPage=()=>{
    const {user } = useContext(UserContext);
    let hideNotificationTimeout;

    const titleInpRef=useRef(null);
    const cateSelectRef=useRef(null);
    const modeSelectRef=useRef(null);
    const updateBtnRef=useRef(null);
    const desInpRef=useRef(null)
    const modeFilterRef=useRef(null)
    const inpFilterRef=useRef(null)
    const cateFilterRef=useRef(null)

    const [videoRecord,setVideoRecord]=useState(null)
    const [fileThumbnail,setThumbnail]=useState(null)
    const [flagModalCreate,setFlagModalCreate]=useState(false)
    const [flagNotification,setFlagNotification]=useState(false)
    const [categories,setCategories]=useState(null)
    const [data,setData]=useState(null)
    const [records,setRecords]=useState(null)
    const [idVideoRecord,setIdVideoRecord]=useState(null)
    const [selectedRows, setSelectedRows] = useState([]);
    const filterData=()=>{
        const newData=data.filter(row=>{
            let dataTemp=row.title.toLowerCase().includes(inpFilterRef.current.value.toLowerCase())
            if (cateFilterRef.current.value !== "") {
             dataTemp = dataTemp && row.categoryId === cateFilterRef.current.value;
            }

            if (modeFilterRef.current.value !== "") {
                dataTemp = dataTemp && row.modeView === modeFilterRef.current.value;
            }
            return dataTemp
        })
        setRecords(newData)
    }


    const checkValidateInput=()=>{
        if(titleInpRef.current.value==""||modeSelectRef.current.value==""||cateSelectRef.current.value==""){
            updateBtnRef.current.classList.remove("active")
            updateBtnRef.current.disabled=true;
        }
        else{
            updateBtnRef.current.classList.add("active")
            updateBtnRef.current.disabled=false;
        }

    }

    const handleSetFileVideo=(file)=>{
        const form = new FormData();
        form.append('file', file);
        form.append('channelId',user.id)
        axios.post(`/api/create-video`,form,{withCredentials:true
            ,headers: {
                    'Content-Type': 'multipart/form-data'
                }
        })
      .then(res => {
        setVideoRecord(res.data.video);
      })
      .catch(error => console.log(error));
      
    }
    // edit buttion
    const handleEditRecord=(videoId)=>{
        console.log(videoId)
        axios.get(`/api/get-one-video/${videoId}`)
        .then(res => {
            console.log(res)
            const video=res.data.video;
            setIdVideoRecord(video._id)
            setVideoRecord(video);
            setThumbnail(video.thumbnail)
            setFlagModalCreate(true);

        })
        .catch(error => console.log(error));
        
    }
      //delete buttion
    const handleDeleteRecords=()=>{
        if(selectedRows.length>0){
            axios.post(`/api/delete-video`,{videoIds:selectedRows,channelId:user.id})
            .then(res => {
               console.log(res)

            })
            .catch(error => console.log(error));
        }
        else{
            alert("Vui lòng tích vào video bạn muốn chọn")
        }
        
    }
    
    const handleRowSelected =(selectedState) => {
          const ids = selectedState.selectedRows.map(row => row.id);
        setSelectedRows(ids);
    };
    useEffect(() => {
        if (!user || !user.id) {
            console.error('User not found. Please log in or refresh the page.');
            return;
        }
        document.querySelector(".app_container").style.backgroundColor = '#282828'; 
        // fetch categories
        fetch("/api/get-categories",{
            method:"GET",
        })
        .then(res=>res.json())
        .then(data=>{setCategories(data.data)})
        .catch(error=>console.error("Error:",error))


        const eventSource = new EventSource(`/api/events?channelId=${user.id}`);
        eventSource.onmessage = (event) => {
            const newData=JSON.parse(event.data)
            if(!newData.firstLoad)
                setFlagNotification(true)
            clearTimeout(hideNotificationTimeout);
            hideNotificationTimeout = setTimeout(() => {
                setFlagNotification(false);
            }, 3000);
          
            setData(newData.videos)  
            setRecords(newData.videos)
            if(idVideoRecord){
               setVideoRecord(newData.videos.filter((item)=>item._id===videoRecord._id)[0])
            }
        };
       
        return () => {
        clearTimeout(hideNotificationTimeout);
        document.querySelector(".app_container").style.backgroundColor = ''; 
        eventSource.close();
    };
    },[idVideoRecord,user]);
    const columns=[
        {
            name:"Video",
            width:"550px",
            cell:(row)=>(
                <div className={`image-box ${row.status=="ready"?"":"processing"} d-flex flex-row`}>
                    {row.thumbnail!=""?
                        <>
                        <div className="position-relative">
                            <img src={row.thumbnail} width="250" alt="" />
                            <span className="duration-text">{row.durationText}</span>
                        </div>
                        </>
                        :
                        <div className="image-loading">
                            <span> loading...</span>
                        </div>

                    }
                    <div className="video-info ms-2">
                        <span className="title">{row.title} </span>
                        <span className="descriptions mt-1" width="292">{row.description}</span>
                         <div className="expand">
                            <FaPlayCircle size={35} className="item"/>
                            <RiEdit2Fill size={35} className="item" onClick={()=>{handleEditRecord(row._id)}}/>

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
            selector:row=>row.modeView
        },
          {
            name:"Thể loại",
            selector:row=>row.category
        },
         {
            name:"Ngày đăng",
            selector:row=>row.createdAt,
            cell:(row)=>(
                <span>{row.formatCreatedAt}</span>
            ),
            sortable:true
        },
          {
            name:"Số lượt xem",
            selector:row=>row.views,
            sortable: true,
        },  {
            name:"Số bình luận",
            selector:row=>row.commentsCount,
            sortable: true,
        },  {
            name:"Lượt thích(%)",
            selector:row=>row.likesCounts,
            cell:(row)=>(
                <span>{row.likesCounts}</span>
            ),
            sortable: true,
        },


     ]
  


    const CustomNoRecordsMessage = () => {
    return (
        <div style={{ padding: '10px', textAlign: 'center' }} className="nodata-div">
        <h3>No records found!</h3>
        <p>It looks like there are no records to display. Try adjusting your filters or adding new data.</p>
        </div>
    );
    };


    return(
        <> {user?
            <>
                {flagModalCreate
                    ?<>
                        <div className="modal-div d-flex flex-row justify-content-center align-items-center">
                            {videoRecord?
                                <>
                                    <form action={`/api/update-video/${videoRecord._id}`} method="POST" encType="multipart/form-data"className="center-div position-relative d-flex flex-column">
                                    <div className="top-div d-flex flex-row justify-content-between">
                                        <span className="title">Cập nhật thông tin video</span>
                                        <IoIosExit className="exit-icon" size={35} onClick={()=>{setFlagModalCreate(false);setVideoRecord(null);setIdVideoRecord(null)}}/>
                                    
                                    </div>
                                    <hr />
                                    <div className="bottom-div d-flex flex-row">
                                            <div className="left-div d-flex flex-column">
                                                <input name="channelId" value={user.id} type="hidden"/>
                                                <span className="title"> Chi tiết</span>
                                                <div  onChange={checkValidateInput}>
                                                    <AutoResizeTextarea placeholder={"thêm mô tả tiêu đề video của bạn "} title={"Tiêu đề(bắt buộc)"} text={videoRecord.title} txtAreaRef={titleInpRef} nameInp={"title"} />
                                                </div>
                                                <div className="descriptions"  onChange={checkValidateInput}>
                                                    <AutoResizeTextarea placeholder={"Giới thiệu video của bạn cho người xem "} title={"Mô tả"} text={videoRecord.description} txtAreaRef={desInpRef} nameInp={"description"}/>
                                                </div>
                                                <span className="small-title"> Hình thu nhỏ</span>
                                                <div className="thumbnail-box my-2 d-flex flex-row" onChange={checkValidateInput}>
                                                    <input type="file" name="thumbnail" id="thumbnail" onChange={(event)=>setThumbnail(URL.createObjectURL(event.target.files[0]))} accept="image/png, image/jpeg"/>
                                                    <label htmlFor="thumbnail" className=""> Tải ảnh lên
                                                        <FaImage className="ms-2"/>
                                                    </label>
                                                    <img src={fileThumbnail?fileThumbnail:"https://media.istockphoto.com/id/1226328537/vector/image-place-holder-with-a-gray-camera-icon.jpg?s=612x612&w=0&k=20&c=qRydgCNlE44OUSSoz5XadsH7WCkU59-l-dwrvZzhXsI="} alt=""  />
                                                </div>
                                                <div className="d-flex flex-row">
                                                    <div className="selection-item my-3">
                                                        <span>Thể loại</span>
                                                        {categories
                                                            ?<select name="category" id="category" className="ms-2" onChange={checkValidateInput} ref={cateSelectRef}>
                                                                <option value="">...</option>
                                                                    {categories.map((item)=>(<option value={item._id} selected={videoRecord.categoryId==item._id?"true":""} >{item.title}</option>))}
                                                                
                                                            </select>
                                                            :
                                                            <></>
                                                        }
                                                    </div>
                                                    <div className="selection-item my-3 ms-2">
                                                        <span>Chọn chế độ</span>
                                                        <select name="modeView" id="modeView" className="ms-2" onChange={checkValidateInput}   ref={modeSelectRef}>
                                                            <option value="public" selected={videoRecord.modeView=="public"?"true":""}>public</option>
                                                            <option value="private" selected={videoRecord.modeView=="private"?"true":""}>private</option>
                                            
                                                        </select>
                                                    </div>
                                                </div>
                                            
                                            </div>
                                        <div className="right-div">
                                            {videoRecord.videoUrl&&videoRecord.videoUrl.length>0
                                            ?<VideoPlayer video={videoRecord}/> 
                                            :<div className="loading-video">Loading video ...</div>
                                            }
                                        </div>
                                        
                                    </div>
                                        <div className="fixed-div">
                                        <span className="title">Hoàn thành thông tin trước khi cập nhật</span>
                                        <button type="submit" className="update-button" disabled ref={updateBtnRef}> Cập nhật</button>
                                    
                                    </div>

                                    </form>
                                </>
                                :<>
                                    <div className="center-div position-relative d-flex flex-column">
                                        <div className="top-div d-flex flex-row justify-content-between">
                                            <span className="title">Tải video lên</span>
                                            <IoIosExit className="exit-icon" size={35} onClick={()=>{setFlagModalCreate(false);setVideoRecord(null)}}/>
                                        </div>
                                        <hr/>
                                        <DragDropVideos file={videoRecord} setFileVideo={handleSetFileVideo} firstText="Kéo và thả tệp video để tải lên" secondText="Các video của bạn sẽ ở chế độ riêng tư cho đến khi bạn xuất bản."/>
                                    </div>
                                </>
                            }
                        </div>
                    </>
                    :
                    <></>
                }
                {flagNotification
                    ?<>
                        <div className="notification success d-flex flex-row align-items-center px-3">
                            <div className="d-flex flex-row align-items-center">
                                <FaCheck className="icon" size={37}/>
                                <div className="d-flex flex-column ms-3">
                                    <span className="title">Thành công</span>
                                    <span> Cập nhật thành công</span>
                                </div>
                            </div>
                            <GiCancel size={30} className="icon-cancel" onClick={()=>{setFlagNotification(false)}}/>
                        </div>    
                    </>
                    :<>
                    </>

                }
                        
                <div className="videos-manager-page">
                    <div className="top-div">
                        <span className="page-title">Quản lý các video</span>
                        <div className="block">
                            <div className="searched-name-inp">
                                <input type="text" name="" id="" className="searched-name-inp" placeholder="Search" onChange={filterData} ref={inpFilterRef}/>
                                <FaSearch size={25} className="search-icon"/>
                            </div>
                            <div className="selection-item ms-4">
                                <span>Thể loại</span>
                                <select name="category" id="category" className="ms-2" onChange={filterData} ref={cateFilterRef}>
                                    <option value="">...</option>
                                    {categories
                                        ?categories.map((item)=>(<option value={item._id}>{item.title}</option>))
                                        :<option value="">...</option>
                                    }
                                </select>
                            </div>
                            <div className="selection-item ms-4 me-5">
                                <span>Chế độ xem</span>
                                <select name="modeView" id="modeView" className="ms-2" onChange={filterData} ref={modeFilterRef}>
                                    <option value="">...</option>
                                    <option value="public">public</option>
                                    <option value="private">private</option>
                        
                                </select>
                            </div>
                            <div className="button-section">
                                <button className="create-button" onClick={()=>setFlagModalCreate(true)}> + Tạo mới</button >
                                <button className="delete-button" onClick={handleDeleteRecords}> - Gỡ bỏ</button>

                            </div>
                        </div>
                    </div>
                    <div className="bottom-div">
                        {records?
                            <DataTable
                                noDataComponent={<CustomNoRecordsMessage/>}
                                columns={columns}
                                data={records}
                                pagination
                                selectableRows
                                className="videos-data-table"
                                onSelectedRowsChange={handleRowSelected}
                            ></DataTable>
                            :<></>
                        }
                    </div>
                </div>
            </>
            :<>
                <div className="cant-find-container d-flex flex-row justify-content-center align-items-center">
                    {/* <VscRunErrors size={40}  className="mx-3"/> */}
                    <h2>Login first</h2>
                </div>
            
            </>
        }
        </>
    )
}
export default VideosManagerPage 