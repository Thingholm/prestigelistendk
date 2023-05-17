import { Suspense } from "react";
import Page from "./page";
import NationsRankingLoading from "./loading";
import SectionLinkButton from "@/components/SectionLinkButton";
import { baseUrl } from "@/utils/baseUrl";

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