"use client";

import { supabase } from "@/utils/supabase";
import { useEffect, useState } from "react";
import "../../node_modules/flag-icons/css/flag-icons.min.css"
import useStore from "@/utils/store";
import ArrowUpTriangle from "@/components/ArrowUpTriangle";
import NoChange from "@/components/NoChange";
import Link from "next/link";
import numerizeRanking from "@/utils/numerizeRanking";
import { stringEncoder } from "@/components/stringHandler";

async function getResults() {
    const date = new Date();
    let { data: results } = await supabase.from('results').select('*').gt('raceDate', date.getFullYear() + "-" + (date.getMonth() - 1) + "-" + date.getDate());
    return results;
}

async function getPoints() {
    let { data: pointSystem } = await supabase.from('pointSystem').select('*');
    return pointSystem;
}

export default function RankingMovements() {
    const [resultsList, setResultsList] = useState();
    const [racePoints, setRacePoints] = useState();
    const rankingAlltime = useStore((state) => state.rankingAlltime);

    useEffect(() => {
        getPoints().then(result => setRacePoints(result));
        getResults().then(result => {
            const filteredForRidersOnly = result.filter(i => {
                if (rankingAlltime.map(j => j.fullName).includes(i.rider)) {
                    return true;
                }
            })

            const resultsGroupedByDateWithPoints = filteredForRidersOnly.reduce((acc, obj) => {
                const key = obj["raceDate"];
                const curGroup = acc[key] ?? [];
                const curResult = ((obj.race.includes("etape") ? obj.race.split(". ")[1] : obj.race))
                const curPoints = racePoints.find(i => i.raceName == curResult).points
                let counter = 1;
                if (curGroup.find(i => i.rider == obj.rider)) {
                    const index = curGroup.findIndex(i => i.rider == obj.rider);
                    acc[key][index].points += curPoints;
                    acc[key][index].race = [acc[key][index].race, obj.race];
                    acc[key][index].count++;
                    return { ...acc, [key]: curGroup.sort((a, b) => b.points - a.points) }
                } else {
                    return { ...acc, [key]: [...curGroup, { ...obj, points: curPoints, count: counter }].sort((a, b) => b.points - a.points) }
                }
            }, {})

            let resultsGroupedArray = [];

            Object.keys(resultsGroupedByDateWithPoints).map(i => {
                resultsGroupedArray.push({ date: i, data: resultsGroupedByDateWithPoints[i] })
            })

            resultsGroupedArray = resultsGroupedArray.sort((a, b) => b.date.localeCompare(a.date))

            let finalMovementsList = [];

            let prevRanking = numerizeRanking(rankingAlltime);

            resultsGroupedArray = resultsGroupedArray.map(i => {
                let newPrevRanking = prevRanking.map(j => {
                    return {
                        currentRank: j.currentRank,
                        fullName: j.fullName,
                        points: j.points,
                        firstName: j.firstName,
                        lastName: j.lastName,
                        nationFlagCode: j.nationFlagCode,
                    }
                });

                i.data.map(j => {
                    const rankingIndex = newPrevRanking.findIndex(k => k.fullName == j.rider)
                    newPrevRanking[rankingIndex].points = newPrevRanking[rankingIndex].points - j.points;

                })

                newPrevRanking = numerizeRanking(newPrevRanking)

                i.data.map(j => {
                    const rankingIndex = newPrevRanking.findIndex(k => k.fullName == j.rider);
                    const newRankIndex = prevRanking.findIndex(k => k.fullName == j.rider);
                    finalMovementsList.push(
                        {
                            ...j,
                            ...prevRanking[newRankIndex],
                            oldRank: newPrevRanking[rankingIndex].currentRank,
                            oldPoints: newPrevRanking[rankingIndex].points,
                            newRank: prevRanking[newRankIndex].currentRank,
                            newPoints: prevRanking[newRankIndex].points,
                            raceDate: i.date,
                            racePoints: j.points,
                        }
                    )
                })

                prevRanking = newPrevRanking;
            })

            setResultsList(finalMovementsList)
        });
    }, [rankingAlltime])

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
                {resultsList && resultsList.map((result, index) => {
                    return (
                        <div key={index} className="table-row">
                            <p>{result.oldRank - result.newRank > 0 ? <ArrowUpTriangle /> : <NoChange />} {result.oldRank - result.newRank}</p>
                            <p>{result.newRank} <span className="table-previous-span">{result.oldRank}</span></p>
                            <p className='table-name-reversed'><Link href={"/rytter/" + stringEncoder(result.rider)}><span className={'fi fi-' + result.nationFlagCode}></span> <span className="last-name">{result.lastName}</span> {result.firstName}</Link></p>
                            <p>{result.count > 1 ?
                                result.race.map((i, index) => {
                                    if (index == 0) {
                                        return i.split(" (")[0]
                                    } else if (index == (result.race.length - 1)) {
                                        return " & " + i.split(" (")[0]
                                    } else {
                                        return ", " + i.split(" (")[0]
                                    }
                                }) :
                                result.race.split(" (")[0]}
                            </p>
                            <p>{result.racePoints}</p>
                            <p>{result.newPoints} <span className="table-previous-span">{result.oldPoints}</span></p>
                            <p>{result.raceDate.split("-")[2] + "-" + result.raceDate.split("-")[1]}</p>
                        </div>
                    )
                })}
            </div>
        </div>
    )
}