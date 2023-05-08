"use client";

import useStore from "@/utils/store"
import { useEffect, useState } from "react";
import Link from "next/link";
import { stringEncoder } from "@/components/stringHandler";

export default function DanishRanking() {
    const rankingAlltime = useStore((state) => state.rankingAlltime);
    const [danishRanking, setDanishRanking] = useState([]);

    useEffect(() => {
        let filteredRanking = rankingAlltime.filter(r => r.nation == "Danmark");

        const sortedRanking = filteredRanking.sort(function (a, b) { return b.points - a.points });

        const rankedRanking = sortedRanking.map((obj, index) => {
            let rank = index + 1;
            if (index > 0 && obj.points == sortedRanking[index - 1].points) {
                rank = sortedRanking.findIndex(i => obj.points == i.points) + 1;
            }

            return ({ ...obj, currentRank: rank });
        });

        setDanishRanking(rankedRanking);
    }, [rankingAlltime])

    return (
        <div className='table landing-ranking-rounded-container'>
            <div className='table-header'>
                <p>Nr.</p>
                <p>Rytter</p>
                <p>Årgang</p>
                <p>Point</p>
            </div>
            <div className="table-content">
                {danishRanking && danishRanking.map((rider, index) => {
                    return (
                        <div key={rider.id} className='table-row'>
                            <p>{rider.currentRank}</p>
                            <p className='table-name-reversed'><Link href={"/rytter/" + stringEncoder(rider.fullName)}><span className="fi fi-dk"></span><span className='last-name'>{rider.lastName} </span>{rider.firstName}</Link></p>
                            <p><Link href={"/listen?yearFilterRange=single&bornBefore=" + rider.birthYear}>{rider.birthYear}</Link></p>
                            <p>{rider.points}</p>
                        </div>
                    )
                })}
            </div>
        </div>
    )
}