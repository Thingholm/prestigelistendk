import SectionLinkButton from "@/components/SectionLinkButton";
import Page from "./page";
import { baseUrl } from "@/utils/baseUrl";

export const metadata = {
    title: 'Pointsystemet - Prestigelisten',
    description: 'Pointsystemet, som Prestigelisten er baseret på.',
}

export default function PointSystemLayout() {
    return (
        <div className="pointsystem-page">
            <h2>Pointsystemet <SectionLinkButton link={baseUrl + "/pointsystem"} sectionName={"Pointsystemet"} /></h2>
            <p>Pointsystemet er baseret på en subjektiv vurdering, men en gennemdiskuteret og - mener vi selv - kvalificeret en af slagsen.</p>
            <Page />
        </div>
    )
}