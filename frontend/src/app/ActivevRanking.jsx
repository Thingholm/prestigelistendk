"use client";

import useStore from "@/utils/store"
import { useEffect, useState } from "react";
import Link from "next/link";

export default function ActiveRanking() {
    const rankingAlltime = useStore((state) => state.rankingAlltime);
    const [activeRanking, setActiveRanking] = useState([]);

    useEffect(() => {
        let filteredRanking = rankingAlltime.filter(r => r.active == true);

        const sortedRanking = filteredRanking.sort(function (a, b) { return b.points - a.points });

        const rankedRanking = sortedRanking.map((obj, index) => {
            let rank = index + 1;
            if (index > 0 && obj.points == sortedRanking[index - 1].points) {
                rank = sortedRanking.findIndex(i => obj.points == i.points) + 1;
            }

            return ({ ...obj, currentRank: rank });
        });

        setActiveRanking(rankedRanking);
    }, [rankingAlltime])

    return (
        <div className='table hero-alltimeranking landing-ranking-rounded-container'>
            <div className='table-header'>
                <p>Nr.</p>
                <p>Rytter</p>
                <p>Nation</p>
                <p>Hold</p>
                <p>Point</p>
            </div>
            <div className="table-content">
                {activeRanking && activeRanking.map((rider, index) => {
                    return (
                        <div key={rider.id} className='table-row'>
                            <p>{rider.currentRank}</p>
                            <p className='table-name-reversed'><Link href={"/rytter/" + rider.riderId}><span className='last-name'>{rider.lastName} </span>{rider.firstName}</Link></p>
                            <p><Link href={"/nation/" + rider.nation.replace("Ø", "oe")}><span className={'fi fi-' + rider.nationFlagCode}></span> {rider.nation}</Link></p>
                            <p>{rider.currentTeam}</p>
                            <p>{rider.points}</p>
                        </div>
                    )
                })}
            </div>
        </div>
    )
}