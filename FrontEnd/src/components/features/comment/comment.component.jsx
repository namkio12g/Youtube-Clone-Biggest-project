import { Link } from 'react-router-dom';

import { FaHeart,FaRegHeart,FaReply } from "react-icons/fa";
import { AiFillEdit } from "react-icons/ai";
import { RiDeleteBin5Fill } from "react-icons/ri";
import CommentList from "./commetList.component";
import CommentForm from "./commentForm.component";
import './comment.scss'
import { CommentsContext } from "../../context/comments.context";
import { UserContext } from "../../context/user.context";

import { useContext,useState } from 'react'
import { Button } from "bootstrap";

const Comment =({comment,areReplied})=>{
    const [formActive,setFormActive]=useState(false)
    const [isEditting,setIsEditting]=useState(false)
    const [isShowingReplies,setIsShowingReplies]=useState(false)

    const {getReplies,createComment,updateComment,deleteComment,toggleLikeComment } = useContext(CommentsContext);
    const {user } = useContext(UserContext);

    const replies=getReplies(comment._id);

    function handleUpdateSubmit(content,parentId,id){
        updateComment(content,parentId,id);
        setIsEditting(false)
    }
    function handlecreateReplySubmit(content,parentId,id){
        createComment(content,parentId,id);
        setFormActive(false)
    }
    return (
    <>
    <div className="comment-item d-flex flex-row mb-3">
            <Link to={`/channel/${comment.channelId}`} style={{ textDecoration: 'none' }}>
                <img  src={comment.channelThumbnail} alt="" className="channel-thumbnail me-3"/>
            </Link>
            <div className="comment-content">
                <div>
                    <Link to={`/channel/${comment.channelId}`} style={{ textDecoration: 'none' }}>
                        <span className="channel-title"> {comment.channelTitle}</span>
                    </Link>
                    <span className="ms-2 time-text">{comment.timeDifferenceText}</span>

                </div>
                <div className='comment-box '>
                    {isEditting?
                    <CommentForm onSubmit={handleUpdateSubmit} text={comment.content} id={comment._id} updateFlag={true}/>
                    :<p>{comment.content}</p>
                    }
                </div>
                <div className='m-0 button-section d-flex flex-row align-items-center mb-1'>
                    {comment.likedByMe
                        ? <FaHeart className="me-1" size={17} onClick={()=>toggleLikeComment(comment._id,comment.channelId,comment.videoId)}/> 
                        :<FaRegHeart className="me-1" size={17} onClick={()=>toggleLikeComment(comment._id,comment.channelId,comment.videoId)}/>
                    }
                    <span className="">{comment.likesCount}</span>
                    {!areReplied? <FaReply size={17} onClick={()=>setFormActive(prev=>!prev)}/>:<></>}

                    { user?(user.id==comment.channelId
                        ?
                            <>
                                <AiFillEdit  size={20} onClick={()=>setIsEditting(prev=>!prev)}/>
                                <RiDeleteBin5Fill size={17} onClick={()=>deleteComment(comment._id)}/>
                            </>
                            :<></>)
                        :<></>



                    }
                    
                </div>
                    {formActive
                        ?
                        <>
                            <CommentForm onSubmit={handlecreateReplySubmit} parentId={comment._id}/>
                            
                        </>
                        :
                        <>
                        <div  className="form hide">

                             
                        </div>
                        </>
                    }
                    {replies
                        ?isShowingReplies
                            ?
                            <div className="my-1">
                                <div className="mb-2">
                                    <span className="show-replies-span" onClick={()=>setIsShowingReplies(false)}> Hide Replies</span>
                                </div>
                                <CommentList className="comment-list-child" comments={replies} areReplied={true}/>

                            </div>
                            :
                                <div>
                                    <span className="show-replies-span" onClick={()=>setIsShowingReplies(true)}> Show more Replies</span>
                                </div>
                        :<>
                        </>
                    }
            
     
                    
                </div>
        
            {/* <CommentList comments={commentsData}/> */}
        </div>
    </>
    )
}
 export default Comment