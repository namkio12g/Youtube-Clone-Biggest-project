import React from "react";
import { useState,useEffect } from 'react'

import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import LoadingPage from "../../features/loading.component";

import InfiniteScroll from "react-infinite-scroll-component";
import VideoPlayer from "../../features/video/video_player.component";
import video from "../music.mp4"
import '../scss/channel_page.scss'
import axios from "axios";
const Videos = ({channelId})=>{
    let TimeOut;
    const [data,setData]=useState(null);
    const [loading,setLoading]=useState(null);
    const [find,setFind]=useState("time-desc");
    const [pagination,setPagination]=useState(0)
    const [hasMore,setHasMore]=useState(true)
    const findSelections=[
        {
        name:"Mới nhất",
        value:"time-desc"
        },{
        name:"Cũ nhất",
        value:"time-asc"
        },{
        name:"Phổ biến",
        value:"views"
        },
    ]
    const handleMoreData=()=>{
        setPagination(prev=>prev+1)
        axios.get(`/api/channel-videos/${find}`,{params:{channelId:channelId,pagination:pagination+1}})
        .then(res=>{
            if(res.data.length==0)
                setHasMore(false)
            clearTimeout(TimeOut);
            TimeOut=setTimeout(() => {
                    setData(data.concat(res.data))
                
            }, 500);
            })
        .catch(error=>console.error("Error:",error))
   }


    useEffect(()=>{
            async function fetchData(){
                await axios.get(`/api/channel-videos/${find}`,{params:{channelId:channelId,pagination:pagination}})
                .then(res=>{setData(res.data);setLoading(false)})
                .catch(err=>{console.log(err);setLoading(false)})
            }
            if(channelId){
                setLoading(true);
                fetchData();
            }
    },[channelId,find])
    
  
return(
    <>
     {loading
       ?<>
        <LoadingPage/>
       </>
       :<>
        <div className="button-section">
            {
                findSelections.map((item)=>(
                     <button className={`${item.value==find?"active":""}`} onClick={()=>{setFind(item.value),setPagination(0)}}>{item.name}</button>
                ))
            }
        </div>
        <div className="videos-seciton">
            {data
                ?<InfiniteScroll dataLength={data.length} className="" next={handleMoreData} hasMore={hasMore} loader={<LoadingPage/>}>
                    <Row className="videos-row">
                        {

                            data.map((item,index)=>(
                                <Col lg={3} sm={6} md={4} className="video-col">
                                    <div className="video ">
                                        <img  className="video-thumbnail" src={item.thumbnail} alt="" />
                                        <div className="video-info d-flex flex-column">
                                            <span className="video-title">{item.title}</span>
                                            <span className="views-time">{item.views} lượt xem • {item.timeDifferenceText}</span>
                                        </div>
                                    </div>

                                </Col>
                            ))
                        }
                    </Row>
                </InfiniteScroll>
                :<>
                    <div className="cant-find-container d-flex flex-row justify-content-center align-items-center">
                        {/* <VscRunErrors size={40}  className="mx-3"/> */}
                        <h2>This channel doesn't have any videos</h2>
                    </div>
                
                
                </>
            }
        </div> 
        </>
     }
    </>
)
}
export default Videos

