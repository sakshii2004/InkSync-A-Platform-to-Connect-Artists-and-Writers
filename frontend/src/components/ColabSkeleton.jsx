const ColabSkeleton = () => {
    return (
      <div className="w-full flex flex-col gap-y-1.5 p-2.5 mb-2 border border-gray-200 rounded-md animate-pulse bg-gray-50">
        <div className="flex justify-between items-center">
          <div className="h-5 w-1/3 bg-gray-300 rounded-md" />
          <div className="h-5 w-20 bg-gray-300 rounded-md" />
        </div>
        <div className="h-4 w-3/4 bg-gray-300 rounded-md mt-2" />
        <div className="h-3 w-full bg-gray-200 rounded-md mt-1" />
        <div className="h-3 w-1/2 bg-gray-200 rounded-md mt-1" />
      </div>
    );
  };

export default ColabSkeleton;