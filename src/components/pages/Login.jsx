import { useEffect, useState } from 'react'
import axios from "axios"
import { useNavigate } from 'react-router-dom'
import Swal from 'sweetalert2'
// import './App.css'
function Login({ setMainUser }) {
    const [position, setPosition] = useState(false)
    const [loginMessage, setLoginMessage] = useState("")
    const [loginData, setLoginData] = useState({
        email: "",
        password: ""
    })
    const [registerData, setRegisterData] = useState({
        email: "",
        message: ""
    })
    const navigate = useNavigate()
    useEffect(() => {
        axios.get("http://localhost:3000/authorized").then((data) => {
            // console.log(data.data)
            if (data.data.valid) {
                navigate("/")
            }
        })
    }, [])
    useEffect(() => {
        document.querySelector(".sidebar").classList.add("d-none")
        document.querySelector(".topbar").classList.add("d-none")
    })
    function handleLoginSubmit(e) {
        e.preventDefault()
        axios.defaults.withCredentials = true
        axios.post("http://localhost:3000/login", loginData).then((data) => {
            if (data.data.valid) {
                setLoginMessage('')
                Swal.fire({
                    title: "Good Job!",
                    icon: "success",
                    text: "Succesfully Logged In..",
                })
                document.querySelector(".sidebar").classList.remove("d-none")
                document.querySelector(".topbar").classList.remove("d-none")
                setTimeout(() => {
                    Swal.close()
                }, 1000)
                navigate("/")
            }
            else {
                setLoginMessage(data.data.message)
                console.log(data.data.message)
            }
        }).catch((err) => {
            console.log(err)
        })
    }
    function handleRegisterSubmit(e) {
        e.preventDefault()
        axios.defaults.withCredentials = true
        // console.log(registerData)
        let empty = []
        for (let key in registerData) {
            if (registerData[key] == "") {
                empty.push("Enter " + key)
            }
        }
        // console.log(empty)
        if (empty.length) {
            let str = empty.join("<br>")
            Swal.fire({
                title: "Oops....!",
                icon: "warning",
                html: str
            })
        }
        else {

            axios.post("http://localhost:3000/enquiry/newenquiry", registerData).then((data) => {
                // console.log(data.data)
                let str = ""
                let title = ""
                let icon = ""
                if (data.data.newEnquiry) {
                    str = "Succesfully Recieved Your Request.."
                    title = "Good Job!"
                    icon = "success"
                }
                else {
                    str = "Your Previouse request is also pending.."
                    title = "Oops...."
                    icon = "warning"
                }
                Swal.fire({
                    title,
                    icon,
                    text: str,
                    // timer:1000
                })
                e.target.email.value = ""
                e.target.message.value = ""
            }).catch((err) => {
                console.log(err)
            })
        }
    }
    return (
        <>
            <div className="login-wrapper">
                <div className="login main-box">
                    <div className={position ? "lower-box left" : "lower-box"}>
                        <div className={position ? "lower-inner left" : "lower-inner"}>
                            <div className="login-form">
                                <form action="/login" method="post" onSubmit={handleLoginSubmit}>
                                    <h2>Login</h2>
                                    <div className="form-fields">
                                        <input type="email" name="email" placeholder='Enter Email Address' onChange={(e) => setLoginData({ ...loginData, email: e.target.value })} />
                                        <input type="password" name="password" placeholder='Enter Password' onChange={(e) => setLoginData({ ...loginData, password: e.target.value })} />
                                        <p className='m-0 align-self-start text-danger' style={{ fontFamily: "cursive" }}>{loginMessage}</p>
                                        <a href="">Forget your password?</a>
                                        <button className="btn">SIGN IN</button>
                                    </div>
                                </form>
                            </div>
                            <div className="register-form">
                                <form onSubmit={handleRegisterSubmit}>
                                    <h2>Send Request</h2>
                                    <div className="form-fields">
                                        <input type="email" name="email" placeholder='Enter Email Address' onChange={(e) => setRegisterData({ ...registerData, email: e.target.value })} />
                                        <textarea name="message" className='form-control' rows={4} placeholder='Message' onChange={(e) => setRegisterData({ ...registerData, message: e.target.value })}></textarea>
                                        <button className="btn">Get Started</button>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>
                    <div className={position ? "upper-box right" : "upper-box"}>
                        <div className={position ? "upper-inner right" : "upper-inner"}>
                            <div className="login-box">
                                <h2>Welcome Back!</h2>
                                <p>Please sign in if you are a user.</p>
                                <button className="btn box-btn" onClick={() => setPosition(!position)}>SIGN IN</button>
                            </div>
                            <div className="register-box">
                                <h2>Hello, Friends!</h2>
                                <p>If you are new then enter your personal details and start journey with us. We will contact you soon</p>
                                <button className="btn box-btn" onClick={() => setPosition(!position)}>Send Request</button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default Login
