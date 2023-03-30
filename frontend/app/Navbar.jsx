const { default: Link } = require("next/link");

function Navbar() {
    return (
        <header>
            <h1><Link href="/">Prestigelisten</Link></h1>
            <ul>
                <li>
                    <Link href="#">Om Prestigelisten</Link>
                </li>
                <li>
                    <Link href="#">Pointsystemet</Link>
                </li>
                <li>
                    <Link href="#">Ranglister</Link>
                </li>
            </ul>
        </header>
    )
}

export default Navbar;