"use client";

import '../style/style.css';
import "../../node_modules/flag-icons/css/flag-icons.min.css";
import Link from 'next/link';
import { nationEncoder, stringEncoder } from '@/components/stringHandler';
import numerizeRanking from '@/utils/numerizeRanking';
import TableSkeleton from '@/components/TableSkeleton';
import { useAlltimeRanking } from '@/utils/queryHooks';

export default function AlltimeRanking() {
    const alltimeRankingQuery = useAlltimeRanking();

    if (alltimeRankingQuery.isSuccess) {
        var alltimeRanking = numerizeRanking(alltimeRankingQuery.data)
    }


    return (
        <div className="rounded-table-container">
            <div className="table-shadow-container">
                <div className='table hero-alltimeranking'>
                    <div className='table-header'>
                        <p>Nr.</p>
                        <p>Rytter</p>
                        <p>Nation</p>
                        <p>År<span>gang</span></p>
                        <p>Point</p>
                    </div>

                    {alltimeRankingQuery.isLoading ? <TableSkeleton /> :
                        <div className="table-content">
                            {alltimeRanking.slice(0, 100).map((rider, index) => {
                                const nameArr = rider.fullName.split(/ (.*)/);
                                return (
                                    <div key={rider.id} className='table-row'>
                                        <p>{rider.currentRank.toLocaleString("de-DE")}</p>
                                        <p className='table-name-reversed'><Link href={"/rytter/" + stringEncoder(rider.fullName)}><span className={'media fi fi-' + rider.nationFlagCode}></span><span className='last-name'>{nameArr[1]} </span><span className='first-name'>{nameArr[0]}</span></Link></p>
                                        <p><Link href={"/nation/" + nationEncoder(rider.nation)}><span className={'fi fi-' + rider.nationFlagCode}></span>{rider.nation}</Link></p>
                                        <p>{rider.birthYear}</p>
                                        <p>{rider.points.toLocaleString("de-DE")}</p>
                                    </div>
                                )
                            })}
                            <button className="table-bottom-button" onClick={() => location.href = "/listen"} >Se hele listen</button>
                        </div>
                    }
                </div>
            </div>
        </div>
    )
}