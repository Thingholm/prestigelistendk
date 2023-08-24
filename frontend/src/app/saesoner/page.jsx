"use client"

import SeasonSection from "./SeasonSection"
import SeasonSelect from "./SeasonSelect"

export default function SeasonsPage() {
    return (
        <div className="seasons-page">
            <h2>Flest point optjent hvert år</h2>
            <SeasonSelect />
            <SeasonSection />
        </div>
    )
}