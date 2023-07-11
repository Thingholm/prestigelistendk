"use client";

import { useEffect, useState } from "react";
import "../../node_modules/flag-icons/css/flag-icons.min.css"
import ArrowUpTriangle from "@/components/ArrowUpTriangle";
import NoChange from "@/components/NoChange";
import Link from "next/link";
import numerizeRanking from "@/utils/numerizeRanking";
import { stringEncoder } from "@/components/stringHandler";
import TableSkeleton from "@/components/TableSkeleton";
import { useAlltimeRanking, useLatestResults, usePointSystem } from "@/utils/queryHooks";
import OverflowButton from "@/components/OverflowButton";

export default function RankingMovements() {
    const [latestResults, setLatestResults] = useState();

    const pointSystemQuery = usePointSystem();
    const pointSystem = pointSystemQuery.data;

    const alltimeRankingQuery = useAlltimeRanking();
    const alltimeRanking = alltimeRankingQuery.data;


    const latestResultsQuery = useLatestResults()
    const latestResultsData = latestResultsQuery.data

    useEffect(() => {
        if (alltimeRanking && latestResultsData && pointSystem) {
            const filteredResults = latestResultsData.filter(i => alltimeRanking.map(j => j.fullName).includes(i.rider));
            const resultsGroupedByDateWithPoints = filteredResults.reduce((acc, obj) => {
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

            let prevRanking = numerizeRanking(alltimeRanking);

            resultsGroupedArray = resultsGroupedArray.map(i => {
                let newPrevRanking = prevRanking.map(j => {
                    return {
                        currentRank: j.currentRank,
                        fullName: j.fullName,
                        points: j.points,
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

            setLatestResults(finalMovementsList)
        }
    }, [alltimeRanking, latestResultsData, pointSystem])

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
                {!latestResults ? <TableSkeleton /> :
                    <div className="table-content">
                        {latestResults.map((result, index) => {
                            console.log(result)
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

                            const nameArr = result.fullName.split(/ (.*)/);

                            return (
                                <div key={index} className="table-row">
                                    <p>{result.newRank.toLocaleString("de-DE")} <span className="table-previous-span">{result.oldRank.toLocaleString("de-DE")}</span></p>
                                    <p className={result.oldRank - result.newRank > 0 ? "rank-up" : "no-movement"}>{result.oldRank - result.newRank > 0 ? <ArrowUpTriangle /> : <NoChange />} {(result.oldRank - result.newRank).toLocaleString("de-DE")}</p>
                                    <p className='table-name-reversed'><Link href={"/rytter/" + stringEncoder(result.rider)}><span className={'fi fi-' + result.nationFlagCode}></span> <span className="last-name">{nameArr[1]}</span> {nameArr[0]}</Link><span className="media">{race} <span className="media-smallest">({result.racePoints} pt.)</span></span></p>
                                    <p>{race}</p>
                                    <p>{result.racePoints}</p>
                                    <p>{result.newPoints.toLocaleString("de-DE")} <span className="table-previous-span">{result.oldPoints.toLocaleString("de-DE")}</span></p>
                                    <p>{result.raceDate.split("-")[2] + "-" + result.raceDate.split("-")[1]}</p>
                                </div>
                            )
                        })}
                    </div>
                }
                <OverflowButton />
            </div>

        </div>
    )
}