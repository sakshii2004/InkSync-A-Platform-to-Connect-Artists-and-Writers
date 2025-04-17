import React, { useState } from 'react'
import { SquarePlus, MapPin } from "lucide-react";
import { Link } from "react-router-dom";
import { useProfileStore } from "../store/useProfileStore";
import { useEffect } from "react";
import PortfolioCard from "../components/PortfolioCard";

const PortfolioComponent = ({profile, authUser}) => {

  const { loadingPortfolio, portfolios, fetchUserPortfolios } = useProfileStore();

  useEffect(() => {
    if (profile?._id) {
      fetchUserPortfolios(profile?._id);
    }
  }, [profile]);

  return (
    <div className="bg-white w-full lg:w-[85%] mx-auto">
      <div className="flex flex-col lg:flex-row gap-4">

          {/* About Me + Socials */}
          <div className="lg:w-1/3 w-full bg-white p-4 pt-1 rounded-md shadow-md self-start">
          <h2 className="text-xl font-semibold mb-2">About {profile.fullName}</h2>
          <p className="text-md text-gray-700 mb-3">
            {profile.bio ? profile.bio : "Mysterious, aren't they? No bio yet."}
          </p>

          <p className="text-sm text-gray-600 mb-5 flex gap-x-1">
            <MapPin className="w-5 h-5" />
            {profile.location ? profile.location : "Creative Cavern"}
          </p>

          <div className="flex gap-3 items-center">
            <a href="#" target="_blank" rel="noopener noreferrer">
              <img src="/socials/x.png" alt="X" className="w-8 h-8 hover:opacity-70 transition-opacity duration-300 ease-in-out" />
            </a>
            <a href="#" target="_blank" rel="noopener noreferrer">
              <img src="/socials/instagram.png" alt="Instagram" className="w-8 h-8 hover:opacity-70 transition-opacity duration-300 ease-in-out" />
            </a>
            <a href="#" target="_blank" rel="noopener noreferrer">
              <img src="/socials/webtoon.png" alt="Webtoon" className="w-8 h-8 hover:opacity-70 transition-opacity duration-300 ease-in-out" />
            </a>
            <a href="#" target="_blank" rel="noopener noreferrer"> 
              <img src="/socials/deviantart.png" alt="DeviantArt" className="w-8 h-8 hover:opacity-70 transition-opacity duration-300 ease-in-out" />
            </a>
          </div>

          <p className="text-xs text-purple-500 mt-3 gap-x-1">
            <span>Joined </span>
            <span>{new Date(authUser.createdAt).toLocaleDateString("en-US", { month: "long", year: "numeric" })}</span>
          </p>


        </div>
        {/* Portfolio Cards */}
        <div className="lg:w-2/3 w-full bg-white p-4 pt-1 rounded-md shadow-md">
          <div className="flex justify-between">
          <h2 className="text-xl font-semibold mb-2">{profile.fullName}'s Portfolio</h2>
          {authUser.username === profile.username ?
          <Link
            to="/add-portfolio"
            className={`
            btn btn-sm gap-2 transition-colors border-purple-500 bg-white hover:bg-purple-100 duration-500 ease-in-out`}>
            <SquarePlus className="w-4 h-4 text-purple-500 " />
            <span className="text-purple-500">Add Portfolio Element</span>
          </Link>
          : 
          <></>}
          </div>

          <PortfolioCard portfolios={portfolios}/>

        </div>
      </div>

    </div>
  )
}

export default PortfolioComponent
