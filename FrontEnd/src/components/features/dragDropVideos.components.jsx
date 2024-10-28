import React, { useRef, useState,useEffect } from "react";

import { MdOutlineRemoveRedEye } from "react-icons/md";        
import { FaUpload } from "react-icons/fa";
import './dragDropVideos.scss'
import spinner from '../../assets/images/xspinner.svg'
const DragDropVideos = ({type,firstText,secondText,setFileVideo})=>{
    const handleDragFile=(event)=>{
        event.preventDefault();

    }
  

    const inpuRef=useRef()
    const [spinnerFlag,setSpinnerFlag]=useState(false)

     const handleDrop=(event)=>{
        event.preventDefault();
        const files=event.dataTransfer.files
        if(files.length!=1 || files[0].type!="video/mp4"){
            alert("file không hợp lệ,yêu cầu 1 file")
        }
        else{
            setSpinnerFlag(true)
            clearTimeout(window.timeoutId)
            window.timeoutId = setTimeout(() => {
            setFileVideo(files[0]);

            }, 2000);

        }
    }
     const inputFile=(event)=>{
        event.preventDefault();
        const files=event.target.files
        if(files.length!=1 || files[0].type!="video/mp4"){
            alert("file không hợp lệ,yêu cầu 1 file")
        }
        else{
            setSpinnerFlag(true)
            clearTimeout(window.timeoutId)
            window.timeoutId = setTimeout(() => {
            setFileVideo(files[0]);

            }, 2000);

        }
    }
    return(
       <div className="drag-drop-box" onDragOver={handleDragFile} onDrop={handleDrop}>
        <div className="center-box ">
            <div  className="upload-icon">
                {spinnerFlag?
                    <img src={spinner} alt="" />
                    :
                    <FaUpload size={60}/> 


                }
            </div>
            <input type="file" hidden ref={inpuRef} accept="video/*" onChange={inputFile}/>
            <span className="white-text">{firstText}</span>
            <span className="gray-text">{secondText}</span>
            <button onClick={()=>inpuRef.current.click()} type="button">Chọn tệp</button>
        </div>
       </div>
    )
}

export default DragDropVideos