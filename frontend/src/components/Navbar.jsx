import { useEffect, useState } from "react";
import "../assets/style/style.css";

function Navbar() {
    return (
        <header>
            <nav>
                <ul>
                    <a href="#"><li>Rangliste</li></a>
                    <a href="#"><li>Pointsystemet</li></a>
                </ul>
            </nav>
            <a href="#"><h1>Prestigelisten</h1></a>
            <nav>
                <ul>
                    <a href="#"><li>Om Prestigelisten</li></a>
                    <a href="#"><li>Quiz</li></a>
                </ul>
            </nav>
        </header>
    )
}

export default Navbar;