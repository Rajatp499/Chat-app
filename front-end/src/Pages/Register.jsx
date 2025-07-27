import React from 'react'
import { Link, useNavigate } from 'react-router';
import "reactjs-popup/dist/index.css";
import Popup from "reactjs-popup";
import { useState } from 'react';

const form = () => {
    const navigate = useNavigate();
    const [gender, setGender] = useState('')

    const send = async (otp) => {
        // Collect form data
        const name = document.querySelector('input[name="name"]').value;
        const email = document.querySelector('input[name="email"]').value;
        const password = document.querySelector('input[name="password"]').value;

        const formData = {
            name,
            email,
            password,
            otp,
            gender
        }

        const response = await fetch('http://localhost:3000/auth/register', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            credentials: 'include',
            body: JSON.stringify(formData),

        });

        // if (response.status == 200) {
        const data = await response.json();
        console.log(data);

        Object.values(data).forEach((m) => {
            if (typeof m == 'object')
                return null;
            window.alert(m)

            if (m == "Data received and saved successfully") {

                navigate('/')
                window.location.reload()
            }
        })
        // }

    }

    console.log(gender)
    const gender_change=(e)=>{
        setGender(e.target.value)
        // console.log(e.target.value)
    }

    //POPUP
    const [otp, setOtp] = useState();
    const [popupOpen, setPopupOpen] = useState(false);

    const popUp = async (e) => {
        e.preventDefault();
        if (document.querySelector('input[name= "email"]').value) {
            const result = await fetch('http://localhost:3000/auth/send-otp', {
                method: 'POST',
                credentials: 'include',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email: document.querySelector('input[name="email"]').value })
            });
            const response = await result.json();
            console.log(response);
            if (response.message == "OTP sent successfully") {
                setPopupOpen(true);
            }
            else{
                window.alert(response.message)
            }
        }
        else {
            window.alert("Please Enter an Email")
        }

    }



    const handleSubmit = async () => {
        console.log("Entered OTP:", otp);
        send(otp);
    };



    return (<>
        <div className="flex items-center justify-center min-h-screen bg-gray-100">

            <form className="bg-white p-8 rounded shadow-md w-full max-w-md" onSubmit={popUp} >
                <div className='text-3xl text-blue-700 font-bold  border-b-3  mb-4 inline-block' >
                    Register &nbsp; &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                </div>
                <div className="mb-4">
                    <label htmlFor="name" className="block text-gray-700 mb-2">Name:</label>
                    <input type="text" id="name" name="name" required className="w-full px-3 py-2 border rounded focus:outline-none  focus:ring-2 focus:ring-blue-400" />
                </div>
                <div className="mb-4">
                    <label htmlFor="genser" className="block text-gray-700 mb-2">Gender:</label>
                    <div className='flex justify-around'>
                    <div><input type="radio"   name="gender" value='male' onChange={gender_change} className="form-radio text-blue-600" /> Male</div>
                    <div><input type="radio"  name="gender" value='female' onChange={gender_change} className="form-radio text-blue-600" /> Female</div>
                    </div>

                </div>
                <div className="mb-4">
                    <label htmlFor="email" className="block text-gray-700 mb-2">Email:</label>
                    <input type="email" id="email" name="email" required className="w-full px-3 py-2 border rounded focus:outline-none  focus:ring-2 focus:ring-blue-400" />
                </div>
                <div className="mb-6">
                    <label htmlFor="password" className="block text-gray-700 mb-2">Password:</label>
                    <input type="password" id="password" name="password" minLength={6} required className="w-full px-3 py-2 border rounded focus:outline-none  focus:ring-2 focus:ring-blue-400" />
                </div>
                <button className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600 transition">Register</button>

                <p className="mt-4 text-center text-gray-600">
                    Already have an account? <Link to="/login" className="text-blue-500 hover:underline">Login</Link>
                </p>
            </form>
        </div>

        <Popup open={popupOpen} onClose={() => setPopupOpen(false)}>
            <div style={{ padding: "2rem", textAlign: "center" }}>
                <h3>Enter OTP that has been sent to your email.</h3>
                <div style={{ display: "flex", justifyContent: "center", gap: "0.5rem", margin: "1rem 0" }}>
                    <input
                        name='otp'
                        type="number"
                        maxLength={6}
                        value={otp}
                        onChange={(e) => setOtp(e.target.value)}
                    />
                </div>
                <button onClick={handleSubmit} style={{ marginRight: "1rem" }}>
                    Submit
                </button>
                <button onClick={() => setPopupOpen(false)}>Close</button>
            </div>
        </Popup>
    </>
    )
}

export default form