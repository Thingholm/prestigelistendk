import Page from "./page";
import { Suspense } from "react";
import Loading from "./loading";
import { stringDecoder } from "@/components/stringHandler";

export async function generateMetadata({ params }) {
    return {
        title: stringDecoder(params.fullName) + " - Prestigelisten",
        description: "Cykelrytteren " + stringDecoder(params.fullName) + ", hans placering på Prestigelisten over største cykelryttere nogensinde og en liste over hans resultater og udvikling i karrieren",
    }
}

export default function RiderLayout({ params }) {
    return (
        <div className="">
            <Suspense fallback={<Loading riderName={params.fullName} />}>
                <Page fullName={params.fullName} />
            </Suspense>
        </div>
    )
}

