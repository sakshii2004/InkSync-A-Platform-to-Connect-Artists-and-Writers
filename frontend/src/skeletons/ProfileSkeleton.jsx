export const ProfileSkeleton = () => {
    return (
      <div className="min-h-screen mt-12 p-6 animate-pulse">
        <div className="bg-white h-auto flex flex-col justify-center items-center pt-15 pb-5">
          <div className="w-22 h-22 rounded-full bg-gray-300 mb-2" />
          <div className="h-5 w-40 bg-gray-300 rounded mb-1" />
          <div className="h-4 w-24 bg-gray-200 rounded" />
  
          <div className="flex justify-center items-center mt-5 gap-x-7">
            <div className="flex flex-col justify-center items-center leading-none">
              <div className="h-5 w-6 bg-gray-300 rounded mb-1" />
              <div className="h-3 w-12 bg-gray-200 rounded" />
            </div>
            <div className="flex flex-col justify-center items-center leading-none">
              <div className="h-5 w-6 bg-gray-300 rounded mb-1" />
              <div className="h-3 w-12 bg-gray-200 rounded" />
            </div>
            <div className="flex flex-col justify-center items-center leading-none">
              <div className="h-5 w-6 bg-gray-300 rounded mb-1" />
              <div className="h-3 w-12 bg-gray-200 rounded" />
            </div>
          </div>
        </div>
  
        <div className="bg-white w-full lg:w-[85%] mx-auto px-4 py-3 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 rounded-lg shadow-md mt-6">
          <div className="flex gap-4 sm:gap-8 justify-center sm:justify-start">
            <div className="h-4 w-20 bg-gray-300 rounded" />
            <div className="h-4 w-20 bg-gray-300 rounded" />
            <div className="h-4 w-28 bg-gray-300 rounded" />
          </div>
          <div className="flex gap-4 justify-center sm:justify-end">
            <div className="h-10 w-24 bg-gray-300 rounded" />
            <div className="h-10 w-24 bg-gray-300 rounded" />
          </div>
        </div>
      </div>
    );
  };
  