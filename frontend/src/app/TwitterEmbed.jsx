"use client";

import RankingLinkHeader from "@/components/RankingLinkHeader";
import { Timeline } from "react-twitter-widgets";

export default function TwitterEmbed() {
    return (
        <div className="twitter-container">
            <RankingLinkHeader link="https://twitter.com/prestigelisten" title="Følg os på Twitter" />

            <div className="twitter-embed-container">
                <Timeline
                    dataSource={{
                        sourceType: 'profile',
                        screenName: 'prestigelisten'
                    }}
                    options={{
                        height: '600',
                        width: '600',
                        lang: 'da'
                    }}
                />
            </div>
        </div>
    )
}