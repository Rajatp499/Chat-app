import React,{useEffect, useState} from 'react'
//Pages
// import { BrowserRouter } from 'react-router'
import Routes from './Routes.jsx'
import { useDispatch } from 'react-redux'
import { updateUser } from './Slices/userSlice.js';

const app = () => {
  const dispatch = useDispatch();


    useEffect(() => {
    const getUSer = async () => {
      try {
        const result = await fetch('http://localhost:3000/user/get-user', {
          method: 'GET',
          credentials: 'include'
        })

        const response = await result.json();
        dispatch(updateUser(response.message))
      }
      catch (err) {
        console.log(err.message);
      }
    };
    getUSer()
  }, [])



    
  return (
    // <OTPWithPopup />
    <Routes />
  )
}

export default app
