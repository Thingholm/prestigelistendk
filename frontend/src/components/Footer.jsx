import Link from "next/link";
import "../style/style.css";

export default function Footer() {
    return (
        <footer>
            <div className="footer-list-container">
                <div className="footer-list-item">
                    <h4>Lister</h4>
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
                        <li><Link href="/saesoner">Største hvert år</Link></li>
                    </ul>
                </div>

                <div className="footer-list-item">
                    <h4>Om Prestigelisten</h4>
                    <ul>
                        <li>
                            <Link href="/om-prestigelisten">Om Prestigelisten</Link>
                        </li>
                        <li>
                            <Link href="/pointsystem">Pointsystemet</Link>
                        </li>
                        <li>
                            <Link href="/kalender">Løbskalender</Link>
                        </li>
                        <li>
                            <Link href="/sammenlign">Sammenlign ryttere</Link>
                        </li>
                    </ul>
                </div>

                <div className="footer-list-item">
                    <h4>Kontakt</h4>
                    <ul>
                        <li>
                            Mail: <Link href="mailto:prestigelisten@hotmail.com">prestigelisten@hotmail.com</Link>
                        </li>
                    </ul>
                </div>
            </div>
            <div className="footer-bottom-section">
                <p>Hjemmesiden er designet og udviklet af Rasmus Thingholm</p>
            </div>
        </footer>
    )
}