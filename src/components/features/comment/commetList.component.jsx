
import { FaHeart,FaRegHeart,FaReply } from "react-icons/fa";
import { AiFillEdit } from "react-icons/ai";
import { RiDeleteBin5Fill } from "react-icons/ri";
import Comment
 from "./comment.component";
import './comment.scss'
const CommentList =({comments,areReplied=false})=>{
    return (
        <>
        <div className="comment-list">
            {comments.map((comment,index)=>
                <Comment key={index} comment={comment} areReplied={areReplied}/>
            )

            }
        </div>
        </>
    )
}
 export default CommentList