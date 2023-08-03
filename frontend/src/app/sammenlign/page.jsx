"use client"

import { stringDecoder, stringEncoder } from "@/components/stringHandler";
import { useAlltimeRanking, usePointSystem, useResultsByRiders } from "@/utils/queryHooks"
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import ComparisonRiderProfile from "./ComparisonRiderProfile";
import numerizeRanking from "@/utils/numerizeRanking";
// import RadarChart from "./RadarChart";

function searchOutputClickHandler(state, rider, pathname) {
    const encodedRiderName = stringEncoder(rider);

    if (state) {
        return state + "&" + encodedRiderName
    } else {
        return pathname + "?" + encodedRiderName;
    }
}

export default function Page({ searchParams }) {
    const pathname = usePathname();
    const router = useRouter();

    const [searchInput, setSearchInput] = useState("");
    const [pathnameState, setPathnameState] = useState("");
    const [chosenRiders, setChosenRiders] = useState([]);

    const alltimeRankingQuery = useAlltimeRanking();
    const pointSystemQuery = usePointSystem();

    let resultsByRidersQuery
    if (searchParams) {
        resultsByRidersQuery = useResultsByRiders(Object.keys(searchParams).map(i => stringDecoder(i)));
    }

    useEffect(() => {
        if (pathnameState) {
            router.push(pathnameState)
        }
    }, [pathnameState])

    useEffect(() => {
        if (searchParams) {
            setChosenRiders(Object.keys(searchParams).map(i => stringDecoder(i)))
        }
    }, [searchParams])

    let groupedPoints;
    if (resultsByRidersQuery.isSuccess && pointSystemQuery.isSuccess) {
        const riderNames = Object.keys(searchParams).map(i => stringDecoder(i));
        const rider1Results = resultsByRidersQuery.data.filter(i => i.rider == riderNames[0])
        const rider2Results = resultsByRidersQuery.data.filter(i => i.rider == riderNames[1])

        const categories = ["Etapesejre", "Endagsløb", "Klassement", "Mesterskaber", "Bjerg-/pointtrøje"];


        groupedPoints = [rider1Results, rider2Results].map((i, riderIndex) => i.reduce((acc, obj) => {
            let pointData;
            if (obj.race.includes("etape")) {
                pointData = pointSystemQuery.data.find(i => i.raceName == obj.race.split(". e")[1].replace("tape", "etape"));
            } else {
                pointData = pointSystemQuery.data.find(i => i.raceName == obj.race);
            }

            let key;

            if (pointData.raceName.includes("etape")) {
                key = "Etapesejre"
            } else if (pointData.category.includes("WTC") || pointData.category.includes("Monument")) {
                key = "Endagsløb"
            } else if (pointData.category.includes("WTT") || pointData.category.includes("Tour de France") && !obj.race.includes("etape") && !obj.race.includes("Pointtrøje") && !obj.race.includes("Bjergtrøje") || pointData.category.includes("Grand Tour") && !obj.race.includes("etape") && !obj.race.includes("Pointtrøje") && !obj.race.includes("Bjergtrøje")) {
                key = "Klassement"
                console.log(obj)
            } else if (pointData.category.includes("Nationale mesterskaber") || pointData.category.includes("OL") || pointData.category.includes("VM") || pointData.category.includes("EM")) {
                key = "Mesterskaber"
            } else {
                key = "Bjerg-/pointtrøje"
            }

            const currRace = acc[key] ?? 0;

            return {
                ...acc,
                [key]: currRace + pointData.points
            }
        }, {}))

        groupedPoints.map((i, index) => {
            categories.map(j => {
                if (!Object.keys(i).includes(j)) {
                    groupedPoints[index][j] = 0;
                }
            })
        })
    }

    return (
        <div className="compare-page-container">
            <h2>Sammenlign ryttere eller nationer</h2>
            <div className="compare-search-container">
                <input type="text" name="compare-rider-nation-search" id="compare-search-input" placeholder="Søg efter ryttere eller nationer..." value={searchInput} onChange={e => setSearchInput(e.target.value)} disabled={Object.keys(searchParams).length > 1} />
                <ul className="search-output-container">
                    {alltimeRankingQuery.isSuccess && Object.keys(searchParams).length < 2 && searchInput.length > 2 && alltimeRankingQuery.data.filter(i => i.fullName.toLowerCase().includes(searchInput.toLowerCase())).sort((a, b) => b.points - a.points).map(rider => {
                        return (
                            <li onClick={() => setPathnameState(e => searchOutputClickHandler(e, rider.fullName, pathname))}>{rider.fullName}</li>
                        )
                    })}
                </ul>
            </div>

            {alltimeRankingQuery.isSuccess && chosenRiders.map(rider => {
                const ranking = numerizeRanking(alltimeRankingQuery.data)
                const activeRanking = numerizeRanking(alltimeRankingQuery.data.filter(i => i.active == true))
                const rankingByNation = numerizeRanking(alltimeRankingQuery.data.filter(i => i.nation == alltimeRankingQuery.data.find(j => j.fullName == rider).nation))
                return <ComparisonRiderProfile riderName={rider} alltimeRanking={ranking} activeRanking={activeRanking} rankingByNation={rankingByNation} />
            })}

            {/* <RadarChart ridersData={groupedPoints} /> */}
        </div>
    )
}