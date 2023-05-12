import { Suspense } from "react";
import Page from "./page";
import NationLoading from "./loading";

export default function NationLayout({ params }) {
    return (
        <div>
            <Suspense fallback={<NationLoading nation={params.nation} />}>
                <Page nation={params.nation} />
            </Suspense>
        </div>
    )
}