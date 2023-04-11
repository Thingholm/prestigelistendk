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

        let prevRankings = rankingAlltime.map(i => {
            return ({
                id: i.id,
                fullName: i.fullName,
                points: i.points
            })
        });

        if (resultsList && racePoints && rankingAlltime) {
            resultsList.sort(function (a, b) { return b.raceDate.replace("2023-", "").replace("-", "") - a.raceDate.replace("2023-", "").replace("-", "") }).slice(0, 10).map(i => {
                let currentRacePoints;
                const date = i.raceDate;

                if (i.race.includes("etape")) {
                    currentRacePoints = racePoints.find(j => j.raceName == i.race.split(". ")[1]);
                } else {
                    currentRacePoints = racePoints.find(j => j.raceName == i.race);
                }

                const rankingIndex = rankingAlltime.findIndex(rider => rider.fullName == i.rider);
                const currentRankingAlltime = rankingAlltime[rankingIndex];

                if (rankingIndex != -1) {
                    const rankBeforeResult = { id: prevRankings[rankingIndex].id, fullName: prevRankings[rankingIndex].fullName, points: prevRankings[rankingIndex].points -= currentRacePoints.points, rankingIndex: rankingIndex };

                    let tempRank = prevRankings.map(i => {
                        return ({
                            id: i.id,
                            fullName: i.fullName,
                            points: i.points
                        })
                    });

                    tempRank[rankingIndex] = rankBeforeResult;

                    const sortedRanking = tempRank.sort(function (a, b) { return b.points - a.points });

                    const rankedRanking = sortedRanking.map((obj, index) => {
                        let rank = index + 1;

                        if (index > 0 && obj.points == sortedRanking[index - 1].points) {
                            rank = sortedRanking.findIndex(i => obj.points == i.points) + 1;
                        }

                        return ({ ...obj, currentRank: rank })
                    });

                    const riderPrevRank = rankedRanking.find(e => e.fullName == i.rider);

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
                        currentRank: currentRankingAlltime.currentRank,
                        prevPoints: riderPrevRank.points,
                        prevRank: riderPrevRank.currentRank
                    }
                    setCombinedList(combinedList => [...combinedList, currentResult])
                }
            })
        }

    }, [resultsList, racePoints, rankingAlltime])

    return (
        <div className="table result-table">
            <div className="table-header">

            </div>
            <div className="table-content">
                {combinedList && combinedList.map((result, index) => {
                    return (
                        <div key={result.id} className="table-row">
                            <p>{result.raceDate}</p>
                            <p>{result.currentRank} {result.prevRank}</p>
                            <p>{result.prevRank - result.currentRank}</p>
                            <p>{result.riderPoints} <span>{result.prevPoints}</span></p>
                            <p><span className={'fi fi-' + result.nationFlagCode}></span> {result.lastName} {result.firstName}</p>
                            <p>{result.raceName}</p>
                            <p>{result.racePoints}</p>

                        </div>
                    )
                })}
            </div>
        </div>
    )
}