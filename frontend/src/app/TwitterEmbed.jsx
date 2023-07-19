"use client";

import RankingLinkHeader from "@/components/RankingLinkHeader";
import Image from "next/image";
import icon from "@/app/icon.png"
import { Follow } from "react-twitter-widgets";
import Link from "next/link";

export default function TwitterEmbed() {
    return (
        <div className="twitter-container">
            <RankingLinkHeader link="https://twitter.com/prestigelisten" title="Følg os på Twitter" />

            <div className="twitter-embed-container">
                <Image src={icon} alt="Prestigelisten Twitter" height={200} width={200} />
                <div>
                    <Link href="https://twitter.com/prestigelisten" target="_blank">@prestigelisten</Link>
                    <p>Følg med på Twitter, hvor vi skriver om udvikling på Prestigelisten, statistik, quiz og meget mere.</p>
                    <Follow username="prestigelisten" options={{ size: "large" }} />
                </div>
            </div>
        </div>
    )
}