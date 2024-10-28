import { CommentsContext } from "../../context/comments.context";
import { useContext } from 'react'

import CommentList from "../../features/comment/commetList.component"
import CommentForm from "../../features/comment/commentForm.component";

const CommentSection  = ({counts})=>{
        const {rootComments,createComment } = useContext(CommentsContext);
      
    return(
        <>
            <div className="comment-section d-flex flex-column">
                <span className="comments-count">{counts} comments</span>
                <CommentForm onSubmit={createComment}/>
                {rootComments?
                    <div className="comments mt-5">
                        <CommentList comments={rootComments}/>
                    </div>
                    :
                    <></>
                }
            </div>
        </>
    )
}
export default CommentSection