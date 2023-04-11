"use client";

import { supabase } from "@/utils/supabase";
import { useEffect, useState } from "react";
import "../../node_modules/flag-icons/css/flag-icons.min.css"
import useStore from "@/utils/store";
import ArrowUpTriangle from "@/components/ArrowUpTriangle";
import NoChange from "@/components/NoChange";

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
                <p>Udvikling</p>
                <p>Rank</p>
                <p>Rytter</p>
                <p>Resultat</p>
                <p>Point vundet</p>
                <p>Point</p>
                <p>Dato</p>
            </div>
            <div className="table-content">
                {combinedList && combinedList.map((result, index) => {
                    return (
                        <div key={result.id} className="table-row">
                            <p>{result.prevRank - result.currentRank > 0 ? <ArrowUpTriangle /> : <NoChange />} {result.prevRank - result.currentRank}</p>
                            <p>{result.currentRank} <span className="table-previous-span">{result.prevRank}</span></p>
                            <p className='table-name-reversed'><span className={'fi fi-' + result.nationFlagCode}></span> <span className="last-name">{result.lastName}</span> {result.firstName}</p>
                            <p>{result.raceName}</p>
                            <p>{result.racePoints}</p>
                            <p>{result.riderPoints} <span className="table-previous-span">{result.prevPoints}</span></p>
                            <p>{result.raceDate.replace("2023-", "")}</p>
                        </div>
                    )
                })}
            </div>
        </div>
    )
}