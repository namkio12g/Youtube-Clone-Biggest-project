
import { FaArrowAltCircleUp } from "react-icons/fa";
import { TiDelete } from "react-icons/ti";
import AutoResizeTextarea from "../textareaWidthAuto.component";
import './commentForm.scss'
import { useRef, useState,useContext } from "react";
import { UserContext } from "../../context/user.context";

const CommentForm=({onSubmit,text="",parentId=null,id=null,updateFlag=false})=>{
    const {user } = useContext(UserContext);
    const [areaText,setAreaText]=useState(text)
    const textAreaRef=useRef(null)
    const [buttonDisabled,setButtonDisabled]=useState(true)
    const handleCommentSubmit = () =>{
        if(!buttonDisabled){
            onSubmit(textAreaRef.current.value,parentId,id);
            setAreaText("");
            setButtonDisabled(true);
            textAreaRef.current.value=""
        }
    }
    const handleOnchangeText=()=>{
        setAreaText(textAreaRef.current.value);
        if(textAreaRef.current.value=="")
            setButtonDisabled(true)
        else
            setButtonDisabled(false)
    }
    return (
    <>
    {user?
        <div className="comment-form" onChange={handleOnchangeText}>
            <AutoResizeTextarea placeholder={"Write your comment"} title={""} fontSize={"20px"} txtAreaRef={textAreaRef} nameInp="content" text={areaText}/>
            {updateFlag?<></>:<img src={user.thumbnail} alt="" className="channel-thumbnail me-3"/>}
            <FaArrowAltCircleUp  className={`submit-comment ${!buttonDisabled?"active":""}`} size={30} onClick={handleCommentSubmit}/>
        
        </div>
        :<></>
    }
    </>
    )
}
 export default CommentForm