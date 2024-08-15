import { useEffect, useState } from "react"

export default function Loader() {
    // let loaderClass = "leader-container"
    // const [loader, setLoader] = useState("leader-container")
    // setTimeout(() => {
    //     // document.querySelector("loader-container").classList.add("d-none")
    //     // loaderClass = "loader-container d-none"
    //     setLoader("loader-container d-none")
    //     console.log("Hello")
    // }, 2000)

    setTimeout(() => {
        document.querySelector(".loader-container").classList.add("d-none")
    }, 1000);
    return (
        <>
            <div className="loader-container">
                <span className="loader"></span>
            </div>
        </>
    )
}