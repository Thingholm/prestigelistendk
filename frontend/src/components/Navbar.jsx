import Link from "next/link"
import '../style/style.css'
import { IoChevronDownOutline } from "react-icons/io5"
import NavSearch from "./NavSearch"

export default function Navbar() {
    return (
        <header>
            <h1><Link href="/">Prestigelisten</Link></h1>
            <nav>
                <ul>
                    <li><Link href="/om-prestigelisten">Om listen</Link></li>
                    <li><Link href="/pointsystem">Pointsystem</Link></li>
                    <li><Link href="https://docs.google.com/spreadsheets/d/14JS3ioc3jaFTDX2wuHRniE3g3S2yyg1QkfJ7FiNgAE8/edit#gid=768297916">Quiz</Link></li>
                    <li className="nav-item-with-dropdown">
                        <Link href="/listen" className="dropdown-button">Ranglister <span><IoChevronDownOutline className="down-icon" /></span></Link>
                        <div className="nav-dropdown-menu">
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
            </nav>
            <div className="nav-right-container">
                <NavSearch />
                <Link className="nav-highlighted-item" href="/listen">Se listen</Link>
            </div>
        </header>
    )
}