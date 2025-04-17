import React from 'react';
import { useEffect, useState } from "react";
import AutoImageSlider from "../components/AutoImageSlider";
import { ChevronRight, ChevronLeft, X } from "lucide-react";
const PortfolioCard = ({portfolios}) => {

    const [lightboxImages, setLightboxImages] = useState([]);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [showLightbox, setShowLightbox] = useState(false);

    const openLightbox = (images, index = 0) => {
        setLightboxImages(images);
        setCurrentIndex(index);
        setShowLightbox(true);
    };

    const closeLightbox = () => setShowLightbox(false);

    return (
        <div className="flex flex-col gap-y-4 mt-3">
        {portfolios.length === 0 ? (
        <p>No portfolios yet.</p>
        ) : (
        portfolios.map((item) => (
            (item.type == "Writer" ?
            <div key={item._id} className="width-full flex flex-col gap-y-1.5 p-2.5 border-1 border-gray-200 rounded-md hover:border hover:border-green-300 transition-all duration-500 ease-in-out">
                <div className="flex gap-x-2">
                <h3 className="text-lg font-semibold">{item.title}</h3>
                <a
                    href={item.externalLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn btn-sm h-7 border-none bg-green-100 text-green-600 hover:bg-green-50 transition-colors duration-500 ease-in-out"
                >
                    Read
                </a>
                </div>
                <p className="text-sm text-gray-700">{item.description}</p>
            </div>
            :
            <div
                key={item._id}
                className="w-full flex flex-col sm:flex-row gap-3 p-3 border border-gray-200 rounded-md hover:border hover:border-blue-300 transition-all duration-500 ease-in-out"
            >
                {/* Image Section */}
                <div className="w-full sm:w-22 h-48 sm:h-22 flex-shrink-0">
                    <AutoImageSlider images={item.images} />
                </div>

                {/* Text + Button */}
                <div className="flex flex-col justify-between w-full">
                <h3 className="text-lg font-semibold">{item.title}</h3>
                <p className="text-sm text-gray-700 mt-1">{item.description}</p>
                <button
                    onClick={() => openLightbox(item.images)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn btn-sm w-fit h-7 mt-2 border-none bg-blue-100 text-blue-600 hover:bg-blue-50 transition-colors duration-500 ease-in-out">
                    View
                </button>
                </div>
            </div>

            )
        ))
        )}

        {showLightbox && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 bg-opacity-80" onClick={closeLightbox}>
            <div className="relative max-w-[90%] max-h-[90%] flex items-center justify-center" onClick={(e) => e.stopPropagation()} >
            {/* Image */}
            <img
                src={lightboxImages[currentIndex]}
                alt=""
                className="max-w-[90vw] max-h-[90vh] rounded-md"
            />

            {/* Left arrow */}
            {currentIndex > 0 && (
                <button
                onClick={() => setCurrentIndex((prev) => prev - 1)}
                className="absolute left-2 text-white text-4xl bg-black/40 rounded-full w-10 h-10 flex items-center justify-center hover:bg-black/50 transition-all duration-400 ease-in-out"
                >
                <ChevronLeft className="w-5 h-5" />
                </button>
            )}

            {/* Right arrow */}
            {currentIndex < lightboxImages.length - 1 && (
                <button
                onClick={() => setCurrentIndex((prev) => prev + 1)}
                className="absolute right-2 text-white text-4xl bg-black/40 rounded-full w-10 h-10 flex items-center justify-center hover:bg-black/50 transition-all duration-400 ease-in-out"
                >
                <ChevronRight className="w-5 h-5" />
                </button>
            )}

            {/* Close Button (optional) */}
            <button
                onClick={closeLightbox}
                className="absolute top-2 right-2 text-white text-2xl bg-black/60 rounded-full w-8 h-8 flex items-center justify-center hover:bg-black/50 transition-all duration-400 ease-in-out"
            >
                <X className="w-5 h-5"/>
            </button>
            </div>
        </div>
        )}
    </div>
    )
    }

export default PortfolioCard