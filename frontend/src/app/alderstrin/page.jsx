"use client"

import SectionLinkButton from "@/components/SectionLinkButton"
import { baseUrl } from "@/utils/baseUrl"
import AgeRanking from "./AgeRanking"
import AgeSelect from "./AgeSelect"

export default function AgePage() {
    return (
        <div className="age-page">
            <h2>Flest point optjent på hvert alderstrin <SectionLinkButton link={baseUrl + "/alderstrin"} sectionName={"Flest point optjent på hvert alderstrin"} /></h2>
            <AgeSelect />
            <AgeRanking />
        </div>
    )
}