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
                    <li className="nav-item-with-dropdown">
                        <p className="dropdown-button" onClick={() => { if (showLists) { setShowLists(false) } else { setShowLists(true) } }}>Ranglister <span><IoChevronForwardOutline /></span></p>
                        <div className={showLists ? "nav-expand-list showList" : "nav-expand-list hideList"}>
                            <p onClick={() => setShowLists(false)}>Tilbage <IoChevronForwardOutline /></p>
                            <ul>
                                <li><Link href="/listen">All time</Link></li>
                                <li><Link href="/listen?activeStatus=active">Aktive</Link></li>
                                <li><Link href="/nationer">Nationer</Link></li>
                                <li><Link href="/listen?nation=Danmark">Danskere</Link></li>
                                <li><a href="/#3-aarig-rullende" onClick={() => setNavActive(false)}>Største ryttere over en 3-årig periode</a></li>
                                <li><a href="/#stoerste-per-aarti" onClick={() => setNavActive(false)}>Største pr. årti</a></li>
                                <li><a href="/#stoerste-saesoner" onClick={() => setNavActive(false)}>Største individuelle sæsoner</a></li>
                                <li><a href="/#stoerste-alltime-hvert-aar" onClick={() => setNavActive(false)}>Største all time hvert år</a></li>
                                <li><Link href="/listen?yearFilterRange=single">Største pr. årgang</Link></li>
                                <li><Link href={"/saesoner"}>Flest point hvert år</Link></li>
                                <li><Link href={"/alder"}>Største på hvert alderstrin</Link></li>
                            </ul>
                        </div>
                    </li>
                    <li><Link href={"/kalender"}>Løbskalender</Link></li>
                    <li><Link href={"/sammenlign"}>Sammenlign ryttere</Link></li>
                    <li><Link href="https://docs.google.com/spreadsheets/d/14JS3ioc3jaFTDX2wuHRniE3g3S2yyg1QkfJ7FiNgAE8/edit#gid=1348170666" target="_blank">Rådata</Link></li>
                    <li><Link href="https://docs.google.com/spreadsheets/d/14JS3ioc3jaFTDX2wuHRniE3g3S2yyg1QkfJ7FiNgAE8/edit#gid=768297916" target="_blank">Quiz</Link></li>

                </ul>
                <Link className="nav-highlighted-item" href="/listen">Se listen</Link>
            </nav>
        </header>
    )
}