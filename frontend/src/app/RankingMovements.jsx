"use client";

import { supabase } from "@/utils/supabase";
import { useEffect, useState } from "react";
import "../../node_modules/flag-icons/css/flag-icons.min.css"
import useStore from "@/utils/store";

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
    const rankingAlltime = useStore((state) => state.rankingAlltime);

    useEffect(() => {
        getResults().then(result => setResultsList(result));
        getPoints().then(result => setRacePoints(result));
    }, [])

    useEffect(() => {
        setCombinedList([]);
        if (resultsList && racePoints && rankingAlltime) {
            resultsList.map(i => {
                let currentRacePoints;

                if (i.race.includes("etape")) {
                    currentRacePoints = racePoints.find(j => j.raceName == i.race.split(". ")[1]);
                } else {
                    currentRacePoints = racePoints.find(j => j.raceName == i.race);
                }
                const rankingIndex = rankingAlltime.findIndex(rider => rider.fullName == i.rider);
                const currentRankingAlltime = rankingAlltime[rankingIndex];

                if (rankingIndex != -1) {
                    const currentResult = {
                        id: i.id,
                        fullRiderName: i.rider,
                        raceName: i.race.split(" (")[0],
                        raceDate: i.raceDate,
                        racePoints: currentRacePoints.points,
                        lastName: currentRankingAlltime.lastName,
                        firstName: currentRankingAlltime.firstName,
                        nation: currentRankingAlltime.nation,
                        nationFlagCode: currentRankingAlltime.nationFlagCode,
                        riderPoints: currentRankingAlltime.points,
                        riderTeam: currentRankingAlltime.currentTeam,
                    }
                    setCombinedList(combinedList => [...combinedList, currentResult])
                }
            })
        }
        // console.log(combinedList)
    }, [resultsList, racePoints, rankingAlltime])

    return (
        <div className="table">
            <div className="table-header">

            </div>
            <div className="table-content">
                {combinedList && combinedList.map((result, index) => {
                    return (
                        <div key={result.id} className="table-row">
                            <p>{result.raceDate}</p>
                            <p>{result.fullRiderName}</p>
                            <p>{result.raceName}</p>
                        </div>
                    )
                })}
            </div>
        </div>
    )
}