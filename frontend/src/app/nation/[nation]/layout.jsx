import { Suspense } from "react";
import Page from "./page";
import NationLoading from "./loading";
import { stringDecoder } from "@/components/stringHandler";

export async function generateMetadata({ params }) {
    return {
        title: stringDecoder(params.nation) + " - Prestigelisten",
        description: "De største cykelryttere fra " + stringDecoder(params.nation) + ", nationens præstation som cykelnation i forhold til øvrige nationer.",
    }
}

export default function NationLayout({ params }) {
    return (
        <div>
            <Suspense fallback={<NationLoading nation={params.nation} />}>
                <Page nation={params.nation} />
            </Suspense>
        </div>
    )
}