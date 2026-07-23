import React,{useEffect, useState} from 'react'
//Pages
// import { BrowserRouter } from 'react-router'
import Routes from './Routes.jsx'
import { useDispatch } from 'react-redux'
import { updateUser } from './Slices/userSlice.js';
import axiosInstance from './lib/axiosInstance.js';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const app = () => {
  const dispatch = useDispatch();


    useEffect(() => {
    const getUSer = async () => {
      try {
        const { data } = await axiosInstance.get('/user/get-user');
        dispatch(updateUser(data.message));
      }
      catch (err) {
        console.error(err);
      }
    };
    getUSer()
  }, [])



    
  return (
    // <OTPWithPopup />
    <>
      <Routes />
      <ToastContainer position="top-right" autoClose={3000} />
    </>
  )
}

export default app
