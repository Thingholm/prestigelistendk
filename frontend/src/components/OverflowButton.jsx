"use client";

import { useState } from "react";

export default function OverflowButton() {
    const [className, setClassName] = useState("overflow-button");

    return (
        <button
            className={className}
            onClick={() => setClassName("overflow-button clicked")}
        >
            Se mere...
        </button>
    )
}