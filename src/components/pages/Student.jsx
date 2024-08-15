import { IconBook2, IconCross, IconCrossOff, IconX } from "@tabler/icons-react";
import { useEffect, useState } from "react";
import axios from "axios"
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";
import { saveAs } from 'file-saver'


export default function Student({ sidebar, mainUser }) {
    const [payBox, setPaybox] = useState(false);
    const [option, setOption] = useState("transaction");
    const [students, setStudents] = useState([])
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
    let [studentForm, setStudentForm] = useState({
        name: "",
        mobile: "",
        studentId: "",
        fatherName: "",
        address: "",
        file: "",
        course: "",
        courseFee: "",
        // date: ""
    })

    let payBoxClass = payBox ? "payment-box paybox-full" : " payment-box";
    payBoxClass = payBox && !sidebar ? "payment-box paybox-full width-on-smallSidebar" : payBoxClass;

    useEffect(() => {
        axios.get("http://localhost:3000/students/allstudents").then((data) => {
            setStudents(data.data)
        })
    }, [])
    function toDateInputValue(dateObject) {
        const local = new Date(dateObject);
        local.setMinutes(dateObject.getMinutes() - dateObject.getTimezoneOffset());
        return local.toJSON().slice(0, 10);
    };

    async function handleSubmit(e) {
        e.preventDefault()
        let empty = []
        for (let key in studentForm) {
            if (!studentForm[key]) {
                if (key == "course" || key == "file") {
                    empty.push("Choose " + key)
                }
                else {
                    empty.push("Enter " + key)
                }
            }
        }
        // console.log(empty)
        if (empty.length) {
            Swal.fire({
                title: "Oops....",
                icon: "error",
                html: empty.join("<br>").toString(),
            })
        }
        else {
            let date = toDateInputValue(new Date())
            const config = {
                headers: {
                    'content-type': 'multipart/form-data'
                }
            };
            axios.post("http://localhost:3000/students/createstudent", { ...studentForm, date: date }, config).then((data) => {
                // console.log(data)
                let modal1 = new bootstrap.Modal(document.getElementById('addStudent'));
                let back = document.querySelectorAll(".modal-backdrop.show")
                // let tbody = document.querySelector(".studentDetails")
                back.forEach((elem) => {
                    elem.classList.add("d-none")
                })
                modal1._hideModal()
                // saveAs(studentForm.file.blob(),"image")
                setStudents([...students, data.data])
                Swal.fire({
                    title: "Good Job!",
                    icon: "success",
                    html: "Student Created..",
                })
            })
        }


    }

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

                axios.post("http://localhost:3000/students/deletestudent", { id }).then((data) => {
                    // tr.classList.add("d-none")
                    let arr = students.filter((st) => {
                        return st._id != id
                    })
                    setStudents(arr)
                }).catch((err) => {
                    console.log(err)
                })
            }
        }).catch((err) => {
            console.log(err)
        })


    }
    function handleEditStudent(e) {
        console.log(e.target.getAttribute("name"))
        let id = e.target.getAttribute("name")
        axios.get(`http://localhost:3000/getstudent/${id}`).then((data) => {
            console.log(data.data)
            let student = data.data
            let { name, fatherName, mobile, file, address, course, date,courseFee } = student
            let datas = { name, fatherName, mobile, file, address, course, date,courseFee }
            setStudentForm(datas)
            let form = document.querySelector('#editStudentForm')
            console.log(form)
            for (let key in student) {
                let inputBox = document.querySelector(`#editStudentForm input[name=${key}]`)
                if (inputBox) {
                    console.log(document.querySelector(`#editStudentForm input[name=${key}]`))
                    inputBox.value = student[key]
                }
            }
            let selectCourse = document.querySelector("#inputCourse")
            console.log(selectCourse)
            for (let i = 0; i < selectCourse.options.length; i++) {
                let optioned = selectCourse.options[i]
                if (optioned.value == student.course) {
                    selectCourse.options[i].selected = true
                    break
                }
            }
            console.log(studentForm)
        })
    }
    function handleUpdateStudent(e) {
        e.preventDefault()
        console.log(e.target)
        console.log(studentForm)
        console.log(data)
    }
    return (
        <>
            <section className={sidebar ? "student" : " student section-full"}>
                <div className="section-top">
                    <h1 className="section-head">Students</h1>
                    {/* <IconBook2 /> */}
                </div>
                <div className="section-box">
                    <div className="section-btnBox">
                        <button type="button" className="main-btn" data-bs-toggle="modal" data-bs-target="#addStudent">
                            + Add Student
                        </button>
                    </div>
                    <div className="modal fade modal-xl" id="addStudent" tabIndex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
                        <div className="modal-dialog">
                            <div className="modal-content">
                                <div className="modal-header d-flex justify-content-between">
                                    <h5 className="modal-title" id="exampleModalLabel">Add Student</h5>
                                    <button data-bs-dismiss="modal" className="modal-close" aria-label="Close"><IconX /></button>
                                    {/* <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button> */}
                                </div>
                                <div className="modal-body">
                                    <form id="addStudentForm" onSubmit={handleSubmit}>
                                        <div className="container-fluid">
                                            <div className="row g-3">
                                                <div className="col-md-6">
                                                    <label htmlFor="inputEmail4" className="form-label">Student Name</label>
                                                    <input type="text" className="form-control" name="name" id="inputstudentname" placeholder="Student Name" onChange={(e) => setStudentForm({ ...studentForm, name: e.target.value })} />
                                                </div>
                                                <div className="col-6">
                                                    <label htmlFor="inputAddress" className="form-label">Mobile</label>
                                                    <input type="text" className="form-control" name="mobile" id="inputmobile" placeholder="Mobile" onChange={(e) => setStudentForm({ ...studentForm, mobile: e.target.value })} />
                                                </div>
                                                {/* <div className="col-4">
                                                    <label htmlFor="inputAddress2" className="form-label">Student ID</label>
                                                    <input type="text" className="form-control" name="id" id="inputstudentid" placeholder="Student ID" onChange={(e) => setStudentForm({ ...studentForm, studentId: e.target.value })} />
                                                </div> */}
                                                <div className="col-md-6">
                                                    <label htmlFor="inputPassword4" className="form-label">Father's Name</label>
                                                    <input type="text" className="form-control" id="inputfathername" name="fatherName" placeholder="Father's Name" onChange={(e) => setStudentForm({ ...studentForm, fatherName: e.target.value })} />
                                                </div>
                                                <div className="col-6">
                                                    <label htmlFor="inputAddress" className="form-label">Address</label>
                                                    <input type="text" className="form-control" id="inputfathernumber" name="Address" placeholder="Address" onChange={(e) => setStudentForm({ ...studentForm, address: e.target.value })} />
                                                </div>
                                                <div className="col-md-6">
                                                    <label htmlFor="inputCity" className="form-label">Picture Upload</label>
                                                    <input type="file" name="file" accept="img,jpg,png,jpeg" onChange={(event) => setStudentForm({ ...studentForm, file: event.target.files[0] })} className="form-control" />
                                                </div>
                                                <div className="col-md-4">
                                                    <label htmlFor="inputCourse" className="form-label">Course</label>
                                                    <select name="course" className="form-select" onChange={(e) => setStudentForm({ ...studentForm, course: e.target.value })}>
                                                        <option>Choose...</option>
                                                        <option>AWDP</option>
                                                        <option>Front End</option>
                                                        <option>Back End</option>
                                                    </select>
                                                </div>
                                                <div className="col-md-2">
                                                    <label htmlFor="inputZip" className="form-label" >Course Fee</label>
                                                    <input type="text" className="form-control" name="courseFee" id="inputcoursefee" placeholder="Course Fee" onChange={(e) => setStudentForm({ ...studentForm, courseFee: e.target.value })} />
                                                </div>
                                            </div>
                                            <div className="modal-footer mt-4">
                                                <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                                                <button type="submit" className="btn btn-primary">Save changes</button>
                                            </div>
                                        </div>
                                    </form>
                                </div>
                            </div>
                        </div>
                    </div>

                    <table className="table">
                        <thead >
                            <tr>
                                <th scope="col">SR No.</th>
                                <th scope="col">Student Name</th>
                                <th scope="col">Mobile</th>
                                <th scope="col">Course</th>
                                <th scope="col">Date of joining</th>
                                <th scope="col">Address</th>
                                <th scope="col">Action</th>
                            </tr>
                        </thead>
                        <tbody className="studentDetails">
                            {students.map((student, i) => {
                                return (
                                    <tr key={student._id} id={student._id}>
                                        <td scope="row">{i + 1}</td>
                                        <td>{student.name}</td>
                                        <td>{student.mobile}</td>
                                        <td>{student.course}</td>
                                        <td>{student.date}</td>
                                        <td>{student.address}</td>
                                        <td><i className="fa-solid fa-pen bg-success" name={student._id} data-bs-toggle="modal" data-bs-target="#editStudent" onClick={handleEditStudent}></i><i className="fa-solid fa-indian-rupee-sign ms-2" onClick={() => setPaybox(true)} style={{ backgroundColor: "blue" }}></i><i className={(mainUser.role == ("telecaller" || "hr")) ? "d-none" : "fa-solid fa-trash bg-danger ms-2"} name={student._id} onClick={handleDelete}></i></td>
                                    </tr>
                                )
                            })}
                        </tbody>
                    </table>
                </div>


                <div className={payBoxClass}>
                    <div className="payment-box-inner">

                        <div className="pay-head">
                            <h2 className="section-head"> <i className="fa-solid fa-arrow-left" onClick={() => setPaybox(false)}></i> Mark</h2>
                        </div>
                        <div className="payment-views">
                            <ul>
                                <li onClick={() => setOption("transaction")} className={option == "transaction" ? "option-active" : ''}><a href="#"><i className="fa-regular fa-credit-card"></i> Transaction</a></li>
                                <li onClick={() => setOption("profile")} className={option == "profile" ? "option-active" : ''}><a href="#"><i className="fa-solid fa-user"></i> Profile</a></li>
                                <li><a href="#"><i className="fa-solid fa-newspaper"></i> Ledger(Statement)</a></li>
                                <li><a href="#"> <i className="fa-solid fa-chart-simple"></i> Item Wise Report</a></li>
                            </ul>
                        </div>
                        {option == 'transaction' && <div className="payment-detail-table">
                            <table className="table">
                                <thead >
                                    <tr>
                                        <th scope="col"><div className="inner-th">Date <span><i className="fa-solid fa-angle-up"></i><i className="fa-solid fa-angle-down"></i></span></div></th>
                                        <th scope="col">Transaction Type</th>
                                        <th scope="col">Transaction Number</th>
                                        <th scope="col"><div className="inner-th">Amount <span><i className="fa-solid fa-angle-up"></i><i className="fa-solid fa-angle-down"></i></span></div></th>
                                        <th scope="col">Total Balance</th>
                                        <th scope="col">Download PDF</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr>
                                        <td scope="row">25-June-2024</td>
                                        <td>Sales Invoices</td>
                                        <td>20</td>
                                        <td>₹{25000} (₹{15000} unpaid)</td>
                                        <td>40000</td>
                                        <td>Krishna Nagar</td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>}
                        {option == "profile" && <div className="pay-profile">
                            <div className="pay-flex">
                                <div className="general-details common-details">
                                    <h2>General Details</h2>
                                    <div className="container-fluid">
                                        <div className="row gy-3">
                                            <div className="col-6">
                                                <h4>Party Name</h4>
                                                <h3>Abhishek Thakur</h3>
                                            </div>
                                            <div className="col-6">
                                                <h4>Party Type</h4>
                                                <h3>customer</h3>
                                            </div>
                                            <div className="col-6">
                                                <h4>Mobile Number</h4>
                                                <h3>8474950220</h3>
                                            </div>
                                            <div className="col-6">
                                                <h4>Party Category</h4>
                                                <h3>Students</h3>
                                            </div>
                                            <div className="col-12">
                                                <h4>Email</h4>
                                                <h3>..</h3>
                                            </div>
                                            <div className="col-12">
                                                <h4>Opening Balance</h4>
                                                <h3>₹0</h3>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="bussiness-details common-details">
                                    <h2>Business Details</h2>
                                    <div className="container-fluid">
                                        <div className="row gy-3">
                                            <div className="col-6">
                                                <h4>GSTIN</h4>
                                                <h3>-</h3>
                                            </div>
                                            <div className="col-6">
                                                <h4>Pan Number</h4>
                                                <h3>-</h3>
                                            </div>
                                            <div className="col-12">
                                                <h4>Billing Address</h4>
                                                <h3>Mathura,Mathura,Uttar pradesh, 281001</h3>
                                            </div>
                                            <div className="col-12">
                                                <h4>Shipping Address</h4>
                                                <h3>Mathura,Mathura,Uttar pradesh, 281001</h3>
                                            </div>

                                        </div>
                                    </div>
                                </div>
                                <div className="bussiness-details common-details">
                                    <h2>Credit Details</h2>
                                    <div className="container-fluid">
                                        <div className="row">
                                            <div className="col-6">
                                                <h4>Credit Period</h4>
                                                <h3>30 day</h3>
                                            </div>
                                            <div className="col-6">
                                                <h4>Credit Limit</h4>
                                                <h3>-</h3>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>}
                    </div>
                </div>
                <div className="modal fade modal-xl" id="editStudent" tabIndex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
                    <div className="modal-dialog">
                        <div className="modal-content">
                            <div className="modal-header d-flex justify-content-between">
                                <h5 className="modal-title" id="exampleModalLabel">Edit Student</h5>
                                <button data-bs-dismiss="modal" className="modal-close" aria-label="Close"><IconX /></button>
                                {/* <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button> */}
                            </div>
                            <div className="modal-body">
                                <form id="editStudentForm" onSubmit={handleUpdateStudent}>
                                    <div className="container-fluid">
                                        <div className="row g-3">
                                            <div className="col-md-6">
                                                <label htmlFor="inputEmail4" className="form-label">Student Name</label>
                                                <input type="text" className="form-control" name="name" id="inputstudentname" placeholder="Student Name" onChange={(e) => setStudentForm({ ...studentForm, name: e.target.value })} />
                                            </div>
                                            <div className="col-6">
                                                <label htmlFor="inputAddress" className="form-label">Mobile</label>
                                                <input type="text" className="form-control" name="mobile" id="inputmobile" placeholder="Mobile" onChange={(e) => setStudentForm({ ...studentForm, mobile: e.target.value })} />
                                            </div>
                                            {/* <div className="col-4">
                                                    <label htmlFor="inputAddress2" className="form-label">Student ID</label>
                                                    <input type="text" className="form-control" name="id" id="inputstudentid" placeholder="Student ID" onChange={(e) => setStudentForm({ ...studentForm, studentId: e.target.value })} />
                                                </div> */}
                                            <div className="col-md-6">
                                                <label htmlFor="inputPassword4" className="form-label">Father's Name</label>
                                                <input type="text" className="form-control" id="inputfathername" name="fatherName" placeholder="Father's Name" onChange={(e) => setStudentForm({ ...studentForm, fatherName: e.target.value })} />
                                            </div>
                                            <div className="col-6">
                                                <label htmlFor="inputAddress" className="form-label">Address</label>
                                                <input type="text" className="form-control" id="inputfathernumber" name="address" placeholder="Address" onChange={(e) => setStudentForm({ ...studentForm, address: e.target.value })} />
                                            </div>
                                            <div className="col-md-6">
                                                <label htmlFor="inputCity" className="form-label">Picture Upload</label>
                                                <input type="file" accept="img,jpg,png,jpeg" onChange={(event) => setStudentForm({ ...studentForm, file: event.target.files[0] })} className="form-control" />
                                            </div>
                                            <div className="col-md-4">
                                                <label htmlFor="inputCourse" className="form-label">Course</label>
                                                <select id="inputCourse" name="course" className="form-select" onChange={(e) => setStudentForm({ ...studentForm, course: e.target.value })}>
                                                    <option>Choose...</option>
                                                    <option>AWDP</option>
                                                    <option>Front End</option>
                                                    <option>Back End</option>
                                                </select>
                                            </div>
                                            <div className="col-md-2">
                                                <label htmlFor="inputZip" className="form-label" >Course Fee</label>
                                                <input type="text" className="form-control" name="courseFee" id="inputcoursefee" placeholder="Course Fee" onChange={(e) => setStudentForm({ ...studentForm, courseFee: e.target.value })} />
                                            </div>
                                        </div>
                                        <div className="modal-footer mt-4">
                                            <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                                            <button type="submit" className="btn btn-primary">Save changes</button>
                                        </div>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </>
    )
}