import React, { useState } from "react";
import { Camera, TypeOutline, AlignCenter, Link } from "lucide-react";
import { useAuthStore } from "../store/useAuthStore";
import { useProfileStore } from "../store/useProfileStore";
import { useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";

const AddPortfolioPage = () => {
  const { authUser } = useAuthStore();
  const { createPortfolio } = useProfileStore();
  const navigate = useNavigate();

  const [portfolio, setPortfolio] = useState({
    title: "",
    description: "",
    images: [],
    externalLink: "",
    type: authUser?.role === "Dual Creator" ? "" : authUser?.role,
  });

  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files);
    if (files.length + portfolio.images.length > 25) {
      alert("You can only upload up to 25 images.");
      return;
    }
    const readers = files.map((file) => {
      return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onloadend = () => resolve(reader.result);
        reader.onerror = reject;
        reader.readAsDataURL(file);
      });
    });

    Promise.all(readers).then((results) => {
      setPortfolio((prev) => ({
        ...prev,
        images: [...prev.images, ...results],
      }));
    });
  };

  const handleSubmit = async () => {
    const { title, description, type, externalLink } = portfolio;
    const urlRegex = /^https?:\/\/[\w.-]+\.[a-z]{2,}.*$/;
  
    if (!title) {
      toast.error("Please give a title to your portfolio item.");
      return;
    }

    if (!description) {
      toast.error("Please provide a description for your portfolio item.");
      return;
    }

    if (!type) {
      toast.error("Please select the type of portfolio.");
      return;
    }

    if (externalLink && !urlRegex.test(externalLink)) {
      toast.error("Please enter a valid external link.");
      return;
    }
  
    try {
      await createPortfolio(portfolio);
      toast.success("Portfolio created successfully!");
      navigate(`/user/${authUser.username}`);
    } 
    catch (error) {
      toast.error("Something went wrong. Please try again.");
    }
  };

  return (
    <div className="h-screen pt-20">
      <div className="max-w-2xl mx-auto p-4 py-8">
        <div className="bg-base-300 rounded-xl p-6 space-y-8">
          <div className="text-center">
            <h1 className="text-2xl font-semibold">Create Portfolio Item</h1>
            <p className="mt-2">Fill in the details to showcase your work</p>
          </div>

          {authUser?.role === "Dual Creator" && (
            <div className="flex justify-center gap-4">
              {["Writer", "Artist"].map((role) => (
                <button
                  key={role}
                  onClick={() => setPortfolio((prev) => ({ ...prev, type: role, images: [] }))}
                  className={`btn ${
                    portfolio.type === role ? "bg-purple-500 text-white" : "bg-base-200"
                  }`}
                >
                  {role}
                </button>
              ))}
            </div>
          )}

          <div className="space-y-6">
            <div className="space-y-1.5">
              <div className="text-sm text-zinc-400 flex items-center gap-2">
                <TypeOutline className="w-4 h-4" />
                Title
              </div>
              <input
                type="text"
                value={portfolio.title}
                placeholder="Give your work a title"
                onChange={(e) => setPortfolio({ ...portfolio, title: e.target.value })}
                className="px-4 py-2.5 bg-base-200 w-full rounded-lg border focus:outline-none focus:border-purple-800"
              />
            </div>

            <div className="space-y-1.5">
              <div className="text-sm text-zinc-400 flex items-center gap-2">
                <AlignCenter className="w-4 h-4" />
                Description
              </div>
              <textarea
                value={portfolio.description}
                onChange={(e) => setPortfolio({ ...portfolio, description: e.target.value })}
                placeholder="A few lines describing your work"
                rows={4}
                className="px-4 py-2.5 bg-base-200 w-full rounded-lg border focus:outline-none focus:border-purple-800 resize-none"
              />
            </div>

            {portfolio.type === "Writer" && (
              <div className="space-y-1.5">
                <div className="text-sm text-zinc-400 flex items-center gap-2">
                  <Link className="w-4 h-4" />
                  External Link
                </div>
                <input
                  type="text"
                  value={portfolio.externalLink}
                  onChange={(e) => setPortfolio({ ...portfolio, externalLink: e.target.value })}
                  placeholder="https://somethingreallycool.com"
                  className="px-4 py-2.5 bg-base-200 w-full rounded-lg border focus:outline-none focus:border-purple-800"
                />
              </div>
            )}

            {portfolio.type === "Artist" && (
              <div className="space-y-2">
                <label className="text-sm text-zinc-400 flex items-center gap-2">
                  <Camera className="w-4 h-4" />
                  Upload Images (Max 25)
                </label>
                <input
                  type="file"
                  multiple
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="file-input file-input-bordered w-full"
                />
                {portfolio.images.length > 0 && (
                  <p className="text-sm text-green-500">{portfolio.images.length} image(s) selected</p>
                )}
              </div>
            )}

            <div className="flex justify-center">
              <button
                onClick={handleSubmit}
                className="btn bg-purple-400 text-white hover:bg-purple-500 transition-all"
              >
                Create Portfolio
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddPortfolioPage;
