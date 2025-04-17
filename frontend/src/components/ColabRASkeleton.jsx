import { useState, useEffect } from 'react';

const ColabRASkeleton = () => {
  return (
    <div className="w-full flex flex-col gap-y-0.5 p-2.5 mb-2 border-1 border-gray-200 rounded-md animate-pulse">
      <div className="bg-gray-300 h-6 w-3/4 rounded-md mb-2"></div> {/* Title Skeleton */}
      <div className="bg-gray-300 h-4 w-1/2 rounded-md mb-2"></div> {/* Sent by Skeleton */}
      <div className="bg-gray-300 h-4 w-3/4 rounded-md mb-4"></div> {/* Description Skeleton */}
      <div className="flex gap-x-1">
        <div className="bg-gray-300 w-16 h-7 rounded-md"></div> {/* View Button Skeleton */}
        <div className="bg-gray-300 w-16 h-7 rounded-md"></div> {/* Accept Button Skeleton */}
        <div className="bg-gray-300 w-16 h-7 rounded-md"></div> {/* Decline Button Skeleton */}
      </div>
    </div>
  );
};

export default ColabRASkeleton;
