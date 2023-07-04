"use client";

import '../style/style.css';
import { supabase } from "@/utils/supabase";
import { useEffect, useState } from "react";
import "../../node_modules/flag-icons/css/flag-icons.min.css";
import useStore from '@/utils/store';
import Link from 'next/link';
import { nationEncoder, stringEncoder } from '@/components/stringHandler';
import numerizeRanking from '@/utils/numerizeRanking';
import TableSkeleton from '@/components/TableSkeleton';

async function getData() {
    let { data: alltimeRanking } = await supabase.from('alltimeRanking').select('*');
    return (alltimeRanking);
}

export default function AlltimeRanking() {
    const [isLoading, setIsLoading] = useState(true);
    const rankingAlltime = useStore((state) => state.rankingAlltime);
    const addRankingAlltime = useStore((state) => state.addRankingAlltime);

    useEffect(() => {
        setIsLoading(true);
        getData().then(result => {
            addRankingAlltime(numerizeRanking(result));
            setIsLoading(false);
        });
    }, [])


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

                    {isLoading ? <TableSkeleton /> :
                        <div className="table-content">
                            {rankingAlltime.slice(0, 100).map((rider, index) => {
                                return (
                                    <div key={rider.id} className='table-row'>
                                        <p>{rider.currentRank.toLocaleString("de-DE")}</p>
                                        <p className='table-name-reversed'><Link href={"/rytter/" + stringEncoder(rider.fullName.replace("&#39;", "'"))}><span className={'media fi fi-' + rider.nationFlagCode}></span><span className='last-name'>{rider.lastName.replace("&#39;", "'")} </span><span className='first-name'>{rider.firstName}</span></Link></p>
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