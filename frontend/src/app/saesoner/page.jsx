"use client"

import SectionLinkButton from "@/components/SectionLinkButton"
import SeasonSection from "./SeasonSection"
import SeasonSelect from "./SeasonSelect"
import { baseUrl } from "@/utils/baseUrl"

export default function SeasonsPage() {
    return (
        <div className="seasons-page">
            <h2>Flest point optjent hvert år <SectionLinkButton link={baseUrl + "/saesoner"} sectionName={"Flest point optjent hvert år"} /></h2>
            <SeasonSelect />
            <SeasonSection />
        </div>
    )
}