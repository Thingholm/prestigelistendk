"use client";

import '../style/style.css';
import { supabase } from "@/utils/supabase";
import { useEffect, useState } from "react";
import "../../node_modules/flag-icons/css/flag-icons.min.css";
import useStore from '@/utils/store';
import Link from 'next/link';
import { stringEncoder } from '@/components/stringHandler';

async function getData() {
    let { data: alltimeRanking } = await supabase.from('alltimeRanking').select('*');
    return (alltimeRanking);
}

export default function AlltimeRanking() {
    const rankingAlltime = useStore((state) => state.rankingAlltime);
    const addRankingAlltime = useStore((state) => state.addRankingAlltime);

    useEffect(() => {
        getData().then(result => {
            const sortedRanking = result.sort(function (a, b) { return b.points - a.points });

            const rankedRanking = sortedRanking.map((obj, index) => {
                let rank = index + 1;

                if (index > 0 && obj.points == sortedRanking[index - 1].points) {
                    rank = sortedRanking.findIndex(i => obj.points == i.points) + 1;
                }

                return ({ ...obj, currentRank: rank })
            });

            addRankingAlltime(rankedRanking);
        });
    }, [])


    return (
        <div className='table hero-alltimeranking landing-ranking-rounded-container'>
            <div className='table-header'>
                <p>Nr.</p>
                <p>Rytter</p>
                <p>Nation</p>
                <p>Årgang</p>
                <p>Point</p>
            </div>
            <div className="table-content">
                {rankingAlltime && rankingAlltime.map((rider, index) => {
                    return (
                        <div key={rider.id} className='table-row'>
                            <p>{rider.currentRank}</p>
                            <p className='table-name-reversed'><Link href={"/rytter/" + stringEncoder(rider.fullName)}><span className='last-name'>{rider.lastName} </span>{rider.firstName}</Link></p>
                            <p><Link href={"/nation/" + rider.nation}><span className={'fi fi-' + rider.nationFlagCode}></span> {rider.nation}</Link></p>
                            <p>{rider.birthYear}</p>
                            <p>{rider.points}</p>
                        </div>
                    )
                })}
            </div>
        </div>
    )
}