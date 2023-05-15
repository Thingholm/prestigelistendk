"use client";

import { nationEncoder, stringEncoder } from "@/components/stringHandler";
import useStore from "@/utils/store";
import { supabase } from "@/utils/supabase";
import Link from "next/link";
import { useState, useEffect } from "react";

async function fetchData() {
    let { data: greatestSeasons } = await supabase
        .from('greatestSeasons')
        .select('*');

    return greatestSeasons.sort((a, b) => a.place - b.place);
}

async function fetchResults(riders, years) {
    let { data: results } = await supabase
        .from('results')
        .select('*')
        .in('year', years)
        .in('rider', riders);
    return results;
}

export default function GreatestSeasons() {
    const [greatestSeasons, setGreatestSeasons] = useState([]);
    const [results, setResults] = useState([]);
    const [resultsWithPoints, setResultsWithPoints] = useState([]);
    const rankingAlltime = useStore((state) => state.rankingAlltime);
    const pointSystem = useStore((state) => state.pointSystem);

    useEffect(() => {
        if (rankingAlltime) {
            fetchData().then(data => setGreatestSeasons(data));
        }
    }, [rankingAlltime]);

    useEffect(() => {
        if (greatestSeasons) {
            fetchResults(
                greatestSeasons.reduce((acc, obj) => {
                    if (!acc.includes(obj.rider)) {
                        acc.push(obj.rider)
                    }

                    return acc;
                }, []),

                greatestSeasons.reduce((acc, obj) => {
                    if (!acc.includes(obj.year)) {
                        acc.push(obj.year)
                    }
                    return acc;
                }, [])
            ).then(results =>
                setResults(results)
            );
        }
    }, [greatestSeasons])

    useEffect(() => {
        if (results && pointSystem) {
            const resultsGroupedByRider = results.map(i => {
                return {
                    ...i,
                    racePoints: pointSystem.find(j =>
                        j.raceName == (i.race.includes("etape") ? i.race.replace("&#39;", "'").split(". ")[1].replace(/comma/g, ",") : i.race.replace("&#39;", "'").replace(/comma/g, ","))
                    ).points
                }
            }).reduce((acc, obj) => {
                const key = obj["rider"];
                const curGroup = acc[key] ?? [];
                let race = obj.race;

                if (obj.race.includes("etape")) {
                    race = obj.race.split(". ")[1];
                }

                return { ...acc, [key]: [...curGroup, { ...obj, race: race, count: 1 }] }
            }, {})

            setResultsWithPoints(
                Object.keys(resultsGroupedByRider).map(i => {

                    return {
                        [i]: resultsGroupedByRider[i].reduce((acc, obj) => {
                            const key = obj["year"];
                            const curGroup = acc[key] ?? [];

                            if (curGroup.map(j => j.race).includes(obj.race)) {
                                let index = curGroup.findIndex(j => j.race == obj.race)
                                if (!obj.race.includes("Dag i førertrøjen")) {
                                    curGroup[index].racePoints += obj.racePoints;
                                }
                                curGroup[index].count += 1
                                return { ...acc, [key]: [...curGroup].sort((a, b) => b.racePoints - a.racePoints) }
                            } else {
                                return { ...acc, [key]: [...curGroup, obj].sort((a, b) => b.racePoints - a.racePoints) }
                            }
                        }, {})
                    }

                })
            )
        }
    }, [results, pointSystem])

    return (
        <div className="greatest-seasons-container">
            <h3>Største individuelle sæsoner</h3>
            <div className="rounded-table-container">
                <div className="table">
                    <div className="table-header">
                        <p>Nr.</p>
                        <p>Rytter</p>
                        <p>Resultater</p>
                        <p>Sæson</p>
                        <p>Point opnået</p>
                    </div>
                    <div className="table-content">
                        {greatestSeasons && greatestSeasons.map((s, index) => {
                            const rider = rankingAlltime.find(i => i.fullName.toLowerCase() == s.rider.toLowerCase())
                            let riderTopResults;
                            if (resultsWithPoints.length > 10) {
                                riderTopResults = Object.values(resultsWithPoints.find(i => Object.keys(i) == s.rider))[0][s.year]
                            }


                            return (
                                <div key={index} className="table-row">
                                    <p>{s.place}</p>
                                    {rider && <p className='table-name-reversed'><Link href={"/rytter/" + stringEncoder(rider.fullName.replace("&#39;", "'"))}><span className={'fi fi-' + rider.nationFlagCode}></span><span className='last-name'>{rider.lastName.replace("&#39;", "'")} </span>{rider.firstName}</Link></p>}
                                    {riderTopResults &&
                                        <p>{riderTopResults.slice(0, 3).map((i, index) => {
                                            let race = i.race.replace("&#39;", "'").split(" (")[0]
                                            if (race.includes("etape")) {
                                                race = i.count + "x " + race.replace("etape", "etaper");
                                            }
                                            return (index == 0 ? race : ", " + race)
                                        })}</p>}
                                    <p>{s.year}</p>
                                    <p>{s.points}</p>
                                </div>
                            )
                        })}
                    </div>
                </div>
            </div>
        </div>
    )
}