"use client";

import '../style/style.css';
import { supabase } from "@/utils/supabase";
import { useEffect, useState } from "react";
import "../../node_modules/flag-icons/css/flag-icons.min.css";
import useStore from '@/utils/store';

async function getData() {
    let { data: alltimeRanking } = await supabase.from('alltimeRanking').select('*');
    return (alltimeRanking);
}

export default function AlltimeRanking() {
    const rankingAlltime = useStore((state) => state.rankingAlltime);
    const addRankingAlltime = useStore((state) => state.addRankingAlltime);

    useEffect(() => {
        getData().then(result => addRankingAlltime(result));
    }, [])


    return (
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
                            <p>{index + 1}</p>
                            <p><span>{rider.lastName} </span>{rider.firstName}</p>
                            <p><span className={'fi fi-' + rider.nationFlagCode}></span> {rider.nation}</p>
                            <p>{rider.birthYear}</p>
                            <p>{rider.points}</p>
                        </div>
                    )
                })}
            </div>
        </div>
    )
}