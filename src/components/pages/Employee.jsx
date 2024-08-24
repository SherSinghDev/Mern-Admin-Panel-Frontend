import { IconBook2, IconCross, IconCrossOff, IconX } from "@tabler/icons-react";
import axios from "axios";
import { useEffect, useState } from "react";
import withReactContent from "sweetalert2-react-content"
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";

export default function Employee({ sidebar, setMainUser }) {
  const mySwal = withReactContent(Swal)
  let [employees, setEmployees] = useState([])
  let [updateId, setUpdateId] = useState(0)
  const navigate = useNavigate()
  let [employeeForm, setEmployeeForm] = useState({
    name: "",
    mobile: "",
    fatherName: "",
    education: "",
    address: "",
    file: "",
    email: "",
    role: "",
    department: "",
    password: ""
  })
  axios.defaults.withCredentials = true
  useEffect(() => {
    axios.get("http://localhost:3000/authorized").then((data) => {
      // console.log(data.data)
      if (!data.data.valid) {
        navigate("/login")
      }
      else {
        let user = data.data.user
        setMainUser({ ...user, role: user.role.toLowerCase() })
      }
    })
  }, [])
  useEffect(() => {
    axios.get("http://localhost:3000/employees/allemployees").then((data) => {
      setEmployees(data.data)
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
    for (let key in employeeForm) {
      if (!employeeForm[key]) {
        if (key == "role" || key == "department" || key == "file") {
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

      axios.post("http://localhost:3000/employees/createemployees", { ...employeeForm, date: date }, config).then((data) => {
        let modal1 = new bootstrap.Modal(document.getElementById('addEmployee'));
        let back = document.querySelectorAll(".modal-backdrop.show")
        back.forEach((elem) => {
          elem.classList.add("d-none")
        })
        modal1._hideModal()
        setEmployees([...employees, data.data])
        Swal.fire({
          title: "Good Job!",
          icon: "success",
          html: "Employee Created..",
        })
      })
    }
  }

  function handleDelete(e) {
    // let confirmed = confirm("Are you Sure?..")
    Swal.fire({
      title: "Warning",
      icon: "warning",
      html: "Are you sure!",
      confirmButtonText: "Yes",
      showDenyButton: true
    }).then((response) => {
      // console.log(response)
      if (response.isConfirmed) {
        // console.log(e.target.getAttribute("name"))
        let id = e.target.getAttribute("name")
        let tr = document.getElementById(`${id}`)
        // console.log(tr, id)

        axios.post("http://localhost:3000/employees/deleteemployee", { id }).then((data) => {
          // console.log(data.data)
          // tr.classList.add("d-none")
          let arr = employees.filter((em) => {
            return em._id != id
          })
          setEmployees(arr)
        }).catch((err) => {
          console.log(err)
        })
      }
    }).catch((err) => {
      console.log(err)
    })

  }


  function handleEditEmployee(e) {
    // console.log(e.target.getAttribute("name"))
    let id = e.target.getAttribute("name")
    setUpdateId(id)
    axios.get(`http://localhost:3000/getemployee/${id}`).then((data) => {
      // console.log(data.data)
      let employee = data.data
      console.log(employee)
      let { name, mobile, fatherName, education, address, email, role, department } = employee
      let datas = { name, mobile, fatherName, education, address, email, role, department }
      setEmployeeForm({ ...datas, file: "" })
      // console.log(datas)
      // let form = document.querySelector('#editStudentForm')
      // console.log(form)
      for (let key in employee) {
        let inputBox = document.querySelector(`#editEmployeeForm input[name=${key}]`)
        if (inputBox) {
          // console.log(document.querySelector(`#editStudentForm input[name=${key}]`))
          inputBox.value = employee[key]
        }
      }

      let selectRole = document.querySelector("#editRole")
      for (let i = 0; i < selectRole.options.length; i++) {
        let optioned = selectRole.options[i]
        if (optioned.value == employee.role) {
          selectRole.options[i].selected = true
          break
        }
      }
      let selectDepartment = document.querySelector("#editDepartment")
      for (let i = 0; i < selectDepartment.options.length; i++) {
        let optioned = selectDepartment.options[i]
        if (optioned.value == employee.department) {
          selectDepartment.options[i].selected = true
          break
        }
      }
    })
  }
  function handleUpdateEmployee(e) {
    e.preventDefault()
    console.log(updateId)
    // console.log(e.target)
    // console.log(studentForm)
    // console.log(data)
    const config = {
      headers: {
        'content-type': 'multipart/form-data'
      }
    };
    axios.put(`http://localhost:3000/employees/updateemployee/${updateId}`, employeeForm, config).then((data) => {
      // console.log(data.data)
      // let prevEmployees = employees.filter((employee)=>employee._id!=data.data._id)
      // setEmployees([...prevEmployees,data.data])
      let allemployees = employees.map((employee => {
        if (employee._id == data.data._id) {
          return data.data
        }
        else {
          return employee
        }
      }))
      setEmployees(allemployees)
      let modal1 = new bootstrap.Modal(document.getElementById('editEmployee'));
      let back = document.querySelectorAll(".modal-backdrop.show")
      back.forEach((elem) => {
        elem.classList.add("d-none")
      })
      modal1._hideModal()
      Swal.fire({
        title: "Good Job!",
        icon: "success",
        html: "Employee Details Updated..",
        timer: 1000,
      })
    })
    setEmployeeForm(employeeForm => {
      return {
        name: "",
        mobile: "",
        fatherName: "",
        education: "",
        address: "",
        file: "",
        email: "",
        role: "",
        department: "",
        password: ""
      }
    })
  }

  function setToEmpty() {
    setEmployeeForm(employeeForm => {
      return {
        name: "",
        mobile: "",
        fatherName: "",
        education: "",
        address: "",
        file: "",
        email: "",
        role: "",
        department: "",
        password: ""
      }
    })
  }
  return (
    <>
      <section className={sidebar ? "employee" : " employee section-full"}>
        <div className="section-top">
          <h1 className="section-head">Employees</h1>
          {/* <IconBook2 /> */}
        </div>
        <div className="section-box">
          <div className="section-btnBox">
            <button type="button" className="main-btn" data-bs-toggle="modal" data-bs-target="#addEmployee">
              + Add Employees
            </button>
          </div>
          <table className="table employee_table">
            <thead>
              <tr>
                <th scope="col">SR No.</th>
                <th scope="col">Name</th>
                <th scope="col">Role</th>
                <th scope="col">Branch</th>
                <th scope="col">Department</th>
                <th scope="col">Mobile No.</th>
                <th scope="col">Date Of Joining</th>
                <th scope="col">Address</th>
                <th scope="col">Action</th>
              </tr>
            </thead>
            <tbody>
              {employees.map((employee, i) => {
                return (
                  <tr key={employee._id} id={employee._id}>
                    <td scope="row">{i + 1}</td>
                    <td>{employee.name}</td>
                    <td>{employee.role}</td>
                    <td>{employee.branch}</td>
                    <td>{employee.department}</td>
                    <td>{employee.mobile}</td>
                    <td>{employee.date}</td>
                    <td>{employee.address}</td>
                    <td><i className="fa-solid fa-pen bg-success" name={employee._id} data-bs-toggle="modal" data-bs-target="#editEmployee" onClick={handleEditEmployee}></i><i className="fa-solid fa-trash bg-danger ms-2" name={employee._id} onClick={handleDelete}></i></td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
        <div className="modal fade modal-xl" id="addEmployee" tabIndex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-content">
                <div className="modal-header d-flex justify-content-between">
                  <h1 className="modal-title fs-5" id="staticBackdropLabel">Employee Details</h1>
                  <button data-bs-dismiss="modal" className="modal-close" aria-label="Close"><IconX onClick={setToEmpty} /></button>
                  {/* <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button> */}
                </div>
                <div className="modal-body">
                  <form onSubmit={handleSubmit}>
                    <div className="container-fluid">
                      <div className="row g-3">
                        <div className="col-lg-4">
                          <label htmlFor="">Name</label>
                          <input type="text" className="form-control" placeholder="Enter Name" name="name" onChange={(e) => setEmployeeForm({ ...employeeForm, name: e.target.value })} />
                        </div>
                        <div className="col-lg-4">
                          <label htmlFor="">Father's Name</label>
                          <input type="text" className="form-control" placeholder="Enter Father's Name"
                            name="name" onChange={(e) => setEmployeeForm({ ...employeeForm, fatherName: e.target.value })} />
                        </div>
                        <div className="col-lg-4">
                          <label htmlFor="">Mobile</label>
                          <input type="number" className="form-control" placeholder="Enter Mobile No.1"
                            name="name" onChange={(e) => setEmployeeForm({ ...employeeForm, mobile: e.target.value })} />
                        </div>
                        <div className="col-md-6">
                          <label htmlFor="inputCity" className="form-label m-0">Picture Upload</label>
                          <input type="file" name="image" accept="img,jpg,png,jpeg" onChange={(event) => setEmployeeForm({ ...employeeForm, file: event.target.files[0] })} className="form-control" />
                        </div>
                        <div className="col-lg-6">
                          <label htmlFor="">Degree/Diploma</label>
                          <input type="text" className="form-control m-0" name="Degree/Diploma" placeholder="Degree" onChange={(e) => setEmployeeForm({ ...employeeForm, education: e.target.value })} />
                        </div>

                        <div className="col-lg-6">
                          <label htmlFor="">Address</label>
                          <input type="text" className="form-control" placeholder="Enter Address" name="State" onChange={(e) => setEmployeeForm({ ...employeeForm, address: e.target.value })} />
                        </div>
                        <div className="col-lg-6">
                          <label htmlFor="">Email</label>
                          <input type="Email" className="form-control" placeholder="Enter Email" name="Email" onChange={(e) => setEmployeeForm({ ...employeeForm, email: e.target.value })} />
                        </div>
                        <div className="col-lg-4">
                          <label htmlFor="">Password</label>
                          <input type="text" className="form-control" placeholder="Enter Password" name="password" onChange={(e) => setEmployeeForm({ ...employeeForm, password: e.target.value })} />
                        </div>
                        <div className="col-md-4">
                          <label htmlFor="inputCourse" className="form-label m-0">Role</label>
                          <select id="inputCourse" className="form-select" onChange={(e) => setEmployeeForm({ ...employeeForm, role: e.target.value })}>
                            <option>Choose...</option>
                            <option>Admin</option>
                            <option>Manager</option>
                            <option>HR</option>
                            <option>TeleCaller</option>
                          </select>
                        </div>
                        <div className="col-md-4">
                          <label htmlFor="inputCourses" className="form-label m-0">Department</label>
                          <select id="inputCourse" className="form-select" onChange={(e) => setEmployeeForm({ ...employeeForm, department: e.target.value })}>
                            <option>Choose...</option>
                            <option>HR</option>
                            <option>Management</option>
                            <option>Development</option>
                          </select>
                        </div>
                        <div className="text-center pt-3">
                          <button className="btn bg-primary text-light me-3 add_employee_btn" type="submit"> submit</button>
                          <button className="btn bg-secondary text-light add_employee_btn modal-close" type="button" data-bs-dismiss="modal" aria-label="Close">Close</button>
                        </div>
                      </div>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </div>



        {/* Edit Modal */}
        <div className="modal fade modal-xl" id="editEmployee" tabIndex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-content">
                <div className="modal-header d-flex justify-content-between">
                  <h1 className="modal-title fs-5" id="staticBackdropLabel">Employee Details</h1>
                  <button data-bs-dismiss="modal" className="modal-close" aria-label="Close" onClick={setToEmpty}><IconX /></button>
                  {/* <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button> */}
                </div>
                <div className="modal-body">
                  <form id="editEmployeeForm" onSubmit={handleUpdateEmployee}>
                    <div className="container-fluid">
                      <div className="row g-3">
                        <div className="col-lg-4">
                          <label htmlFor="">Name</label>
                          <input type="text" className="form-control" placeholder="Enter Name" name="name" onChange={(e) => setEmployeeForm({ ...employeeForm, name: e.target.value })} />
                        </div>
                        <div className="col-lg-4">
                          <label htmlFor="">Father's Name</label>
                          <input type="text" className="form-control" placeholder="Enter Father's Name"
                            name="fatherName" onChange={(e) => setEmployeeForm({ ...employeeForm, fatherName: e.target.value })} />
                        </div>
                        <div className="col-lg-4">
                          <label htmlFor="">Mobile</label>
                          <input type="number" className="form-control" placeholder="Enter Mobile No.1"
                            name="mobile" onChange={(e) => setEmployeeForm({ ...employeeForm, mobile: e.target.value })} />
                        </div>
                        <div className="col-md-6">
                          <label htmlFor="inputCity" className="form-label m-0">Picture Upload</label>
                          <input type="file" name="image" accept="img,jpg,png,jpeg" onChange={(event) => setEmployeeForm({ ...employeeForm, file: event.target.files[0] })} className="form-control" />
                        </div>
                        <div className="col-lg-6">
                          <label htmlFor="">Degree/Diploma</label>
                          <input type="text" className="form-control m-0" name="education" placeholder="Degree" onChange={(e) => setEmployeeForm({ ...employeeForm, education: e.target.value })} />
                        </div>

                        <div className="col-lg-6">
                          <label htmlFor="">Address</label>
                          <input type="text" className="form-control" placeholder="Enter Address" name="address" onChange={(e) => setEmployeeForm({ ...employeeForm, address: e.target.value })} />
                        </div>
                        <div className="col-lg-6">
                          <label htmlFor="">Email</label>
                          <input type="Email" className="form-control" placeholder="Enter Email" name="email" onChange={(e) => setEmployeeForm({ ...employeeForm, email: e.target.value })} />
                        </div>
                        <div className="col-lg-4">
                          <label htmlFor="">Password</label>
                          <input type="text" className="form-control" placeholder="Update Password" onChange={(e) => setEmployeeForm({ ...employeeForm, password: e.target.value })} />
                        </div>
                        <div className="col-md-4">
                          <label htmlFor="inputCourse" className="form-label m-0">Role</label>
                          <select id="editRole" className="form-select" onChange={(e) => setEmployeeForm({ ...employeeForm, role: e.target.value })}>
                            <option>Choose...</option>
                            <option>Admin</option>
                            <option>Manager</option>
                            <option>HR</option>
                            <option>TeleCaller</option>
                          </select>
                        </div>
                        <div className="col-md-4">
                          <label htmlFor="inputCourses" className="form-label m-0">Department</label>
                          <select id="editDepartment" className="form-select" onChange={(e) => setEmployeeForm({ ...employeeForm, department: e.target.value })}>
                            <option>Choose...</option>
                            <option>HR</option>
                            <option>Management</option>
                            <option>Development</option>
                          </select>
                        </div>
                        <div className="text-center pt-3">
                          <button className="btn bg-primary text-light me-3 add_employee_btn" type="submit"> submit</button>
                          <button className="btn bg-secondary text-light add_employee_btn modal-close" type="button" data-bs-dismiss="modal" aria-label="Close">Close</button>
                        </div>
                      </div>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}