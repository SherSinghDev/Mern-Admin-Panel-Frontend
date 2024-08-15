import { useEffect, useState } from 'react'
import {BrowserRouter,Routes,Route} from "react-router-dom"
import './App.css'
import Sidebar from './components/Sidebar'
import Dashboard from './components/pages/Dashboard'
import ColorCustomiser from './components/ColorCusomiser'
import Topbar from './components/Topbar'
import Student from './components/pages/Student'
import Employee from './components/pages/Employee'
import Loader from './components/Loader'
import Login from './components/pages/Login'
import Enquiry from './components/pages/Enquiry'

function App() {
  const [sidebar, setSidebar] = useState(false)
  const [mainUser,setMainUser] = useState({})
  return (
    <>

    <BrowserRouter>
      <Sidebar sidebar={sidebar} mainUser={mainUser} setSidebar={setSidebar} />
      <Topbar sidebar={sidebar} />
      <ColorCustomiser />
      <Loader/>
      <Routes>
        <Route path='/' element={<Dashboard sidebar={sidebar} setMainUser={setMainUser}/>}/>
        <Route path='/employees' element={<Employee sidebar={sidebar} mainUser={mainUser}/>}/>
        <Route path='/students' element={<Student sidebar={sidebar} mainUser={mainUser}/>}/>
        <Route path='/enquiry' element={<Enquiry sidebar={sidebar} mainUser={mainUser}/>}/>
        <Route path='/login' element={<Login/>} setMainUser={setMainUser}/>
      </Routes>
      {/* <CreateParty sidebar={sidebar}/> */}
    </BrowserRouter>
    </>
  )
}

export default App
