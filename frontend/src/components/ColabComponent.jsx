import React from 'react';
import { useState, useEffect } from "react";
import { Camera, User, MapPin, Gem } from "lucide-react";
import { useColabStore } from "../store/useColabStore";
import ColabSkeleton from "../components/ColabSkeleton";
import ColabRASkeleton from "../components/ColabRASkeleton";
import { Link } from "react-router-dom";

const ColabComponent = ({profile, authUser}) => {
  const [formData, setFormData] = useState({ title: '', description: '' })
  const { isSendingColabRequest, sendColabRequest } = useColabStore();
  const { sentRequests, getSentRequests } = useColabStore();
  const { receivedRequests, getReceivedRequests } = useColabStore();
  const { colabs, getColabs } = useColabStore();
  const { acceptRequest, declineRequest, withdrawRequest, endColab } = useColabStore();
  const { gettingColabs, gettingSentRequests, gettingReceivedRequests } = useColabStore();

  const [selectedRequest, setSelectedRequest] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const openModal = (request) => {
    setSelectedRequest(request);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setSelectedRequest(null);
    setIsModalOpen(false);
  };


  useEffect(() => {
    getSentRequests();
    getReceivedRequests();
    getColabs(profile._id);
  }, [profile?._id]);

  return (
    <div className="bg-white w-full lg:w-[85%] mx-auto">
      <div className="flex flex-col lg:flex-row gap-4">

        {/* Past and Active Colabs */}
        <div className="lg:w-2/3 w-full bg-white p-4 pt-1 rounded-md shadow-md">
          <div className="flex justify-between">
            <h2 className="text-xl font-semibold mb-2">{profile.fullName}'s Colabs</h2>
          </div>
          { gettingColabs ? (
            <>
              {[...Array(3)].map((_, i) => (
                <ColabSkeleton key={i} />
              ))}
            </>
          ) : colabs?.length > 0 ? (
            <div>
              {colabs.map((colab, index) => (
                <div
                  key={index}
                  className="w-full flex flex-col gap-y-0.5 p-2.5 mb-2 border border-gray-200 rounded-md hover:border-purple-300 transition-all duration-500 ease-in-out">
                  <div className="flex flex-col gap-y-1">
                    <div className="flex justify-between">
                      <div className="flex gap-x-2 items-center">
                        <h1 className="text-lg font-semibold">{colab.title}</h1>
                        { colab.dateEnded ? 
                        (
                          <button className="text-xs bg-blue-50 p-1.5 rounded-md text-blue-500">Completed</button>
                        ) : (
                          <button className="text-xs bg-green-50 p-1.5 rounded-md text-green-500">Active</button>
                        )}
                      </div>
                        {colab.dateAccepted && authUser._id == profile._id && !colab.dateEnded ? 
                        (<button 
                          onClick = {() => endColab(colab._id)}
                          className="btn btn-sm w-fit h-6 border-none bg-pink-100 text-pink-600 hover:bg-pink-50 transition-colors duration-500 ease-in-out">
                            End Collab
                        </button>)
                        : 
                        <div></div>}
                    </div>

                    <div className="text-xs text-gray-600">
                      A project between 
                      <span className="text-purple-500 hover:text-purple-400 transition-colors duration-300 ease-in-out hover:cursor-pointer"> @{colab.sender.username} </span>
                      and
                      <span className="text-purple-500 hover:text-purple-400 transition-colors duration-300 ease-in-out hover:cursor-pointer"> @{colab.receiver.username} </span>
                    </div>
                    <p className="text-sm text-gray-700">
                      {colab.description.split(" ").slice(0, 20).join(" ")}
                      {colab.description.split(" ").length > 20 && ". . ."}
                    </p>
                    <p className="text-xs text-purple-400">From 
                      <span>
                        {" "}
                        {new Date(colab.dateAccepted).toLocaleDateString("en-US", {
                          day: "numeric",
                          month: "long",
                          year: "numeric",
                        })} 
                        {" "}
                        </span>
                      to 
                      <span>
                        {" "}
                        {colab.dateEnded ? new Date(colab.dateEnded).toLocaleDateString("en-US", {
                          day: "numeric",
                          month: "long",
                          year: "numeric",
                        }) : "Present"}
                        {" "}
                        </span>
                    </p>                  
                    </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-gray-500">No colabs to show.</p>
          )}
        </div>

        { authUser._id !== profile._id ? (
          <div className="lg:w-1/3 w-full bg-white p-4 pt-1 rounded-md shadow-md self-start">
            <h2 className="text-xl font-semibold mb-2">Send Colab Request</h2>
  
            <div className="space-y-1 mb-2.5">
                <div className="text-sm text-zinc-400 flex items-center gap-2">
                  Colab Title
                </div>
                  <input
                    type="text"
                    required
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    placeholder="Colab Title (e.g. Comic Series, One-Shot)"
                    className="px-4 py-2.5 bg-base-100 w-[100%] rounded-lg border border-gray-400 focus:outline-none focus:ring-0 focus:border-purple-500"/>            
              </div>
  
              <div className="space-y-1">
                <div className="text-sm text-zinc-400 flex items-center gap-2">
                  Description
                </div>
                  <textarea
                    type="text"
                    required
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    placeholder="Describe the colab idea (e.g. story genre, art style, timeline)"
                    rows={4}
                    className="px-4 py-2.5 bg-base-100 w-[100%] rounded-lg border border-gray-400 focus:outline-none focus:ring-0 focus:border-purple-500"/>            
              </div>
  
              <div className="flex justify-center items-center">
                <button
                  type="submit"
                  disabled={isSendingColabRequest}
                  onClick={() => {
                    sendColabRequest({
                      title: formData.title,
                      description: formData.description,
                      senderId: authUser._id,
                      receiverId: profile._id
                    });
                    setFormData({ title: '', description: '' });
                  }}               
                  className="btn gap-2 bg-purple-400 text-white hover:bg-purple-500 duration-500 ease-in-out transition-colors w-95">
                  {isSendingColabRequest ? 'Sending...' : 'Send Request'}
                </button>
              </div>
          </div>
        ) : (
          <div className="lg:w-1/3 w-full bg-white p-4 pt-1 rounded-md shadow-md self-start">
            <div>
              <h2 className="text-xl font-semibold mb-2">Incoming Collab Requests</h2>
              { gettingReceivedRequests ? (
                <ColabRASkeleton/>
              )
              :
              receivedRequests?.length > 0 ? (
                receivedRequests.map((request) => (
                <div key={request._id} className="width-full flex flex-col gap-y-0.5 p-2.5 mb-2 border-1 border-gray-200 rounded-md hover:border hover:border-purple-300 transition-all duration-500 ease-in-out">
                  <h1 className="text-lg font-semibold">{request.title}</h1>
                  <h1 className="text-xs text-gray-600">Sent by 
                    <Link to={`/user/${request.sender.username}`}><span className="text-purple-500 hover:text-purple-400 transition-colors duration-300 ease-in-out hover:cursor-pointer"> @{request.sender.username}</span></Link>
                  </h1>
                  <p className="text-sm text-gray-700">
                    {request.description.split(" ").slice(0, 20).join(" ")}
                    {request.description.split(" ").length > 20 && ". . ."}
                  </p>
                  <div className="flex gap-x-1">
                  <button
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={() => openModal(request)}
                      className="btn btn-sm w-fit h-7 mt-2 border-none bg-purple-100 text-purple-600 hover:bg-purple-50 transition-colors duration-500 ease-in-out">
                      View
                  </button>  
                  <button
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={() => acceptRequest(request._id)}
                      className="btn btn-sm w-fit h-7 mt-2 border-none bg-green-100 text-green-600 hover:bg-green-50 transition-colors duration-500 ease-in-out">
                      Accept
                  </button>                    
                  <button
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={() => declineRequest(request._id)}
                      className="btn btn-sm w-fit h-7 mt-2 border-none bg-pink-100 text-pink-600 hover:bg-pink-50 transition-colors duration-500 ease-in-out">
                      Decline
                  </button>
                  </div>
                </div>
                ))
              ) : (
                <p className="text-sm text-gray-500">No incoming requests yet.</p>
              )}
            </div>

            <hr className="mt-4.5 mb-4.5 text-gray-200" />

            <div>
              <h2 className="text-xl font-semibold mb-2 mt-3">Outgoing Collab Requests</h2>
              { gettingSentRequests ? (
                <ColabRASkeleton/>
              )
              :
              sentRequests?.length > 0 ? (
                sentRequests.map((request) => (
                <div key={request._id} className="width-full flex flex-col gap-y-0.5 p-2.5 mb-2 border-1 border-gray-200 rounded-md hover:border hover:border-purple-300 transition-all duration-500 ease-in-out">
                  <h1 className="text-lg font-semibold">{request.title}</h1>
                  <h1 className="text-xs text-gray-600">Sent to 
                    <Link to={`/user/${request.receiver.username}`}><span className="text-purple-500 hover:text-purple-400 transition-colors duration-300 ease-in-out hover:cursor-pointer"> @{request.receiver.username}</span></Link>
                  </h1>
                  <p className="text-sm text-gray-700">
                    {request.description.split(" ").slice(0, 12).join(" ")}
                    {request.description.split(" ").length > 12 && ". . ."}
                  </p>
                  <div className="flex gap-x-1">
                  <button
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={() => openModal(request)}
                      className="btn btn-sm w-fit h-7 mt-2 border-none bg-purple-100 text-purple-600 hover:bg-purple-50 transition-colors duration-500 ease-in-out">
                      View
                  </button>
  
                  <button
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={() => withdrawRequest(request._id)}
                      className="btn btn-sm w-fit h-7 mt-2 border-none bg-pink-100 text-pink-600 hover:bg-pink-50 transition-colors duration-500 ease-in-out">
                      Withdraw
                  </button>
                  </div>
                </div>
                ))
              ) : (
                <p className="text-sm text-gray-500">No outgoing requests yet.</p>
              )}
            </div>
          </div>
        )}

      </div>

      {isModalOpen && selectedRequest && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/30 bg-opacity-50 z-50">
          <div className="bg-white rounded-xl p-6 w-[90%] max-w-md shadow-lg relative">
            <button
              className="absolute top-2 right-3 text-xl text-gray-500 hover:text-gray-700"
              onClick={closeModal}
            >
              ×
            </button>
            <h2 className="text-xl font-bold text-purple-600 mb-2">{selectedRequest.title}</h2>
            <p className="text-sm text-gray-600 mb-1">
              {selectedRequest.sender.username ? 
              ( <div>
                  Sent by{" "}
                  <Link to={`/user/${selectedRequest.sender.username}`} onClick={() => setIsModalOpen(false)} className="text-purple-500 hover:text-purple-400">
                    @{selectedRequest.sender.username}
                  </Link>   
                </div>             
              ) : (
                <div>
                  Sent to{" "}
                  <Link to={`/user/${selectedRequest.receiver.username}`} onClick={() => setIsModalOpen(false)} className="text-purple-500 hover:text-purple-400">
                    @{selectedRequest.receiver.username}
                  </Link>  
                </div> 
              )}


            </p>
            <p className="text-gray-800 whitespace-pre-wrap">
              {selectedRequest.description}
            </p>
          </div>
        </div>
      )}

    </div>
  )
}

export default ColabComponent