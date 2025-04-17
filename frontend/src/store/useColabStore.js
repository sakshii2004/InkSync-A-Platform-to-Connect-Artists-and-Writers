import { create } from "zustand";
import { axiosInstance } from "../lib/axios";
import toast from "react-hot-toast";
import { useAuthStore } from "./useAuthStore";

export const useColabStore = create((set, get) => ({

  isSendingColabRequest: null,
  sentRequests: null,
  receivedRequests: null,
  colabs: null,
  gettingColabs: false,
  gettingSentRequests: false,
  gettingReceivedRequests: false,

  sendColabRequest: async (data) => {
    const { title, description, senderId, receiverId } = data;
    if (!title || !description || !senderId || !receiverId) {
        toast.error("All fields are required.");
        return;
    }

    if (senderId === receiverId) {
        toast.error("You can't send a request to yourself.");
        return;
    }
    set({ isSendingColabRequest: true });

    try {
        const res = await axiosInstance.post("/colab/send-request", data);
        toast.success("Collab request sent successfully");
    } 

    catch (error) {
        console.log("Error in sendColabRequest:", error);
        toast.error(error.response.data.message);
    }

    finally {
        set({ isSendingColabRequest: false });
    }
  },

  getSentRequests: async () => {
    try {
      set({gettingSentRequests: true})
      const res = await axiosInstance.get("/colab/sent-requests");
      set({ sentRequests: res.data.requests });
    }     
    catch (error) {
      console.error("Error in getSentRequests:", error);
      toast.error("Failed to fetch sent requests.");
      set({ sentRequests: [] });
    }
    finally {
      set({gettingSentRequests: false})
    }

  },
  
  getReceivedRequests: async () => {
    try {
      set({gettingReceivedRequests: true})
      const res = await axiosInstance.get("/colab/received-requests");
      set({ receivedRequests: res.data.requests });
    }     
    catch (error) {
      console.error("Error in getReceivedRequests:", error);
      toast.error("Failed to fetch received requests.");
      set({ receivedRequests: [] });
    }
    finally {
      set({gettingReceivedRequests: false})
    }
  }, 

  acceptRequest: async (requestId) => {
    try {
      const res = await axiosInstance.put(`/colab/accept/${requestId}`);
      const updatedRequest = res.data; // should now have status "active"
      toast.success("Collab request accepted successfully");
  
      set((state) => {
        // Remove it from receivedRequests
        const newReceivedRequests = state.receivedRequests.filter(
          (req) => req._id !== requestId
        );
  
        // Add it to colabs
        const newColabs = [updatedRequest, ...state.colabs];
  
        return {
          receivedRequests: newReceivedRequests,
          colabs: newColabs,
        };
      });
    } catch (err) {
      console.error("Error accepting request:", err);
      toast.error("Could not accept collab request.");
    }
  },  

  declineRequest: async (requestId) => {
    try {
      await axiosInstance.put(`/colab/decline/${requestId}`);
      toast.success("Collab request declined successfully");
  
      set((state) => ({
        receivedRequests: state.receivedRequests.filter(
          (req) => req._id !== requestId
        ),
      }));
    } 
    
    catch (err) {
      console.error("Error declining request:", err);
      toast.error("Could not decline collab request.");
    }
  },
  
  withdrawRequest: async (requestId) => {
    try {
      await axiosInstance.put(`/colab/withdraw/${requestId}`);
      toast.success("Collab request withdrawn successfully");
  
      set((state) => ({
        sentRequests: state.sentRequests.filter(
          (req) => req._id !== requestId
        ),
      }));
    } 
    
    catch (err) {
      console.error("Error withdrawing request:", err);
      toast.error("Could not withdraw collab request.");
    }
  },

  getColabs: async (requestId) => {
    try {
      set({gettingColabs: true});
      const res = await axiosInstance.get(`/colab/all-colabs/${requestId}`);
      set({ colabs: res.data.colabs });
    }    

    catch (error) {
      console.error("Error in getColabs:", error);
      toast.error("Failed to fetch colabs");
      set({ colabs: [] });
    }

    finally {
      set({gettingColabs: false});
    }
  },

  endColab: async (requestId) => {
    try {
      const res = await axiosInstance.put(`/colab/endcolab/${requestId}`);
      const updatedColab = res.data;
  
      toast.success("Collab ended successfully");
  
      set((state) => ({
        colabs: state.colabs.map((colab) =>
          colab._id === requestId ? updatedColab : colab
        ),
      }));
    } catch (err) {
      console.error("Error endColab:", err);
      toast.error("Could not end collab.");
    }
  },  

}));

