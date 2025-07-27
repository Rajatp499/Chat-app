// src/components/Navbar.jsx
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import Popup from 'reactjs-popup';

const Navbar = () => {

  const user = useSelector(state => state.user)
  const [popUpOpen, setPopUpOpen] = useState(false)
const [preview, setPreview] = useState(null);
const [selectedFile, setSelectedFile] = useState(null);
const [currentprofilePopUp, setCurrentProfilePopUp] = useState(false)



const handleFileChange = (e) => {
  const file = e.target.files[0];
  if (file) {
    setSelectedFile(file);
    const reader = new FileReader();
    reader.onloadend = () => {
      setPreview(reader.result);
    };
    reader.readAsDataURL(file);
  }
};
const handleUpload = async () => {
  if (!selectedFile) return;
  const formData = new FormData();
  formData.append("file", selectedFile);

  try {
    const res = await fetch("http://localhost:3000/user/upload", {
      method: "POST",
      credentials: "include",
      body: formData,
    });

    if (res.ok) {
      const result = await res.json();
      console.log("Upload successful:", result);
      window.location.reload(); // ✅ Refresh page after upload
    } else {
      console.error("Upload failed");
    }
  } catch (err) {
    console.error("Error uploading file", err);
  }
};

const cancelSelection = () => {
  setSelectedFile(null);
  setPreview(null);
};



  const logout = async () => {
    try {
      const result = await fetch('http://localhost:3000/auth/logout', {
        method: 'GET',
        credentials: 'include',
      });

      const response = await result.json()
      console.log(response)
      window.location.reload()
    }
    catch (err) {
      console.log(err);
    }
  }



  return (
    <>
      <nav className="h-16 bg-gradient-to-r from-blue-700 to-blue-500 text-white shadow-md px-6 py-4 flex justify-between items-center">
        <Link to="/" className="text-3xl font-extrabold tracking-wide hover:opacity-90 transition">
          MyApp
        </Link>

        <div className="flex items-center space-x-4">
          {user.name ? (
            <>
              {/* Profile + Name */}
              <div className="flex items-center gap-3 px-4 py-2 rounded-xl hover:bg-white/10 transition cursor-pointer" onClick={()=>setPopUpOpen(!popUpOpen)}>
                <img
                  src={`http://localhost:3000/${user.profile}`}
                  alt="Profile"
                  className="w-10 h-10 rounded-full object-cover border border-white/40 shadow-sm"
                />
                <span className="font-semibold text-sm">{user.name}</span>
              </div>

              {/* Logout Button */}
              <div
                className="bg-white text-blue-600 font-semibold px-4 py-2 rounded-lg hover:bg-gray-100 transition duration-200 shadow-sm cursor-pointer"
                onClick={logout}
              >
                Log Out
              </div>
            </>
          ) : (
            <>
              <Link
                to="/login"
                className="bg-white text-blue-600 font-semibold px-4 py-2 rounded-lg hover:bg-gray-100 transition duration-200 shadow-sm"
              >
                Login
              </Link>
              <Link
                to="/register"
                className="bg-white text-blue-600 font-semibold px-4 py-2 rounded-lg hover:bg-gray-100 transition duration-200 shadow-sm"
              >
                Signup
              </Link>
            </>
          )}
        </div>
      </nav>

{popUpOpen && (
  <div className="absolute right-2 top-15 bg-white rounded-xl shadow-lg p-4 w-72 border border-gray-200 z-50">
    <div className="flex flex-col items-center gap-4">

      {/* Email Info */}
      <div className="text-center">
        <p className="text-sm text-gray-500">Logged in as:</p>
        <p className="text-blue-600 font-semibold">{user.email}</p>
      </div>
      <div className="text-center">
        <p className="text-sm text-gray-500">Member since:</p>
        <p className="text-sm ">{user.createdAt}</p>
      </div>
      <div>
      {/* Upload Section */}
      {!preview && (
        <>
        <label className="w-full text-center">
          <input
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            className="hidden"
          />
          <div className="bg-blue-600 text-white text-sm py-2 px-4 rounded-lg cursor-pointer hover:bg-blue-700 transition">
            Select Profile Image
          </div>
        </label>
        <div className=' mt-1 text-sm text-center cursor-pointer hover:text-blue-600' onClick={()=> setCurrentProfilePopUp(true)}>view current profile</div>
        </>
      )}
      </div>

      {/* Preview + Confirmation */}
      {preview && (
        <>
          <img
            src={preview}
            alt="Preview"
            className="w-24 h-24 rounded-full border object-cover"
          />

          <div className="flex gap-2">
            <button
              onClick={handleUpload}
              className="bg-green-600 text-white px-4 py-1 rounded hover:bg-green-700"
            >
              Upload
            </button>
            <button
              onClick={cancelSelection}
              className="bg-gray-300 text-black px-4 py-1 rounded hover:bg-gray-400"
            >
              Cancel
            </button>
          </div>
        </>
      )}
    </div>
  </div>
)}

{
  <Popup open={currentprofilePopUp} onClose={()=>setCurrentProfilePopUp(false)} closeOnDocumentClick>
     <img src={`http://localhost:3000/${user.profile}`} alt="Profile" />
  </Popup>
}

    </>
  );
};

export default Navbar;
