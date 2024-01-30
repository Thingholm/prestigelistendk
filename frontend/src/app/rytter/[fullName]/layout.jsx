import Page from "./page";
import { Suspense } from "react";
import Loading from "./loading";
import { stringDecoder } from "@/components/stringHandler";

export async function generateMetadata({ params }) {
    params = { fullName: params.fullName.replace("%C3%BC", "ü") }
    return {
        title: stringDecoder(params.fullName) + " - Prestigelisten",
        description: "Cykelrytteren " + stringDecoder(params.fullName) + ", hans placering på Prestigelisten over største cykelryttere nogensinde og en liste over hans resultater og udvikling i karrieren",
        openGraph: {
            images: ["https://fyoonxbvccocgqkxnjqs.supabase.co/storage/v1/object/public/twitterPics/" + params.fullName + ".png"]
        },
        twitter: {
            images: ["https://fyoonxbvccocgqkxnjqs.supabase.co/storage/v1/object/public/twitterPics/" + params.fullName + ".png"]
        }
    }
}

export default function RiderLayout({ params }) {
    params = { fullName: params.fullName.replace("%C3%BC", "ü") }

    return (
        <div className="">
            <Suspense fallback={<Loading riderName={params.fullName} />}>
                <Page fullName={params.fullName} />
            </Suspense>
        </div>
    )
}

