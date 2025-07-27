import React from 'react'
import { useNavigate } from 'react-router';


const login = () => {

    const navigate = useNavigate();

    const login_btn = async (e) => {
        e.preventDefault();
        const formData = {
            email: e.target.email.value,
            password: e.target.password.value
        }

        const response = await fetch(`http://localhost:3000/auth/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            credentials: 'include',
            body: JSON.stringify(formData)
        });

        // 
        // if(response.code)
        const message = await response.json()
        console.log(message)
        if(response.status == 200){
            window.alert("Login Sucessfull")
            navigate('/')
            window.location.reload();
        }else{
            window.alert(message.error)
        }
    }


  return (
        <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <form className="bg-white p-8 rounded shadow-md w-full max-w-md" onSubmit={login_btn}>
            <div className='text-3xl text-blue-700 font-bold  border-b-3  mb-4 inline-block' >
                    Login &nbsp; &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                </div>
            
            <div className="mb-4">
                <label htmlFor="email" className="block text-gray-700 mb-2">Email:</label>
                <input type="email" id="email" name="email" required className="w-full px-3 py-2 border rounded focus:outline-none  focus:ring-2 focus:ring-blue-400" />
            </div>
            <div className="mb-6">
                <label htmlFor="password" className="block text-gray-700 mb-2">Password:</label>
                <input type="password" id="password" name="password" required className="w-full px-3 py-2 border rounded focus:outline-none  focus:ring-2 focus:ring-blue-400" />
            </div>
            <button type="submit" className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600 transition">Login</button>
        </form>
    </div>
  )
}

export default login