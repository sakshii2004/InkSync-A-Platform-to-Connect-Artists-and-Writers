const SkeletonLoader = () => (
    <ul>
      {[...Array(5)].map((_, i) => (
        <li key={i} className="flex items-center justify-between mb-2 animate-pulse">
          {/* Left side: Fake PFP and name lines */}
          <div className="flex items-center">
            <div className="w-8 h-8 bg-gray-300 rounded-full mr-2" />
            <div>
              <div className="h-3 w-24 bg-gray-300 rounded mb-1" />
              <div className="h-2 w-16 bg-gray-200 rounded" />
            </div>
          </div>
          {/* Right side: Role pill */}
          <div className="h-6 w-14 bg-gray-200 rounded-md mr-3" />
        </li>
      ))}
    </ul>
  );

export default SkeletonLoader;