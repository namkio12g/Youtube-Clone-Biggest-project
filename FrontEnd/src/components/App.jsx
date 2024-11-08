import { useState,useEffect,useCallback } from 'react'

import Header from './features/header/header.component';
import Sidebar from './features/sidebar/sidebar.component';
import Home from './pages/anotherPages/home_page';
import VideoPage from './pages/anotherPages/video_page';
import HistoryPage from './pages/anotherPages/history_page';
import VideosLikedPage from './pages/anotherPages/videosLiked_page';
import FavoureVideosPage from './pages/anotherPages/favourites_page';

import VideosManager from './pages/anotherPages/videosManager_page';
import SearchedPage from './pages/anotherPages/search_page';

import Subcription from './pages/anotherPages/channelSubcription_page';
import ChannelPage from './pages/channelPage/channel_layout';


import Container from 'react-bootstrap/Container';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import { UserProvider } from './context/user.context';
import {SearchProvider} from './context/search.content'
function App() {
  
  const Layout=({children})=>{
    const [sidebar, toggleSideBar] = useState(true)
    const handleToggleSideBar = useCallback(()=> toggleSideBar(value=>!value));
    
    return(
      <>
      <UserProvider>
          <SearchProvider>
            <Header handleToggleSideBar={handleToggleSideBar}/> 
            <Sidebar sidebar={sidebar}/>
            <div className={sidebar?"app_container sidebar-active":"app_container"}> 
                {children}
            </div> 
          </SearchProvider>
      </UserProvider>
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
          <Route path="/video/:videoId"
                element={
                  <Layout>
                      <VideoPage/>
                  </Layout>
                }
                >
          </Route>
           <Route path="/channel/:channelId/*"
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
          <Route path="/favourite-videos"
                element={
                  <Layout>
                       <FavoureVideosPage/>
                  </Layout>
                }
                >
          </Route>
           <Route path="/search"
                element={
                  <Layout>
                       <SearchedPage/>
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
