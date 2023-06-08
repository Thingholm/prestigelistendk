import Link from "next/link";
import "../style/style.css";

export default function Footer() {
    return (
        <footer>
            <div className="footer-list-container">
                <div className="footer-list-item">
                    <h4>Lister</h4>
                    <ul>
                        <li>
                            <Link href="listen">Ryttere (all time)</Link>
                        </li>
                        <li>
                            <Link href="listen?activeStatus=active">Ryttere (Aktive)</Link>
                        </li>
                        <li>
                            <Link href="nationer">Nationer</Link>
                        </li>
                        <li>
                            <Link href="/#3-aarig-rullende">3-årig rullende rangliste</Link>
                        </li>
                        <li>
                            <Link href="#stoerste-per-aarti">Største hvert årti</Link>
                        </li>
                        <li>
                            <Link href="#stoerste-saesoner">Største individuelle sæsoner</Link>
                        </li>
                    </ul>
                </div>

                <div className="footer-list-item">
                    <h4>Om Prestigelisten</h4>
                    <ul>
                        <li>
                            <Link href="/om-prestigelisten">Om listen</Link>
                        </li>
                        <li>
                            <Link href="/pointsystem">Pointsystemet</Link>
                        </li>
                    </ul>
                </div>

                <div className="footer-list-item">
                    <h4>Kontakt</h4>
                    <ul>
                        <li>
                            Mail: <Link href="mailto:prestigelisten@hotmail.dk">prestigelisten@hotmail.dk</Link>
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