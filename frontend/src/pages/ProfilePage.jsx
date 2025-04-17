import React, { useState } from 'react';
import toast from "react-hot-toast";
import { useAuthStore } from "../store/useAuthStore";
import { useProfileStore } from "../store/useProfileStore";
import { UserRoundPlus, MailPlus, UserRoundPen, Settings, Check, X } from "lucide-react";
import { Link } from "react-router-dom";
import { useEffect } from "react";
import { ProfileSkeleton } from "../skeletons/ProfileSkeleton";
import PortfolioComponent from "../components/PortfolioComponent";
import ColabComponent from "../components/ColabComponent";
import FollowSkeleton from "../components/FollowSkeleton";
import RecentActivityComponent from "../components/RecentActivityComponent";
import { useParams } from "react-router-dom";

const ProfilePage = () => {

  const { authUser } = useAuthStore();
  const { username } = useParams();
  const { profile, loadingProfile, fetchProfile } = useProfileStore();
  const { followUser, isFollowing, checkIfFollowing, numberOfFollowers, getNumberOfFollowers, numberOfFollowing, unfollowUser, getNumberOfFollowing, getFollowersOrFollowingList, loadingList } = useProfileStore();
  const [selectedSection, setSelectedSection] = useState("Portfolio");

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalType, setModalType] = useState(""); 
  const [listData, setListData] = useState([]);

  useEffect(() => {
    if (username) {
      fetchProfile(username);
    }
  }, [username]);

  useEffect(() => {
    if (profile?._id) {
      checkIfFollowing(profile._id);
    }
  }, [profile]);

  useEffect(() => {
    if (profile?._id) {
      getNumberOfFollowers(profile._id);
      getNumberOfFollowing(profile._id);
    }
  }, [profile]);
  
  const handleFollow = async () => {
    const { success, error } = await followUser(profile._id);
    if (success) {
      toast.success("Followed successfully!");
    } 
    
    else {
      toast.error(error);
    }
  };

  const handleUnfollow = async () => {
    const { success, error } = await unfollowUser(profile._id);
    if (success) {
      toast.success("Unfollowed successfully!")
    }
    else {
      toast.error(error);
    }
  }

  const changeSection = (section) => {
    setSelectedSection(section);
  };

  const renderSection = () => {
    switch (selectedSection) {
      case "Portfolio":
        return <PortfolioComponent profile={profile} authUser={authUser}/>;
      case "Colabs":
        return <ColabComponent profile={profile} authUser={authUser}/>;
      case "Recent Activity":
        return <RecentActivityComponent />;
      default:
        return null;
    }
  };

  const openModal = async (type) => {
    setModalType(type);
    setIsModalOpen(true);
  
    try {
      const data = await getFollowersOrFollowingList(profile._id, type); 
      setListData(data); 
    } 
    
    catch (error) {
      toast.error("Error loading list");
    }
  };
  
  const closeModal = () => {
    setIsModalOpen(false);
    setListData([]);
  };

  const getRoleStyles = (role) => {
    switch (role) {
      case "Artist":
        return "bg-sky-100 text-sky-800"; 
      case "Writer":
        return "bg-green-100 text-green-800"; 
      case "Dual Creator":
        return "bg-pink-100 text-pink-800";
      case "Enthusiast":
        return "bg-purple-100 text-purple-800"; 
      default:
        return "bg-gray-100 text-gray-800";
    }
  };


  if (loadingProfile || !profile || isFollowing === null || numberOfFollowers === null || numberOfFollowing === null) {
    return <ProfileSkeleton />;
  }

  return (
    <div className="min-h-screen mt-12 p-6">
      <div className="bg-white h-auto flex flex-col justify-center items-center pt-15 pb-5">
        <img src={profile.profilePic || "/default_pfp.png"} className="w-22 h-22 rounded-full object-cover"/>
        <div className="text-xl font-bold mt-2">{profile.fullName}</div>
        <div className="text-base">@{profile.username}</div>

        <div className="flex justify-center items-center mt-5 gap-x-7">
        <div className="flex flex-col justify-center items-center leading-none">
              <div className="text-lg font-semibold">2</div>
              <div>Colabs</div>
          </div>
          <div className="flex flex-col justify-center items-center leading-none hover:text-purple-500 hover:cursor-pointer" onClick={() => openModal("followers")}>
              <div className="text-lg font-semibold">{numberOfFollowers}</div>
              <div>Followers</div>
          </div>
          <div className="flex flex-col justify-center items-center leading-none  hover:text-purple-500 hover:cursor-pointer" onClick={() => openModal("following")}>
              <div className="text-lg font-semibold">{numberOfFollowing}</div>
              <div>Following</div>
          </div>
        </div>
      </div>

      <div className="bg-white w-full lg:w-[85%] mx-auto px-4 py-3 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 rounded-lg shadow-md">
        {/* Tabs Section */}
        <div className="flex gap-4 sm:gap-8 justify-center sm:justify-start">
            {["Portfolio", "Colabs", "Recent Activity"].map((section) => (
            <button
              key={section}
              onClick={() => changeSection(section)}
              className={`text-base font-medium transition pb-2 ${
                selectedSection === section
                  ? "text-black border-b-4 border-purple-500"
                  : "text-gray-600 border-b-4 border-transparent hover:text-black"
              }`}
            >
              {section}
            </button>
          ))}
        </div>

        {/* Buttons Section */}
        <div className="flex gap-4 justify-center sm:justify-end">
        {authUser.username !== profile.username && (
          <>
            {
              isFollowing ? (
                <button
                  onClick={handleUnfollow}
                  className="flex cursor-pointer btn gap-2 items-center bg-purple-50 text-purple-600 border-purple-300 hover:bg-purple-200 duration-500 ease-in-out"
                >
                  <Check className="size-5" />
                  <span className="hidden sm:inline">Following</span>
                </button>
              ) : (
                <button
                  onClick={handleFollow}
                  className="flex cursor-pointer btn gap-2 items-center bg-white border-gray-300 hover:text-purple-600 hover:border-purple-400 duration-500 ease-in-out"
                >
                  <UserRoundPlus className="size-5" />
                  <span className="hidden sm:inline">Follow</span>
                </button>
              )
            }

            <Link to={"/chat"} className="btn gap-2 bg-purple-400 text-white hover:bg-purple-500 duration-500 ease-in-out transition-colors">
              <MailPlus className="size-5" />
              <span className="hidden sm:inline">Message</span>
            </Link>
          </>
        )}

        {authUser.username === profile.username && (
          <>
            <Link to ={"/edit-profile"} className="flex cursor-pointer btn gap-2 items-center bg-white border-gray-300 hover:text-purple-600 hover:border-purple-400 duration-500 ease-in-out">
              <UserRoundPen className="size-5" />
              <span className="hidden sm:inline">Edit Profile</span>
            </Link>
            
            <Link to={"/settings"} className="btn gap-2 bg-purple-400 text-white hover:bg-purple-500 duration-500 ease-in-out transition-colors">
              <Settings className="size-5" />
              <span className="hidden sm:inline">Settings</span>
            </Link>
          </>
        )}
        </div>
      </div>

      <div className="mt-6">{renderSection()}</div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-black/30 flex items-center justify-center">
          <div className="bg-white p-6 rounded-lg w-96 h-96 overflow-hidden">
            <div className="flex justify-between">
              <h3 className="text-xl font-bold mb-4">
                {modalType === "followers" ? "Followers" : "Following"}
              </h3>
              <X
                className="w-7 h-7 bg-purple-50 rounded-full p-1 hover:text-purple-400 transition-all duration-300 ease-in-out"
                onClick={closeModal}
              />
            </div>

            {/* Scrollable list container */}
            <div className="max-h-70 overflow-y-auto">
              {loadingList ? (
                <FollowSkeleton />
              ) : listData.length === 0 ? (
                <p className="text-md text-purple-400">Whoops! Nothing to show.</p>
              ) : (
                <ul>
                  {listData.map((user) => (
                    <li
                      key={user._id}
                      className="flex items-center mb-2 justify-between"
                    >
                      {/* Left side: Profile Picture and User Info */}
                      <div className="flex items-center">
                        <img
                          src={user.profilePic || "/default_pfp.png"}
                          className="w-8 h-8 rounded-full mr-2"
                        />
                        <div>
                          <div className="font-semibold">{user.fullName}</div>
                          <Link to={`/user/${user.username}`}>
                            <div
                              className="text-sm hover:text-purple-400 hover:cursor-pointer"
                              onClick={closeModal}
                            >
                              @{user.username}
                            </div>
                          </Link>
                        </div>
                      </div>

                      {/* Right side: User's Role */}
                      <div
                        className={`text-sm mr-3 px-2.5 py-1 rounded-md ${getRoleStyles(
                          user.role
                        )}`}
                      >
                        {user.role}
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default ProfilePage