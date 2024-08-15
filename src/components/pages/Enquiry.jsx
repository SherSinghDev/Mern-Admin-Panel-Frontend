import { IconBook2, IconCross, IconCrossOff, IconX } from "@tabler/icons-react";
import { useEffect, useState } from "react";
import axios from "axios"
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";
import { saveAs } from 'file-saver'


export default function Enquiry({ sidebar, mainUser }) {
    const [payBox, setPaybox] = useState(false);
    const [option, setOption] = useState("transaction");
    const [enquiry, setEnquiry] = useState([])
    const navigate = useNavigate()
    axios.defaults.withCredentials = true;
    useEffect(() => {
        axios.get("http://localhost:3000/authorized").then((data) => {
            // console.log(data.data)
            if (!data.data.valid) {
                navigate("/login")
            }
        })
    }, [])

    useEffect(() => {
        axios.get("http://localhost:3000/enquiry/allenquiry").then((data) => {
            setEnquiry(data.data)
        })
    }, [])

    function handleDelete(e) {
        Swal.fire({
            title: "Warning",
            icon: "warning",
            html: "Are you sure!",
            confirmButtonText: "Yes",
            showDenyButton: true
        }).then((response) => {
            if (response.isConfirmed) {
                let id = e.target.getAttribute("name")
                let tr = document.getElementById(`${id}`)

                axios.post("http://localhost:3000/enquiry/deleteenquiry", { id }).then((data) => {
                    // tr.classList.add("d-none")
                    let arr = enquiry.filter((en)=>{
                        return en._id!=id
                    })
                    setEnquiry(arr)
                }).catch((err) => {
                    console.log(err)
                })
            }
        }).catch((err) => {
            console.log(err)
        })
    }
    return (
        <>
            <section className={sidebar ? "student" : " student section-full"}>
                <div className="section-top">
                    <h1 className="section-head">Enquiries</h1>
                    {/* <IconBook2 /> */}
                </div>
                <div className="section-box">
                    <table className="table">
                        <thead >
                            <tr>
                                <th scope="col">SR No.</th>
                                <th scope="col">Enquiry Email</th>
                                <th scope="col">Message</th>
                                <th scope="col">Action</th>
                            </tr>
                        </thead>
                        <tbody className="studentDetails">
                            {enquiry.map((singleEnquiry, i) => {
                                return (
                                    <tr key={singleEnquiry._id} id={singleEnquiry._id}>
                                        <td scope="row">{i + 1}</td>
                                        <td>{singleEnquiry.email}</td>
                                        <td>{singleEnquiry.message}</td>
                                        <td><i className="fa-solid fa-trash bg-danger ms-2" name={singleEnquiry._id} onClick={handleDelete}></i></td>
                                    </tr>
                                )
                            })}
                        </tbody>
                    </table>
                </div>

            </section>
        </>
    )
}