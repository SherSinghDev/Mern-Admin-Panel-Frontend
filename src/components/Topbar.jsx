import { IconBell, IconMessage, IconSearch } from "@tabler/icons-react";

export default function Topbar({sidebar}){
    let topClass = sidebar?"topbar":"topbar topbar-full"
    return(
        <>
        <header className={topClass}>
            <form className="top-searchBox">
                <input type="text" name="" id="" placeholder="Search"/>
                <button><IconSearch size={18}/></button>
            </form>
            <div className="top-menu">
                <span><IconMessage/></span>
                <span><IconBell/></span>
            </div>
        </header>
        </>
    )
}