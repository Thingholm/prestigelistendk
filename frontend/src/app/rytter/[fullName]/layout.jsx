import Page from "./page";
import { Suspense } from "react";
import Loading from "./loading";

export default function RiderLayout({ params }) {
    return (
        <div className="">
            <Suspense fallback={<Loading riderName={params.fullName} />}>
                <Page fullName={params.fullName} />
            </Suspense>
        </div>
    )
}