import { useState,useEffect } from 'react'

import Header from './components/header/header.component';
import Sidebar from './components/sidebar/sidebar.component';
import Home from './components/home/home.component';
import VideoPage from './components/videoPage/video_page.component';

import Container from 'react-bootstrap/Container';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';

function App() {
  
  const Layout=({children})=>{
    const [sidebar, toggleSideBar] = useState(true)
    const handleToggleSideBar = ()=> toggleSideBar(value=>!value)
    return(
      <>
        <Header handleToggleSideBar={handleToggleSideBar}/> 
        <Sidebar sidebar={sidebar}/>
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
          
        </Routes>
     </Router>
      
  )
}

export default App
