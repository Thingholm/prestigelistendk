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
import TableSkeleton from "@/components/TableSkeleton";

async function getData() {
    const date = new Date();
    let { data: results } = await supabase.from('results').select('*').gt('raceDate', date.getFullYear() + "-" + (date.getMonth() - 1) + "-" + date.getDate());
    return { results: results };
}

async function getPoints() {
    let { data: pointSystem } = await supabase.from('pointSystem').select('*');
    return pointSystem;
}

export default function RankingMovements() {
    const [isLoading, setIsLoading] = useState(true);
    const rankingAlltime = useStore((state) => state.rankingAlltime);
    const latestResults = useStore((state) => state.latestResults);
    const addLatestResults = useStore((state) => state.addLatestResults);
    const pointSystem = useStore((state) => state.pointSystem);
    const addPointSystem = useStore((state) => state.addPointSystem);

    useEffect(() => {
        getPoints().then(result => addPointSystem(result));
    }, [rankingAlltime]);

    useEffect(() => {
        getData().then(result => {
            const filteredForRidersOnly = result.results.filter(i => {
                if (rankingAlltime.map(j => j.fullName).includes(i.rider)) {
                    return true;
                }
            }).map(i => {
                return { ...i, race: i.race.replace("&#39;", "'") }
            })

            const resultsGroupedByDateWithPoints = filteredForRidersOnly.reduce((acc, obj) => {
                const key = obj["raceDate"];
                const curGroup = acc[key] ?? [];
                const curResult = ((obj.race.includes("etape") ? obj.race.split(". ")[1] : obj.race))
                const curPoints = (pointSystem.find(i => i.raceName == curResult) ? pointSystem.find(i => i.raceName == curResult).points : 0)
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

            addLatestResults(finalMovementsList)
            setIsLoading(false);
        });
    }, [pointSystem])

    return (
        <div className="table-shadow-container">
            <div className="table result-table">
                <div className="table-header">
                    <p>Placering</p>
                    <p><span>Udvikling</span><span className="media">Udv.</span></p>
                    <p>Rytter <span className="media"> og resultat</span></p>
                    <p>Resultat</p>
                    <p><span>Point optjent</span><span className="media">+Pt.</span></p>
                    <p>Point</p>
                    <p>Dato</p>
                </div>
                {isLoading ? <TableSkeleton /> :
                    <div className="table-content">
                        {latestResults.map((result, index) => {
                            const race = (result.count > 1 ?
                                result.race.map((i, index) => {
                                    const fR = i.replace("af", "i")
                                    if (index == 0) {
                                        return fR.split(" (")[0]
                                    } else if (index == (result.race.length - 1)) {
                                        return " og " + fR.split(" (")[0]
                                    } else {
                                        return ", " + fR.split(" (")[0]
                                    }
                                }) :
                                result.race.replace("af", "i").split(" (")[0]);
                            return (
                                <div key={index} className="table-row">
                                    <p>{result.newRank} <span className="table-previous-span">{result.oldRank}</span></p>
                                    <p className={result.oldRank - result.newRank > 0 ? "rank-up" : "no-movement"}>{result.oldRank - result.newRank > 0 ? <ArrowUpTriangle /> : <NoChange />} {result.oldRank - result.newRank}</p>
                                    <p className='table-name-reversed'><Link href={"/rytter/" + stringEncoder(result.rider)}><span className={'fi fi-' + result.nationFlagCode}></span> <span className="last-name">{result.lastName.replace("&#39;", "'")}</span> {result.firstName}</Link><span className="media">{race} <span className="media-smallest">({result.racePoints} pt.)</span></span></p>
                                    <p>{race}</p>
                                    <p>{result.racePoints}</p>
                                    <p>{result.newPoints} <span className="table-previous-span">{result.oldPoints}</span></p>
                                    <p>{result.raceDate.split("-")[2] + "-" + result.raceDate.split("-")[1]}</p>
                                </div>
                            )
                        })}
                    </div>
                }

            </div>

        </div>
    )
}