"use client";

import OverflowButton from "@/components/OverflowButton";
import SectionLinkButton from "@/components/SectionLinkButton";
import { nationEncoder, stringEncoder } from "@/components/stringHandler";
import { baseUrl } from "@/utils/baseUrl";
import { useAlltimeRanking, useGreatestSeasons, usePointSystem, useResultsByRiderYear } from "@/utils/queryHooks";
import Link from "next/link";
import { useEffect, useState } from "react";

export default function GreatestSeasons() {
    const [loadingStatus, setLoadingStatus] = useState(false);

    const greatestSeasonsQuery = useGreatestSeasons();
    const greatestSeasons = greatestSeasonsQuery.data?.sort((a, b) => a.place - b.place);

    const alltimeRankingQuery = useAlltimeRanking();

    const pointSystemQuery = usePointSystem();
    const pointSystem = pointSystemQuery.data;

    const resultsQuery = useResultsByRiderYear(greatestSeasons?.map(i => i.rider), greatestSeasons?.map(i => i.year));
    const results = resultsQuery.data;

    useEffect(() => {
        if (greatestSeasonsQuery.isSuccess && alltimeRankingQuery.isSuccess && pointSystemQuery.isSuccess && resultsQuery.isSuccess) {
            setLoadingStatus(true)
        }
    }, [greatestSeasonsQuery, alltimeRankingQuery, pointSystemQuery, resultsQuery])

    let resultsWithPoints;

    if (results) {
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


        resultsWithPoints = Object.keys(resultsGroupedByRider).map(i => {

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

    }


    return (
        <div className="greatest-seasons-container" id="stoerste-saesoner">
            <h3>Største individuelle sæsoner <SectionLinkButton link={baseUrl + "/#stoerste-saesoner"} sectionName={"Største individuelle sæsoner"} bg={"grey"} /></h3>
            <div className="rounded-table-container">
                <div className="table-shadow-container">
                    <div className="table">
                        <div className="table-header">
                            <p>Nr.</p>
                            <p>Rytter</p>
                            <p>Største resultater</p>
                            <p>Sæson</p>
                            <p>Point<span className="media table-previous-span">sæson</span></p>
                        </div>
                        <div className="table-content">
                            {loadingStatus && greatestSeasons.map((s, index) => {
                                const rider = alltimeRankingQuery.data.find(i => i.fullName.toLowerCase() == s.rider.toLowerCase())
                                let riderTopResults;
                                if (resultsWithPoints.length > 10) {
                                    riderTopResults = Object.values(resultsWithPoints.find(i => Object.keys(i) == s.rider))[0][s.year]
                                }

                                const nameArr = rider.fullName.split(/ (.*)/);

                                return (
                                    <div key={index} className="table-row">
                                        <p>{s.place}</p>
                                        {rider && <p className='table-name-reversed'><Link href={"/rytter/" + stringEncoder(rider.fullName)}><span className={'fi fi-' + rider.nationFlagCode}></span><span className='last-name'>{nameArr[1]} </span>{nameArr[0]}</Link></p>}
                                        {riderTopResults &&
                                            <p>{riderTopResults.slice(0, 3).map((i, index) => {
                                                let race = i.race.replace("&#39;", "'").split(" (")[0]
                                                if (race.includes("etape")) {
                                                    race = i.count + "x " + race.replace("etape", "etaper");
                                                }
                                                return (index !== 2 ? <span className="race-name-span">{race}, </span> : <span>{race}</span>)
                                            })}</p>}
                                        <p>{s.year}</p>
                                        <p>{s.points}<span className="media table-previous-span">{s.year}</span></p>
                                    </div>
                                )
                            })}
                        </div>
                        <OverflowButton />
                    </div>
                </div>
            </div>
        </div>
    )
}