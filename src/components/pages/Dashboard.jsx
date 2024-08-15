import axios from "axios"
import { useEffect } from "react"
import { useNavigate } from "react-router-dom"

export default function Dashboard({ sidebar,setMainUser }) {
    let sectionClass = sidebar ? "dashboard" : " dashboard section-full"
    axios.defaults.withCredentials = true
    const navigate = useNavigate()
    useEffect(() => {
        axios.get("http://localhost:3000/authorized").then((data) => {
            // console.log(data.data)
            if(!data.data.valid){
                navigate("/login")
            }
            else{
                let user = data.data.user
                setMainUser({...user,role:user.role.toLowerCase()})
            }
        })
    },[])
    return (
        <>
            <section className={sectionClass}>
                <h1>The Dashboard</h1>
            </section>
        </>
    )
}