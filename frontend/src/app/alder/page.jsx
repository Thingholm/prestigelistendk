"use client"

import SectionLinkButton from "@/components/SectionLinkButton"
import { baseUrl } from "@/utils/baseUrl"
import AgeRanking from "./AgeRanking"
import AgeSelect from "./AgeSelect"

export default function AgePage() {
    return (
        <div className="age-page">
            <h2>Største ryttere på sit alderstrin gennem tiden <SectionLinkButton link={baseUrl + "/alderstrin"} sectionName={"Største ryttere på sit alderstrin gennem tiden"} /></h2>
            <AgeSelect />
            <AgeRanking />
        </div>
    )
}