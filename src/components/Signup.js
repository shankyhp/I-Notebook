import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom';

const Signup = (props) => {
    const [credentials, setCredentials] = useState({ email: "", password: "", cpassword: "", name: "" })
    let history = useNavigate()

    const handelSubmit = async (e) => {

        e.preventDefault()

        const { name, email, password } = credentials;
        const response = await fetch("http://localhost:5000/api/auth/createuser", {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'

            },
            body: JSON.stringify({ name, email, password })
        });
        const json = await response.json()
        console.log(json);
        if (json.success) {

            // Save the auth token and redirect
            localStorage.setItem('token', json.authtoken);
            history('/')
            props.showAlert("Account Created Successfully", "success")

        } else {
            props.showAlert("Invalid Details", "danger")
        }

    }

    const onChange = (e) => {
        setCredentials({ ...credentials, [e.target.name]: e.target.value })
    }

    return (
        <div className='container mt-2'>

            <h2 className='my-2'>Create a account to use I-NoteBook</h2>

            <form onSubmit={handelSubmit}>
                <div className="form-group my-3">
                    <label htmlFor="name">Name</label>
                    <input type="text" className="form-control" onChange={onChange} id="name" name="name" aria-describedby="emailHelp" placeholder="Enter name" />

                </div>
                <div className="form-group my-3">
                    <label htmlFor="email">Email address</label>
                    <input type="email" className="form-control" onChange={onChange} id="email" name="email" aria-describedby="emailHelp" placeholder="Enter email" />

                </div>
                <div className="form-group my-3 ">
                    <label htmlFor="password">Password</label>
                    <input type="password" className="form-control" onChange={onChange} id="password" name="password" placeholder="Password" minLength={5} required />
                </div>
                <div className="form-group my-3">
                    <label htmlFor="cpassword">Confirm Password</label>
                    <input type="cpassword" className="form-control" onChange={onChange} id="cpassword" name="cpassword" placeholder="Password" minLength={5} required />
                </div>

                <button type="submit" className="btn btn-primary my-2">Submit</button>
            </form>

        </div>
    )
}

export default Signup