import { Suspense } from "react";
import Page from "./page";
import NationsRankingLoading from "./loading";

export default function NationsRankingLayout() {
    return (
        <div className="nation-ranking-page">
            <h2>Prestigelisten for nationer</h2>

            <Suspense fallback={<NationsRankingLoading />}>
                <Page />
            </Suspense>
        </div>
    )
}