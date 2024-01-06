import { stringDecoder } from "@/components/stringHandler"
import Page from "./page"

export async function generateMetadata({ params }) {
    params = { fullName: params.fullName.replace("%C3%BC", "ü") }
    return {
        title: stringDecoder(params.fullName) + " - Prestigelisten",
        description: "Cykelrytteren " + stringDecoder(params.fullName) + ", hans placering på Prestigelisten over største cykelryttere nogensinde og en liste over hans resultater og udvikling i karrieren",
    }
}

export default function TwitterLayout({ params }) {
    params = { fullName: params.fullName.replace("%C3%BC", "ü") }

    return <div className="">
        <Page fullName={params.fullName} />
    </div>
}