import { create } from "zustand";
import { axiosInstance } from "../lib/axios";
import toast from "react-hot-toast";
import { useAuthStore } from "./useAuthStore";

export const useProfileStore = create((set, get) => ({
  profile: null,
  loadingProfile: true,
  isUpdatingProfilePicture: false,
  isUpdatingProfileDetails: false,
  portfolios: [],
  loadingPortfolio: false,
  isFollowing: null,
  numberOfFollowers: null,
  numberOfFollowing: null,
  loadingList: false,

  fetchProfile: async (username) => {
    try {
      const response = await axiosInstance.get(`/user/${username}`);
      set({ profile: response.data });
    } 
    
    catch (error) {
      console.error("Failed to fetch profile:", error);
      toast.error(error.response.data.message);
      set({profile: null})
    }

    finally {
      set({ loadingProfile: false });
    }
  },

  editProfilePic: async (data) => {
    set({ isUpdatingProfilePicture: true });
    try {
      const res = await axiosInstance.put("/user/edit-profile-pic", data);
      useAuthStore.getState().setAuthUser(res.data);
      toast.success("Avatar updated successfully");
    } 
    
    catch (error) {
      console.log("error in update profile:", error);
      toast.error(error.response.data.message);
    } 
    
    finally {
      set({ isUpdatingProfilePicture: false });
    }
  },

  updateProfileDetails: async (data) => {
    set({ isUpdatingProfileDetails: true });
    try {
      const res = await axiosInstance.put("/user/edit-profile-details", data);
      useAuthStore.getState().setAuthUser(res.data);
      toast.success("Profile updated successfully");
    } catch (error) {
      console.log("error in updateProfileDetails:", error);
      toast.error(error.response?.data?.message || "Something went wrong");
    } finally {
      set({ isUpdatingProfileDetails: false });
    }
  },

  createPortfolio: async (portfolioData) => {
    try {
      const response = await axiosInstance.post("/user/add-portfolio", portfolioData);
      console.log("Portfolio created:", response.data);
    } catch (error) {
      console.error("Error creating portfolio:", error.response?.data || error.message);
    }
  },

  fetchUserPortfolios: async (userId) => {
    set({ loadingPortfolio: true });
    try {
      const res = await axiosInstance.get(`/user/portfolio/${userId}`);
      set({ portfolios: res.data, loadingPortfolio: false });
    } 
    
    catch (error) {
      console.error("Error in fetchUserPortfolios", error.response?.data || error.message);
    }
  },

  followUser: async (userIdToFollow) => {
    try {
      const { data } = await axiosInstance.post(`/user/follow`, {
        userIdToFollow,
      });
      set((state) => ({
        isFollowing: true,
        numberOfFollowers: state.numberOfFollowers + 1, 
      }));      
      return { success: true, data };
    } 
    
    catch (error) {
      console.error("Follow error:", error.response?.data || error.message);
      return { success: false, error: error.response?.data?.message || "Failed to follow user" };
    }
  },

  unfollowUser: async (userIdToUnfollow) => {
    try {
      const { data } = await axiosInstance.post(`/user/unfollow`, {
        userIdToUnfollow,
      });
      set((state) => ({
        isFollowing: false,
        numberOfFollowers: state.numberOfFollowers - 1, 
      }));      
      return { success: true, data };
    } 
    
    catch (error) {
      console.error("Follow error:", error.response?.data || error.message);
      return { success: false, error: error.response?.data?.message || "Failed to follow user" };
    }
  },

  checkIfFollowing: async (targetUserId) => {
    try {
      const res = await axiosInstance.get(`/user/is-following/${targetUserId}`);
      set({ isFollowing: res.data.isFollowing });
    } 
    
    catch (err) {
      console.error("Error checking follow status:", err);
    }
  },  

  getNumberOfFollowers: async (targetUserId) => {
    try {
      const res = await axiosInstance.get(`/user/followers-count/${targetUserId}`);
      set({ numberOfFollowers: res.data.followersCount })
    }

    catch (err) {
      console.error("Error in store getNumberOfFollowers:", err);
    }
  },

  getNumberOfFollowing: async (targetUserId) => {
    try {
      const res = await axiosInstance.get(`/user/following-count/${targetUserId}`);
      set({ numberOfFollowing: res.data.numberOfFollowing })
    }

    catch (err) {
      console.error("Error in store getNumberOfFollowing:", err);
    }

  },

  getFollowersOrFollowingList: async (userId, type) => {
    try {
      set({loadingList: true})
      const res = await axiosInstance.get(`/user/${userId}/${type}`);
      return res.data; 
    } 
    
    catch (error) {
      console.error(`Error fetching ${type} list:`, error.response?.data || error.message);
      toast.error("Failed to fetch list");
      return [];
    }

    finally {
      set({loadingList: false})
    }
  },

  clearProfile: () => set({ profile: null }),

}));

