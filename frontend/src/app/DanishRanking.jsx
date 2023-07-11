"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { stringEncoder } from "@/components/stringHandler";
import TableSkeleton from "@/components/TableSkeleton";
import { useAlltimeRanking } from "@/utils/queryHooks";
import numerizeRanking from "@/utils/numerizeRanking";
import OverflowButton from "@/components/OverflowButton";

export default function DanishRanking() {
    const [danishRanking, setDanishRanking] = useState([]);

    const alltimeRankingQuery = useAlltimeRanking();

    useEffect(() => {
        if (alltimeRankingQuery.isSuccess) {
            const rankedRanking = numerizeRanking(alltimeRankingQuery.data.filter(i => i.nation == "Danmark"))

            setDanishRanking(rankedRanking);
        }
    }, [alltimeRankingQuery.data])

    return (
        <div className="rounded-table-container">
            <div className="table-shadow-container">
                <div className='table'>
                    <div className='table-header'>
                        <p>Nr.</p>
                        <p>Rytter</p>
                        <p>Årgang</p>
                        <p>Point</p>
                    </div>
                    {alltimeRankingQuery.isLoading ? <TableSkeleton /> :
                        <div className="table-content">
                            {danishRanking && danishRanking.map((rider, index) => {
                                const nameArr = rider.fullName.split(/ (.*)/);

                                return (
                                    <div key={rider.id} className='table-row'>
                                        <p>{rider.currentRank.toLocaleString("de-DE")}</p>
                                        <p className='table-name-reversed'><Link href={"/rytter/" + stringEncoder(rider.fullName)}><span className="fi fi-dk"></span><span className='last-name'>{nameArr[1]} </span><span className="first-name">{nameArr[0]}</span></Link></p>
                                        <p><Link href={"/listen?yearFilterRange=single&bornBefore=" + rider.birthYear}>{rider.birthYear}</Link></p>
                                        <p>{rider.points.toLocaleString("de-DE")}</p>
                                    </div>
                                )
                            })}
                        </div>
                    }
                    <OverflowButton />
                </div>
            </div>
        </div>
    )
}