"use client";

import '../style/style.css';
import { supabase } from "@/utils/supabase";
import { useEffect, useState } from "react";
import "../../node_modules/flag-icons/css/flag-icons.min.css";
import useStore from '@/utils/store';
import Link from 'next/link';
import { nationEncoder, stringEncoder } from '@/components/stringHandler';
import numerizeRanking from '@/utils/numerizeRanking';

async function getData() {
    let { data: alltimeRanking } = await supabase.from('alltimeRanking').select('*');
    return (alltimeRanking);
}

export default function AlltimeRanking() {
    const rankingAlltime = useStore((state) => state.rankingAlltime);
    const addRankingAlltime = useStore((state) => state.addRankingAlltime);

    useEffect(() => {
        getData().then(result => {
            addRankingAlltime(numerizeRanking(result));
        });
    }, [])


    return (
        <div className="rounded-table-container">
            <div className='table hero-alltimeranking'>
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
                                <p className='table-name-reversed'><Link href={"/rytter/" + stringEncoder(rider.fullName.replace("&#39;", "'"))}><span className='last-name'>{rider.lastName.replace("&#39;", "'")} </span>{rider.firstName}</Link></p>
                                <p><Link href={"/nation/" + nationEncoder(rider.nation)}><span className={'fi fi-' + rider.nationFlagCode}></span> {rider.nation}</Link></p>
                                <p>{rider.birthYear}</p>
                                <p>{rider.points}</p>
                            </div>
                        )
                    })}
                </div>
            </div>
        </div>
    )
}