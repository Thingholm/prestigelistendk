"use client";

import { supabase } from "@/utils/supabase";
import { useEffect, useState } from "react";
import "../../node_modules/flag-icons/css/flag-icons.min.css"

async function getResults() {
    let { data: results } = await supabase.from('results').select('*').eq('year', '2023');
    return results;
}

async function getPoints() {
    let { data: pointSystem } = await supabase.from('pointSystem').select('*');
    return pointSystem;
}

export default function RankingMovements() {
    const [resultsList, setResultsList] = useState();
    const [racePoints, setRacePoints] = useState();
    const [combinedList, setCombinedList] = useState([]);

    useEffect(() => {
        getResults().then(result => setResultsList(result));
        getPoints().then(result => setRacePoints(result));
    }, [])

    useEffect(() => {
        setCombinedList([]);
        if (resultsList && racePoints) {
            resultsList.map(i => {
                // if (i.race.includes("etape")) {
                //     console.log(racePoints.find(j => j.raceName == i.race.split(". ")[1]))
                // } else {
                // console.log(racePoints.find(j => j.raceName == i.race))
                // }

                setCombinedList(combinedList => [...combinedList, { fullRiderName: i.rider, raceName: i.race, raceDate: i.raceDate }])
                console.log(combinedList)
            })
        }
    }, [resultsList, racePoints])

    return (
        <div className="table">
            <div className="table-header">

            </div>
            <div className="table-content">
                {resultsList && resultsList.map((result, index) => {
                    return (
                        <div key={result.id} className="table-row">
                            <p>{result.raceDate}</p>
                            <p>{result.rider}</p>
                            <p>{result.race}</p>
                        </div>
                    )
                })}
            </div>
        </div>
    )
}