import { Suspense } from "react";
import Page from "./page";
import NationsRankingLoading from "./loading";
import SectionLinkButton from "@/components/SectionLinkButton";
import { baseUrl } from "@/utils/baseUrl";

export const metadata = {
    title: 'De største cykelnationer - Prestigelisten',
    description: 'En opgørelse over de største nationer i cykelsporten, de største 3 cykelryttere fra hver nation, antal ryttere, point per rytter og nationens udvikling som cykelnation',
}

export default function NationsRankingLayout() {
    return (
        <div className="nation-ranking-page">
            <h2>Prestigelisten for nationer <SectionLinkButton link={baseUrl + "/nationer"} sectionName={"Prestigelisten for nationer"} /></h2>

            <Suspense fallback={<NationsRankingLoading />}>
                <Page />
            </Suspense>
        </div>
    )
}