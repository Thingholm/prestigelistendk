"use client"

import { stringEncoder } from "@/components/stringHandler";
import { useRouter, useSearchParams } from "next/navigation"
import { IoPeopleOutline } from "react-icons/io5";

export default function CompareFloat(props) {
    const riderName = props.rider.fullName
    const searchParams = useSearchParams().toString();


    const router = useRouter();

    return (
        <button
            className="float"
            onClick={() => router.push("/sammenlign?" + stringEncoder(riderName))}
            style={searchParams ? { display: "none" } : { display: "block" }}
        >
            <IoPeopleOutline />
            <span>Sammenlign med andre ryttere</span>
        </button>
    )
}