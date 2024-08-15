import profileImg from "../assets/images/profile2.jpg"
import { IconBook, IconBrandProducthunt, IconBriefcase, IconBucket, IconLayout2, IconLogout, IconPencilCheck, IconPhone, IconShoppingBag, IconTag, IconUserCode, IconWallet, } from '@tabler/icons-react';
import { IconArrowBarToLeft } from '@tabler/icons-react';
import axios from "axios";
import { useEffect, useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
export default function Sidebar({ sidebar, setSidebar, mainUser }) {
    // sidebar ? console.log("hello") : console.log("ji");
    let sideClass = sidebar ? "sidebar" : "sidebar sidebar-false";
    // const [mainUser, setMainUser] = useState({})
    const navigate = useNavigate()
    function handleLogout() {
        Swal.fire({
            title: "Warning",
            icon: "warning",
            html: "You want to log out?",
            confirmButtonText: "Yes",
            showDenyButton: true
        }).then((response) => {
            if (response.isConfirmed) {
                axios.post("http://localhost:3000/logout").then((data) => {
                    // console.log(data.data)
                    navigate("/login")
                })
            }
        }).catch((err) => {
            console.log(err)
        })
    }
    return (
        <>
            <div className={sideClass} onMouseOver={() => setSidebar(true)} onMouseOut={() => setSidebar(false)}>
                <div className="logo">
                    <a href="#">DemoCompany</a>
                </div>
                {/* <div className="side-toggler" onClick={() => setSidebar(!sidebar)}>
                    <IconArrowBarToLeft />
                </div> */}
                <div className="side-user">
                    <img src={profileImg} alt="" />
                    <div>
                        <h4>{mainUser.name}</h4>
                        <h5>{mainUser.role}</h5>
                    </div>
                </div>
                <div className="menu">
                    <ul className="menu-list">
                        <li>
                            <NavLink to="/"><div className="menu-icon"><IconLayout2 color="#262a2a" size={18} /></div><span>Dashboard</span></NavLink>
                        </li>
                        <li className={(mainUser.role == "telecaller") ? "d-none" : ""}>
                            <NavLink to="/employees"><div className="menu-icon"><IconBriefcase color="#262a2a" size={18} /></div><span>Employees</span></NavLink>
                        </li>
                        <li>
                            <NavLink to="/students"><div className="menu-icon"><IconBook color="#262a2a" size={18} /></div><span>Students</span></NavLink>
                        </li>
                        <li>
                            <NavLink to="/enquiry"><div className="menu-icon"><IconPhone color="#262a2a" size={18} /></div><span>Enquiries</span></NavLink>
                        </li>

                        <li className={(mainUser.role == "telecaller") ? "d-none" : ""}>
                            <NavLink to="/emp-attendance"><div className="menu-icon"><IconPencilCheck color="#262a2a" size={18} /></div><span>Employee Attendence</span></NavLink>
                        </li>
                        <li>
                            <NavLink to="/stud-attendance"><div className="menu-icon"><IconPencilCheck color="#262a2a" size={18} /></div><span>Students Attendence</span></NavLink>
                        </li>
                        <li>
                            <NavLink onClick={handleLogout}><div className="menu-icon"><IconLogout color="#262a2a" size={18} /></div><span>Logout</span></NavLink>
                        </li>


                        {/* <li>
                            <a data-bs-target="#side" data-bs-toggle="collapse" href="#"><div className="menu-icon"><IconLayout2/></div>Leads</a>
                            <ul id="side">
                                <li>
                                    <a href="facebook.html">
                                        <span>Facebook Leads</span>
                                    </a>
                                </li>
                                <li>
                                    <a href="website.html">
                                        <span>Website Leads</span>
                                    </a>
                                </li>

                            </ul>
                        </li> */}


                        {/* <li><a href="#"><div className="menu-icon"><i className="ti ti-layout-2"></i></div> Dashboard</a></li>
                    <li><a href="#">Calender</a></li>
                    <li><a href="#">Notes</a></li>
                    <li><a href="#">To Do</a></li> */}
                    </ul>
                </div>

            </div>
        </>
    )
}