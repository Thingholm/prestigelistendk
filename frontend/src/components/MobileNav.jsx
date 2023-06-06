"use client";

import Link from "next/link"
import '../style/style.css'
import { IoChevronBackOutline, IoChevronDownOutline, IoChevronForwardOutline, IoMenuOutline, IoReorderTwo } from "react-icons/io5"
import NavSearch from "./NavSearch"
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";

export default function MobileNavbar() {
    const [navActive, setNavActive] = useState(false);
    const [showLists, setShowLists] = useState(false);
    const pathName = usePathname();

    useEffect(() => {
        setNavActive(false);
        setShowLists(false);
    }, [pathName]);

    return (
        <header className="mobile-header">
            <h1><Link href="/">Prestigelisten</Link></h1>
            <div className={navActive ? "menu-icon-container show" : "menu-icon-container hide"} onClick={() => { if (navActive) { setNavActive(false) } else { setNavActive(true) } }}>
            </div>
            <nav className={navActive ? "show" : "hide"}>
                <span className={navActive ? "show nav-bg" : "hide nav-bg"} onClick={() => setNavActive(false)}></span>

                <div className={showLists ? "nav-search hide" : "nav-search show"}>
                    <NavSearch />
                </div>

                <ul>
                    <li><Link href="/om-prestigelisten">Om listen</Link></li>
                    <li><Link href="/pointsystem">Pointsystem</Link></li>
                    <li><Link href="https://docs.google.com/spreadsheets/d/14JS3ioc3jaFTDX2wuHRniE3g3S2yyg1QkfJ7FiNgAE8/edit#gid=768297916">Quiz</Link></li>
                    <li className="nav-item-with-dropdown">
                        <p className="dropdown-button" onClick={() => { if (showLists) { setShowLists(false) } else { setShowLists(true) } }}>Ranglister <span><IoChevronForwardOutline /></span></p>
                        <div className={showLists ? "nav-expand-list showList" : "nav-expand-list hideList"}>
                            <p onClick={() => setShowLists(false)}>Tilbage <IoChevronForwardOutline /></p>
                            <ul>
                                <li><Link href="/listen">All time</Link></li>
                                <li><Link href="/listen?activeStatus=active">Aktive ryttere</Link></li>
                                <li><Link href="/nationer">Nationer</Link></li>
                                <li><Link href="/listen?nation=Danmark">Største danskere</Link></li>
                                <li><a href="/#3-aarig-rullende">3-årig rullende rangliste</a></li>
                                <li><a href="/#stoerste-per-aarti">Største per årti</a></li>
                                <li><a href="/#stoerste-saesoner">Største individuelle sæsoner</a></li>
                                <li><Link href="/listen?yearFilterRange=single">Største per årgang</Link></li>
                            </ul>
                        </div>
                    </li>
                </ul>
                <Link className="nav-highlighted-item" href="/listen">Se listen</Link>
            </nav>
        </header>
    )
}