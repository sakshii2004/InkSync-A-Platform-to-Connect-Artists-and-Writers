import { useState } from "react";
import { useAuthStore } from "../store/useAuthStore";
import { Camera, User, MapPin, Gem } from "lucide-react";
import { useProfileStore } from "../store/useProfileStore";
import { Listbox } from '@headlessui/react'
import { Check, ChevronDown } from 'lucide-react'

const EditProfilePage = () => {
  const { authUser, setAuthUser } = useAuthStore();
  const { isUpdatingProfilePicture, editProfilePic, isUpdatingProfileDetails, updateProfileDetails } = useProfileStore();
  const [selectedImg, setSelectedImg] = useState(null);

  const statuses = [
    {
      label: "Open for Projects",
      description: "Actively looking to collaborate on new ideas.",
    },
    {
      label: "Ultra Focused",
      description: "Deep in work mode — responses may be slow.",
    },
    {
      label: "Taking a Creative Nap",
      description: "Recharging and brewing the next big thing.",
    },
    {
      label: "Will Be Back Soon",
      description: "Currently unavailable, back in a bit!",
    },
  ];  

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();

    reader.readAsDataURL(file);

    reader.onload = async () => {
      const base64Image = reader.result;
      setSelectedImg(base64Image);
      await editProfilePic({ profilePic: base64Image });
    };
  };

  return (
    <div className="h-screen pt-20">
      <div className="max-w-2xl mx-auto p-4 py-8">
        <div className="bg-base-300 rounded-xl p-6 space-y-8">
          <div className="text-center">
            <h1 className="text-2xl font-semibold ">Profile</h1>
            <p className="mt-2">Your profile information</p>
          </div>

          {/* avatar upload section */}

          <div className="flex flex-col items-center gap-4">
            <div className="relative">
              <img
                src={selectedImg || authUser.profilePic || "/1.png"}
                alt="Profile"
                className="size-32 rounded-full object-cover border-4 "
              />
              <label
                htmlFor="avatar-upload"
                className={`
                  absolute bottom-0 right-0 
                  bg-base-content hover:scale-105
                  p-2 rounded-full cursor-pointer 
                  transition-all duration-200
                  ${isUpdatingProfilePicture ? "animate-pulse pointer-events-none" : ""}
                `}
              >
                <Camera className="w-5 h-5 text-base-200" />
                <input
                  type="file"
                  id="avatar-upload"
                  className="hidden"
                  accept="image/*"
                  onChange={handleImageUpload}
                  disabled={isUpdatingProfilePicture}
                />
              </label>
            </div>
            <p className="text-sm text-zinc-400">
              {isUpdatingProfilePicture ? "Uploading..." : "Click the camera icon to update your photo"}
            </p>
          </div>

          {/* Other profile fields section */}

          <div className="space-y-6">
            <div className="space-y-1.5">
              <div className="text-sm text-zinc-400 flex items-center gap-2">
                <User className="w-4 h-4" />
                Full Name
              </div>
                <input
                  type="text"
                  value={authUser?.fullName}
                  onChange={(e) => setAuthUser({ ...authUser, fullName: e.target.value })}
                  className="px-4 py-2.5 bg-base-200 w-[100%] rounded-lg border focus:outline-none focus:ring-0 focus:border-purple-800"/>            
            </div>

            <div className="space-y-1.5">
              <div className="text-sm text-zinc-400 flex items-center gap-2">
                <MapPin className="w-4 h-4" />
                Location
              </div>
                <input
                  type="text"
                  value={authUser?.location ?? ""}
                  onChange={(e) => setAuthUser({ ...authUser, location: e.target.value })}
                  placeholder="Creative Cavern"
                  className="px-4 py-2.5 bg-base-200 w-[100%] rounded-lg border focus:outline-none focus:ring-0 focus:border-purple-800"/>            
            </div>

            <div className="space-y-1.5">
              <div className="text-sm text-zinc-400 flex items-center gap-2">
                <Gem className="w-4 h-4" />
                About Me
              </div>
              <textarea
                value={authUser?.bio ?? ""}
                onChange={(e) => setAuthUser({ ...authUser, bio: e.target.value })}
                placeholder="A few lines to describe yourself"
                rows={4} 
                className="px-4 py-2.5 bg-base-200 w-full rounded-lg border focus:outline-none focus:ring-0 focus:border-purple-800 resize-none"/>   
            </div>

            <div className="space-y-1.5">
              <div className="text-sm text-zinc-400 flex items-center gap-2">
                <Gem className="w-4 h-4" />
                Current Status
              </div>

              <Listbox value={authUser?.status ?? ""} onChange={(value) => setAuthUser({ ...authUser, status: value })}>
                <div className="relative w-full">
                  <Listbox.Button className="px-4 py-2.5 bg-base-200 w-full rounded-lg border text-left flex items-center justify-between focus:outline-none focus:ring-0 focus:border-purple-800">
                    <span>
                      {authUser?.status || "─ Select your status ─"}
                    </span>
                    <ChevronDown className="w-4 h-4 text-gray-400" />
                  </Listbox.Button>

                  <Listbox.Options className="absolute z-10 mt-2 w-full bg-white border border-zinc-700 rounded-lg shadow-lg max-h-60 overflow-auto">
                    {statuses.map((status) => (
                      <Listbox.Option
                        key={status.label}
                        value={status.label}
                        className={({ active, selected }) =>
                          `px-4 py-2.5 cursor-pointer select-none transition ${
                            active ? 'bg-purple-100 text-gray-900' : 'text-gray-800'
                          } ${selected ? 'font-semibold' : ''}`
                        }
                      >
                        {({ selected }) => (
                          <div className="flex justify-between items-center">
                            <span>{status.label}</span>
                            {selected && <Check className="w-4 h-4 text-gray-500" />}
                          </div>
                        )}
                      </Listbox.Option>
                    ))}
                  </Listbox.Options>
                </div>
              </Listbox>

              {authUser?.status && (
                <p className="text-xs text-zinc-400 mt-1">
                  {
                    statuses.find((s) => s.label === authUser.status)?.description
                  }
                </p>
              )}
            </div>

            <div className="flex justify-center items-center">
              <button 
                onClick={() =>
                  updateProfileDetails({
                    fullName: authUser.fullName,
                    bio: authUser.bio,
                    location: authUser.location,
                    status: authUser.status,
                  })
                }
                className="flex cursor-pointer btn gap-2 items-center text-white bg-purple-400 border-none  hover:bg-purple-500 duration-500 ease-in-out">
              {isUpdatingProfileDetails ? (<span>Updating...</span>) : (<span>Update Profile Details</span>)}
              </button>
            </div>

          </div>

          {/* 

          <div className="mt-6 bg-base-300 rounded-xl p-6">
            <h2 className="text-lg font-medium  mb-4">Account Information</h2>
            <div className="space-y-3 text-sm">
              <div className="flex items-center justify-between py-2 border-b border-zinc-700">
                <span>Member Since</span>
                <span>{authUser.createdAt?.split("T")[0]}</span>
              </div>
              <div className="flex items-center justify-between py-2">
                <span>Account Status</span>
                <span className="text-green-500">Active</span>
              </div>
            </div>
          </div>

          */}

        </div>
      </div>
    </div>
  );
};
export default EditProfilePage;