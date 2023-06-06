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
            <h2>Poinsystemet <SectionLinkButton link={baseUrl + "/pointsystem"} sectionName={"Pointsystemet"} /></h2>
            <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Dolor quis id pariatur enim ipsa molestiae molestias similique tempora. Officiis cum, quidem earum accusantium reprehenderit quasi libero et vitae dolorum exercitationem veniam pariatur assumenda ducimus voluptate velit a magni. Rerum, delectus?</p>
            <Page />
        </div>
    )
}