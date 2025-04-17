import React from 'react'
import { Link } from "react-router-dom";
import { useAuthStore } from "../store/useAuthStore";
import { LogOut, Shell, MessagesSquare, User } from "lucide-react";

const Navbar = () => {
  const { logout, authUser } = useAuthStore();

  return (
    <header className="bg-base-100 border-b border-base-300 fixed w-full top-0 z-40 backdrop-blur-lg">
      <div className="container mx-auto px-4 sm:px-12 h-16">
        <div className="flex items-center justify-between h-full">

        <div className="flex items-center gap-4 lg:gap-8">
          <div>
            <Link to="/" className="flex items-center gap-2.5 hover:opacity-80 transition-all">
              <div className="size-9 rounded-lg bg-purple-100 flex items-center justify-center">
                <Shell className="w-5 h-5 text-purple-500" />
              </div>
              <h1 className="text-lg font-bold">InkSync</h1>
            </Link>
          </div>

          {authUser && (<div className="flex items-center">

            <Link to="/communities">
              <div className="text-md text-gray-600 hover:text-black transition-colors cursor-pointer">
                Explore
              </div>
            </Link>
          </div>)}
        </div>

        <div className="flex items-center gap-2">
            {!authUser && (
              <>
                <Link
                  to={"/signup"}
                  className={`btn bg-purple-400 text-white gap-2 transition-colors hover:bg-purple-500 duration-500 ease-in-out`}
                >
                  <span className="sm:inline text-base lg:px-3">Register</span>
                </Link>
                <Link
                  to={"/login"}
                  className={`btn gap-2 transition-colors border-1 border-purple-400 text-purple-500 hover:bg-purple-100 duration-500 ease-in-out`}
                >
                  <span className="sm:inline text-base lg:px-3">Login</span>
                </Link>
              </>
            )}          
            {authUser && (
                  <>
                <Link
                  to={"/chat"}
                  className={`
                  btn btn-sm gap-2 transition-colors border-purple-500 bg-white hover:bg-purple-100 duration-500 ease-in-out`}
                >
                  <MessagesSquare className="w-4 h-4 text-purple-500 " />
                </Link>

                <Link to={`/user/${authUser.username}`} className={`btn btn-sm gap-2 bg-purple-400 text-white hover:bg-purple-500 duration-500 ease-in-out transition-colors`}>
                  <User className="size-5" />
                  <span className="hidden sm:inline">Profile</span>
                </Link>

                <button className="flex cursor-pointer btn btn-sm gap-2 items-center bg-white hover:text-purple-600" onClick={logout}>
                  <LogOut className="size-5" />
                  <span className="hidden sm:inline">Logout</span>
                </button>
              </>
            )}
          </div>


        </div>
      </div>
    </header>
  )
}

export default Navbar