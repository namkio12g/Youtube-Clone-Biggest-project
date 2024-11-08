import React from "react";
import { useState,useEffect, useContext  } from 'react'
import { Link } from 'react-router-dom';
import { ImUser } from "react-icons/im";
import InfiniteScroll from "react-infinite-scroll-component";
import VideoPlayer from "../../features/video/video_player.component";
import {UserContext} from "../../context/user.context"
import { SearchContext } from "../../context/search.content";
import { MdDelete,MdHistory } from "react-icons/md";
import { FaFire,FaCheck } from "react-icons/fa";  
import LoadingPage from "../../features/loading.component";
import '../scss/search_page.scss'
import video from "../music.mp4"
import axios from "axios";
const SearchedPage=()=>{
    let TimeOut;

    const {searchTerm } = useContext(SearchContext);
    const [pagination,setPagination]=useState(0)
  
    const [filterSelection,setFilterSelection]=useState("videos")
    const {user}=useContext(UserContext);
    const [data,setData]=useState(null);
    const [loading,setLoading]=useState(null);
    const [error,setError]=useState(null);
     const [hasMore,setHasMore]=useState(true)
    useEffect(()=>{
        
         async function fetchData(key){
            if(filterSelection=="videos")
                await axios.get(`/api/filter?pagination=0&number=3&key=${searchTerm}`)
                .then(res=>{setData(res.data);console.log(res);setLoading(false)})
                .catch(error=>{setError(error),console.log(error)})
            else
                await axios.get(`/api/channel/filter?pagination=0&number=3&key=${searchTerm}`)
                .then(res=>{setData(res.data);console.log(res);setLoading(false)})
                .catch(error=>{setError(error),console.log(error)})
            
        }
        if(searchTerm!=""){
            setLoading(true);
            setHasMore(true);
            setPagination(0)
            fetchData(searchTerm)
        }
    },[searchTerm,filterSelection])
    const handleMoreData=()=>{
        setPagination(prev=>prev+1)
        var query=""
        if(filterSelection=="videos")
            query="/api/filter"
        else
            query="/api/channel/filter"
        query=query+`?pagination=${pagination+1}&number=3&key=${searchTerm}`
        axios.get(query)
        .then(res=>{
            if(res.data.length==0){
                setHasMore(false)}
                clearTimeout(TimeOut);
                TimeOut=setTimeout(() => {
                     setData(data.concat(res.data))
                    
                }, 100);
            })
        .catch(error=>console.error("Error:",error))
   }
    return(
        <>  
            {
                loading
                ?<>
                    <LoadingPage/>
                </>
                :<div className="search-page">
                    <div className="title-section">
                        <span className="page-title">Danh sách tìm kiếm</span>
                        <div className="button-section">
                            <button className={filterSelection=="videos"?"active":""} onClick={()=>setFilterSelection("videos")}>videos</button>
                            <button className={filterSelection=="channels"?"active":""} onClick={()=>setFilterSelection("channels")}>channels</button>
                        </div>
                    </div>

                    <div className="videos mt-4 d-flex flex-column">
                 
                        
                        {data&&data.length!=0
                            ?
                            <>
                                <InfiniteScroll dataLength={data.length} className="" next={handleMoreData} hasMore={hasMore} loader={<LoadingPage/>}>
                                    {filterSelection=="videos"
                                    ?data.map((item,index)=>(
                                        
                                            <div key={index} className="item mb-4">
                                                <Link to={`/video/${item._id}`} style={{ textDecoration: 'none' }}>
                                                    <div className="d-flex flex-row">
                                                        <img src={item.thumbnail} alt="" />
                                                        <div className="video-info d-flex flex-column">
                                                            <span className="title">{item.title} </span>
                                                        <div className="channelTitle-view">
                                                                    <span>{item.channelTitle}</span>
                                                                    <FaCheck className="check-icon ms-1"/>   
                                                                    <span> • </span>
                                                                    <FaFire className="view-icon me-1   "/> 
                                                                    <span>{item.views} lượt xem</span>
                                                                    
                                                            </div>
                                                            <span className="descriptions">{item.description}</span>
                                                        </div>
                                                    </div>
                                                </Link>
                                            
                                            </div>
                                        
                                    ))
                                    :data.map((item,index)=>(
                                             <Link to={`/channel/${item._id}`} style={{ textDecoration: 'none' }}>
                                                <div key={index} className="channel-item">
                                                
                                                    <div className="img-section">
                                                        <img src={item.profilePicture} alt="" />
                                                    </div>
                                                    <div className="info-section">
                                                        <div>
                                                            <span className="title">{item.title}</span>
                                                            <FaCheck className="check-icon ms-1"/>   
                                                            <span> • </span>
                                                            <span> {item.subscribersCount} đăng ký</span>
                                                            <ImUser className="group-icon mx-2" size={20}/>   
                                                            
                                                        </div>
                                                        <span className="descriptions">Lorem ipsum dolor sit amet consectetur, adipisicing elit. Nihil voluptas, et molestiae necessitatibus praesentium aliquam, culpa nemo corrupti eveniet quae debitis quibusdam. Assumenda odio similique enim, laboriosam ipsa voluptatum aliquid.</span>
                                                    </div>
                                                </div>
                                            </Link>
                                        
                                    ))
                                    }
                                    </InfiniteScroll>
                                </>
                            :<>
                            
                             <div className="cant-find-container d-flex flex-row justify-content-center align-items-center">
                                <div>
                                    <h2>No videos found</h2>
                                </div>
                            </div>
                            
                            </>
                        }
                        
                    </div>
                </div>
         
            }
        </>
    )
}
export default SearchedPage