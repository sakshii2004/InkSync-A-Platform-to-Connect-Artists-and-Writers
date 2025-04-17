import React, { useEffect } from 'react'
import Navbar from "./components/Navbar"
import HomePage from "./pages/HomePage"
import SignUpPage from "./pages/SignUpPage"
import LoginPage from "./pages/LoginPage"
import SettingsPage from "./pages/SettingsPage"
import ProfilePage from "./pages/ProfilePage"
import LandingPage from "./pages/LandingPage"
import CommunityPage from "./pages/CommunityPage"
import ChatPage from "./pages/ChatPage"
import EditProfilePage from "./pages/EditProfilePage"
import AddPortfolioPage from "./pages/AddPortfolioPage"
import { useAuthStore } from "./store/useAuthStore"
import { Routes, Route, Navigate} from "react-router-dom"
import { LoaderCircle } from "lucide-react"
import { Toaster } from "react-hot-toast";

const App = () => { 
  const { authUser, checkAuth, isCheckingAuth } = useAuthStore()

  useEffect(() => {
    checkAuth();
  }, []);

  console.log(authUser);

  if(isCheckingAuth && !authUser) return (
    <div className="flex items-center justify-center h-screen">
      <LoaderCircle className="size-10 animate-spin"/>
    </div>
  )

  return (
    <div>
      <Navbar/>
      <Routes>
        <Route path="/" element={<LandingPage/>}/>
        <Route path="/home" element={authUser ? <HomePage/> : <Navigate to="/login" />} />
        <Route path="/signup" element={!authUser ? <SignUpPage/> : <Navigate to="/home"/>} />
        <Route path="/login" element={!authUser ? <LoginPage/> : <Navigate to="/home"/>} />
        <Route path="/settings" element={authUser ? <SettingsPage/> : <Navigate to="/login" />}/>
        <Route path="/user/:username" element={<ProfilePage />} />
        <Route path="/profile" element={authUser ? <ProfilePage/> : <Navigate to="/login" />} />
        <Route path="/edit-profile" element={authUser ? <EditProfilePage/> : <Navigate to="/login" />} />
        <Route path="/add-portfolio" element={authUser ? <AddPortfolioPage/> : <Navigate to="/login" />} />
        <Route path="/chat" element={authUser ? <ChatPage/> : <Navigate to="/login" />} />
        <Route path="/communities" element={authUser ? <CommunityPage/> : <Navigate to="/login" />} />
      </Routes>
      <Toaster />
    </div>
  )
}

export default App