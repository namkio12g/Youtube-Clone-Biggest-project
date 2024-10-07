import { useState,useEffect } from 'react'

import Header from './components/header/header.component';
import Sidebar from './components/sidebar/sidebar.component';
import Home from './components/pages/home.component';
import VideoPage from './components/pages/video_page.component';
import HistoryPage from './components/pages/history_page.component';
import VideosLikedPage from './components/pages/videosLiked_page.component';
import VideosManager from './components/pages/videosManager_page.component';

import Subcription from './components/pages/channelSubcription_page.component';
import ChannelPage from './components/pages/channelPage/channel_page.component';


import Container from 'react-bootstrap/Container';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';

function App() {
  
  const Layout=({children})=>{
    const [sidebar, toggleSideBar] = useState(true)
    const handleToggleSideBar = ()=> toggleSideBar(value=>!value)
    const [user,setUser] = useState(null)
    useEffect(()=>{
        fetch("/api/channel/getInfo",{
            method:"GET",
            credential:"include"
        })
        .then(res=>res.json())
        .then(data=>{setUser(data.channel.data)})
        .catch(error=>console.error("Error:",error))

        
    },[])
    return(
      <>
        <Header handleToggleSideBar={handleToggleSideBar} user={user}/> 
        <Sidebar sidebar={sidebar} user={user}/>
        <div className={sidebar?"app_container sidebar-active":"app_container"}> 
            {children}
        </div> 
      </>
    )
  }
  return (
     <Router>
        <Routes>
          <Route path="/"
                element={
                  <Layout>
                       <Home/>
                  </Layout>
                }
                >
          </Route>
          <Route path="/video"
                element={
                  <Layout>
                      <VideoPage/>
                  </Layout>
                }
                >
          </Route>
           <Route path="/channel/*"
                element={
                  <Layout>
                       <ChannelPage/>
                  </Layout>
                }
                >
          </Route>
           <Route path="/history"
                element={
                  <Layout>
                       <HistoryPage/>
                  </Layout>
                }
                >
          </Route>
          <Route path="/videos-liked"
                element={
                  <Layout>
                       <VideosLikedPage/>
                  </Layout>
                }
                >
          </Route>
          <Route path="/subcription"
                element={
                  <Layout>
                       <Subcription/>
                  </Layout>
                }
                >
          </Route>
            <Route path="/videos-manager"
              element={
                <Layout>
                      <VideosManager/>
                </Layout>
              }
              >
          </Route>
        </Routes>
     </Router>
      
  )
}

export default App
