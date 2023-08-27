import Link from "next/link"
import '../style/style.css'
import { IoChevronDownOutline } from "react-icons/io5"
import NavSearch from "./NavSearch"

export default function Navbar() {
    return (
        <header className="non-mobile-header">
            <h1><Link href="/">Prestigelisten</Link></h1>
            <nav>
                <ul>
                    <li><Link href="/om-prestigelisten">Om Prestigelisten</Link></li>
                    <li><Link href="/pointsystem">Pointsystem</Link></li>
                    <li className="nav-item-with-dropdown">
                        <p className="dropdown-button">Ranglister <span><IoChevronDownOutline className="down-icon" /></span></p>
                        <div className="nav-dropdown-menu">
                            <ul>
                                <li><Link href="/listen">All time</Link></li>
                                <li><Link href="/listen?activeStatus=active">Aktive</Link></li>
                                <li><Link href="/nationer">Nationer</Link></li>
                                <li><Link href="/listen?nation=Danmark">Danskere</Link></li>
                                <li><a href="/#3-aarig-rullende">Største ryttere over en 3-årig periode</a></li>
                                <li><a href="/#stoerste-per-aarti">Største pr. årti</a></li>
                                <li><a href="/#stoerste-saesoner">Største individuelle sæsoner</a></li>
                                <li><a href="/#stoerste-alltime-hvert-aar">Største all time hvert år</a></li>
                                <li><Link href="/listen?yearFilterRange=single">Største pr. årgang</Link></li>
                                <li><Link href={"/saesoner"}>Flest point hvert år</Link></li>
                            </ul>
                        </div>
                    </li>
                    <li className="nav-item-with-dropdown">
                        <p className="dropdown-button">Mere <span><IoChevronDownOutline className="down-icon" /></span></p>
                        <div className="nav-dropdown-menu">
                            <ul>
                                <li><Link href="https://docs.google.com/spreadsheets/d/14JS3ioc3jaFTDX2wuHRniE3g3S2yyg1QkfJ7FiNgAE8/edit#gid=1348170666" target="_blank">Rådata</Link></li>
                                <li><Link href="https://docs.google.com/spreadsheets/d/14JS3ioc3jaFTDX2wuHRniE3g3S2yyg1QkfJ7FiNgAE8/edit#gid=768297916" target="_blank">Quiz</Link></li>
                                <li><Link href={"/kalender"}>Løbskalender</Link></li>
                                <li><Link href={"/sammenlign"}>Sammenlign ryttere</Link></li>
                            </ul>
                        </div>
                    </li>

                </ul>
            </nav>
            <div className="nav-right-container">
                <NavSearch />
                <Link className="nav-highlighted-item" href="/listen">Se listen</Link>
            </div>
        </header>
    )
}