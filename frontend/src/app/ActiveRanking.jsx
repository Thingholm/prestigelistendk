"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { nationEncoder, stringEncoder } from "@/components/stringHandler";
import TableSkeleton from "@/components/TableSkeleton";
import { useAlltimeRanking } from "@/utils/queryHooks";
import numerizeRanking from "@/utils/numerizeRanking";
import OverflowButton from "@/components/OverflowButton";

export default function ActiveRanking() {
    const [amountLoaded, setLoadedAmount] = useState(100);

    const alltimeRankingQuery = useAlltimeRanking();

    let activeRanking;
    if (alltimeRankingQuery.isSuccess) {
        activeRanking = numerizeRanking(alltimeRankingQuery.data.filter(i => i.active == true))
    }

    return (
        <div className="rounded-table-container">
            <div className="table-shadow-container">
                <div className='table'>
                    <div className='table-header'>
                        <p>Nr.</p>
                        <p>Rytter</p>
                        <p>Nation</p>
                        <p>Hold</p>
                        <p>Point</p>
                    </div>
                    {alltimeRankingQuery.isLoading ? <TableSkeleton /> :
                        <div className="table-content">
                            {activeRanking && activeRanking.slice(0, amountLoaded).map((rider, index) => {
                                const nameArr = rider.fullName.split(/ (.*)/);

                                return (
                                    <div key={rider.id} className='table-row'>
                                        <p>{rider.currentRank.toLocaleString("de-DE")}</p>
                                        <p className='table-name-reversed'><Link href={"/rytter/" + stringEncoder(rider.fullName)}><span className={'media fi fi-' + rider.nationFlagCode}></span><span className='last-name'>{nameArr[1]} </span>{[nameArr[0]]}</Link><span className="cur-team-span">{rider.currentTeam}</span></p>
                                        <p><Link href={"/nation/" + nationEncoder(rider.nation)}><span className={'fi fi-' + rider.nationFlagCode}></span><span>{rider.nation}</span></Link></p>
                                        <p>{rider.currentTeam}</p>
                                        <p>{rider.points.toLocaleString("de-DE")}</p>
                                    </div>
                                )
                            })}
                            {amountLoaded < 500 && <button className="table-bottom-button" onClick={() => setLoadedAmount(500)}>Indlæs alle...</button>}
                        </div>
                    }
                    <OverflowButton />
                </div>
            </div>
        </div>
    )
}