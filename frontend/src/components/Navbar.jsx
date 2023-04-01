import Link from "next/link"
import '../style/style.css'

export default function Navbar() {
    return (
        <header>
            <h1><Link href="#">Prestigelisten</Link></h1>
            <nav>
                <ul>
                    <li><Link href="#">Om listen</Link></li>
                    <li><Link href="#">Pointsystem</Link></li>
                    <li><Link href="#">Quiz</Link></li>
                    <li className="nav-item-with-dropdown">
                        <Link href="#">Ranglister</Link>
                        <div className="nav-dropdown-menu">
                            <ul>
                                <li><Link href="#">All time</Link></li>
                                <li><Link href="#">Aktive ryttere</Link></li>
                                <li><Link href="#">Nationer</Link></li>
                                <li><Link href="#">Største danskere</Link></li>
                                <li><Link href="#">3-årig rullende rangliste</Link></li>
                                <li><Link href="#">All time hvert år</Link></li>
                                <li><Link href="#">Største per årti</Link></li>
                                <li><Link href="#">Største individuelle sæsoner</Link></li>
                                <li><Link href="#">Største per årgang</Link></li>
                            </ul>
                        </div>
                    </li>
                </ul>
            </nav>
        </header>
    )
}