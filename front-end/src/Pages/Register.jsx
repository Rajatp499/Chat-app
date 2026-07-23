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

    const gender_change = (e) => {
        setGender(e.target.value)
    }

    //POPUP
    const [otp, setOtp] = useState(['', '', '', '', '', '']);
    const [popupOpen, setPopupOpen] = useState(false);

    const handleOtpChange = (index, value) => {
        // Only allow single digit
        if (value.length > 1) return;

        // Only allow numbers
        if (value && !/^\d$/.test(value)) return;

        const newOtp = [...otp];
        newOtp[index] = value;
        setOtp(newOtp);

        // Auto-focus next input if value is entered
        if (value && index < 5) {
            document.getElementById(`otp-${index + 1}`).focus();
        }
    };

    const handleOtpKeyDown = (index, e) => {
        // Handle backspace
        if (e.key === 'Backspace' && !otp[index] && index > 0) {
            document.getElementById(`otp-${index - 1}`).focus();
        }
    };

    const handleOtpPaste = (e) => {
        e.preventDefault();
        const pastedData = e.clipboardData.getData('text').slice(0, 6);

        if (!/^\d+$/.test(pastedData)) return;

        const newOtp = [...otp];
        pastedData.split('').forEach((char, index) => {
            if (index < 6) newOtp[index] = char;
        });
        setOtp(newOtp);

        // Focus last filled input or the 6th one
        const lastIndex = Math.min(pastedData.length, 5);
        document.getElementById(`otp-${lastIndex}`).focus();
    };


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
            else {
                window.alert(response.message)
            }
        }
        else {
            window.alert("Please Enter an Email")
        }

    }



    const handleSubmit = async () => {
        const otpString = otp.join('');
        if (otpString.length !== 6) {
            window.alert("Please enter all 6 digits");
            return;
        }
        console.log("Entered OTP:", otpString);
        send(otpString);
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
                        <div><input type="radio" name="gender" value='male' onChange={gender_change} className="form-radio text-blue-600" /> Male</div>
                        <div><input type="radio" name="gender" value='female' onChange={gender_change} className="form-radio text-blue-600" /> Female</div>
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
            <div style={{ padding: "2rem", textAlign: "center", minWidth: "400px" }}>
                <h3 style={{ marginBottom: "1.5rem", color: "#333" }}>Enter OTP</h3>
                <p style={{ color: "#666", marginBottom: "1.5rem", fontSize: "14px" }}>
                    Enter the 6-digit code sent to your email
                </p>
                <div style={{
                    display: "flex",
                    justifyContent: "center",
                    gap: "0.5rem",
                    margin: "1.5rem 0"
                }}>
                    {otp.map((digit, index) => (
                        <input
                            key={index}
                            id={`otp-${index}`}
                            type="text"
                            inputMode="numeric"
                            maxLength={1}
                            value={digit}
                            onChange={(e) => handleOtpChange(index, e.target.value)}
                            onKeyDown={(e) => handleOtpKeyDown(index, e)}
                            onPaste={index === 0 ? handleOtpPaste : undefined}
                            style={{
                                width: "45px",
                                height: "50px",
                                fontSize: "24px",
                                textAlign: "center",
                                border: "2px solid #ddd",
                                borderRadius: "8px",
                                outline: "none",
                                transition: "all 0.2s",
                            }}
                            onFocus={(e) => {
                                e.target.style.borderColor = "#3b82f6";
                                e.target.style.boxShadow = "0 0 0 3px rgba(59, 130, 246, 0.1)";
                            }}
                            onBlur={(e) => {
                                e.target.style.borderColor = "#ddd";
                                e.target.style.boxShadow = "none";
                            }}
                        />
                    ))}
                </div>
                <div style={{ display: "flex", gap: "0.5rem", justifyContent: "center", marginTop: "2rem" }}>
                    <button
                        onClick={handleSubmit}
                        style={{
                            padding: "0.6rem 2rem",
                            backgroundColor: "#3b82f6",
                            color: "white",
                            border: "none",
                            borderRadius: "6px",
                            fontSize: "16px",
                            cursor: "pointer",
                            fontWeight: "500"
                        }}
                        onMouseOver={(e) => e.target.style.backgroundColor = "#2563eb"}
                        onMouseOut={(e) => e.target.style.backgroundColor = "#3b82f6"}
                    >
                        Verify OTP
                    </button>
                    <button
                        onClick={() => setPopupOpen(false)}
                        style={{
                            padding: "0.6rem 2rem",
                            backgroundColor: "#e5e7eb",
                            color: "#374151",
                            border: "none",
                            borderRadius: "6px",
                            fontSize: "16px",
                            cursor: "pointer",
                            fontWeight: "500"
                        }}
                        onMouseOver={(e) => e.target.style.backgroundColor = "#d1d5db"}
                        onMouseOut={(e) => e.target.style.backgroundColor = "#e5e7eb"}
                    >
                        Cancel
                    </button>
                </div>
            </div>
        </Popup>
    </>
    )
}

export default form