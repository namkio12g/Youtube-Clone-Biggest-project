import React, { createContext, useState, useEffect, useMemo } from 'react';
import axios from "axios";
export const CommentsContext = createContext();
export const CommentsProvider = ({children,videoId,channelId }) => {
  const [comments, setComments ]= useState(null)
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
    async function  getComments(){
        await axios.get(`/api/interaction/get-comments/${videoId}`, {params:{"channelId":channelId}})
            .then(res => {
                setComments(res.data)
            })
            .catch(error => setError(error.message))
            .finally(()=>{
                setLoading(false)
            })
        }


    useEffect(() => {
        if(videoId)
            axios.get(`/api/interaction/get-comments/${videoId}`, {params:{"channelId":channelId}})
            .then(res => {
                setComments(res.data)
            })
            .catch(error => setError(error.message))
            .finally(()=>{
                setLoading(false)
            })
    }, [videoId])


  const commentByParrentId = useMemo(()=>{
    if(comments==null) return []
    const group={}
    comments.forEach(cmt=>{
        group[cmt.parentId]||=[];
        group[cmt.parentId].push(cmt)
    })
    return group
  },[comments])






  async function createComment(content,parentId,id){
    await axios.post("/api/interaction/create-comment",{
      channelId:channelId,videoId:videoId,content:content,parentId:parentId
    }).then(res=>{;createCommentLocal(res.data)})

  }
  async function deleteComment(id){
    await axios.post("/api/interaction/delete-comment",{
      channelId:channelId,commentId:id
    }).then(res=>{
      console.log(res)
      if(res.data.deletedCount==1)
        deleteCommentLocal(id);
    })
  }
async function updateComment(content,parentId,id){
    await axios.patch("/api/interaction/update-comment",{
      channelId:channelId,commentId:id,content:content
    }).then(res=>{updateCommentLocal(res.data._id,res.data.content)})

  }
async function toggleLikeComment(id,commentChannelId,videoId){
    await axios.post("/api/channel/add-comment-liked",{
      channelId:channelId,commentId:id,commentChannelId:commentChannelId,videoId:videoId
    }).then(res=>{LikeCommentUpdate(id,res.data.addFlag)})

  }





  function LikeCommentUpdate(commentId,flag){
    setComments(prevComments=>{
      return prevComments.map(comment=>{
        if(comment._id==commentId)
          return {...comment,likedByMe:flag,likesCount:flag?comment.likesCount+1:comment.likesCount-1}
        return comment
      })
    })
  }


  function updateCommentLocal(commentId,content){
    setComments(prevComments=>{
        return prevComments.map(comment=>{
            if(comment._id==commentId)
                return {...comment,content};
            else
                return comment;
        })
    })
  }
function createCommentLocal(comment){
    setComments(prevComments=>{
        return [comment,...prevComments]
    })
  }
function deleteCommentLocal(commentId){
  console.log(commentId)
  setComments(prevComments=>{
      return prevComments.filter(comment=>comment._id!==commentId)
  })
}
  function getReplies(parentId){
    return commentByParrentId[parentId]
  }
  return (
    <CommentsContext.Provider value={{ rootComments:commentByParrentId[null],getReplies,createComment,updateComment,toggleLikeComment,deleteComment }}>
      {children}
    </CommentsContext.Provider>
  );
};
