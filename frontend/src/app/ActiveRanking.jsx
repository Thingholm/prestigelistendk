"use client";

import useStore from "@/utils/store"
import { useEffect, useState } from "react";
import Link from "next/link";
import { nationEncoder, stringEncoder } from "@/components/stringHandler";
import TableSkeleton from "@/components/TableSkeleton";

export default function ActiveRanking() {
    const rankingAlltime = useStore((state) => state.rankingAlltime);
    const [activeRanking, setActiveRanking] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        setIsLoading(true);
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
        setIsLoading(false);
    }, [rankingAlltime])

    return (
        <div className="rounded-table-container">
            <div className='table'>
                <div className='table-header'>
                    <p>Nr.</p>
                    <p>Rytter</p>
                    <p>Nation</p>
                    <p>Hold</p>
                    <p>Point</p>
                </div>
                {isLoading ? <TableSkeleton /> :
                    <div className="table-content">
                        {activeRanking && activeRanking.map((rider, index) => {
                            return (
                                <div key={rider.id} className='table-row'>
                                    <p>{rider.currentRank}</p>
                                    <p className='table-name-reversed'><Link href={"/rytter/" + stringEncoder(rider.fullName)}><span className='last-name'>{rider.lastName} </span>{rider.firstName}</Link></p>
                                    <p><Link href={"/nation/" + nationEncoder(rider.nation)}><span className={'fi fi-' + rider.nationFlagCode}></span>{rider.nation}</Link></p>
                                    <p>{rider.currentTeam}</p>
                                    <p>{rider.points}</p>
                                </div>
                            )
                        })}
                    </div>
                }

            </div>
        </div>
    )
}