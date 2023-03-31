"use client";

import { supabase } from "@/utils/supabase"
import { useEffect, useState } from "react"

async function getData() {
    let { data: alltimeRanking } = await supabase.from('alltimeRanking').select('*')
    return (alltimeRanking)
}

export default function List() {
    const [ranking, setRanking] = useState();

    useEffect(() => {
        getData().then(result => setRanking(result))
    }, [])

    useEffect(() => {
        console.log(ranking)
    }, [ranking])

    return (
        <div>
            <ul>
                {ranking && ranking.map(rider => {
                    return (
                        <li>{rider.fullName}</li>
                    )
                })}
            </ul>
        </div>
    )
}