import { useState } from "react"

export default function ColorCustomiser() {
    const [colorBox, setColorBox] = useState(false)
    let customClass = colorBox ? "customiser cutomiser-out" : "customiser";
    function toLightMode() {
        document.querySelector("body").classList.remove("dark")
    }
    function toDarkMode() {
        document.querySelector("body").classList.add("dark")
    }
    function changeTheme(color){
        document.documentElement.style.setProperty("--theme-color",color)
        setColorBox(false)
    }
    return (
        <>
            <div className="color-toggler" onClick={() => setColorBox(!colorBox)}>
                <i className="fa-solid fa-gear"></i>
            </div>
            <div className={customClass}>
                <h2 className="color-head">Theme Customiser</h2>
                <div className="color-close" onClick={()=>setColorBox(false)}>
                    <i className="fa-solid fa-xmark"></i>
                </div>
                <div className="color-layout" onClick={() => setColorBox(!colorBox)}>
                    <div className="mode-change" >
                        <div className="mode-color light-mode" onClick={toLightMode}><span></span>Light Mode</div>
                        <div className="mode-color dark-mode" onClick={toDarkMode}><span></span>Dark Mode</div>
                    </div>
                    <h4 className="color-head">Theme Colors</h4>
                    <div className="color-box">
                        <div className="color color1" onClick={()=>changeTheme("crimson")}></div>
                        <div className="color color2" onClick={()=>changeTheme("aqua")}></div>
                        <div className="color color3" onClick={()=>changeTheme("greenyellow")}></div>
                        <div className="color color4" onClick={()=>changeTheme("orange")}></div>
                        <div className="color color5" onClick={()=>changeTheme("hotpink")}></div>
                        <div className="color color6" onClick={()=>changeTheme("lightseagreen")}></div>
                        <div className="color color7" onClick={()=>changeTheme("yellow")}></div>
                        <div className="color color8" onClick={()=>changeTheme("orange")}></div>
                    </div>
                </div>
            </div>
        </>
    )
}