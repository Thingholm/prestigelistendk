"use client"

import { nationEncoder, stringDecoder, stringEncoder } from "@/components/stringHandler";
import { useAlltimeRanking, usePointSystem, useResultsByRider, useResultsByRiders } from "@/utils/queryHooks"
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import numerizeRanking from "@/utils/numerizeRanking";
import RiderImage from "../rytter/[fullName]/RiderImage";
import RadarChart from "./RadarChart";
import AgeChart from "./AgeChart";
import { IoRemoveCircleOutline } from "react-icons/io5";
import SectionLinkButton from "@/components/SectionLinkButton";
import { baseUrl } from "@/utils/baseUrl";
// import RadarChart from "./RadarChart";

function searchOutputClickHandler(state, rider, pathname) {
    const encodedRiderName = stringEncoder(rider);
    console.log(state)
    if (state.length == 1) {
        return pathname + "?" + stringEncoder(state[0]) + "&" + encodedRiderName
    } else {
        return pathname + "?" + encodedRiderName;
    }
}

function higherOrLowerHandler(cur, other) {
    if (cur !== "-" && other !== "-") {
        if (cur > other) {
            return "higher"
        } else if (cur < other) {
            return "lower"
        }
    }
}

export default function Page({ searchParams }) {
    const pathname = usePathname();
    const router = useRouter();

    const containerRef = useRef(null);

    const [searchInput, setSearchInput] = useState("");
    const [pathnameState, setPathnameState] = useState("");
    const [chosenRiders, setChosenRiders] = useState([]);
    const [searchBarActive, setSearchBarActive] = useState(false)

    const alltimeRankingQuery = useAlltimeRanking();
    const pointSystemQuery = usePointSystem();


    const resultsByRidersQuery = useResultsByRiders(Object.keys(searchParams).map(i => alltimeRankingQuery?.data?.find(j => j.fullName.toLowerCase() == stringDecoder(i).toLowerCase()).fullName))

    useEffect(() => {
        if (pathnameState) {
            router.push(pathnameState)
        }
        console.log("pathname" + pathnameState)
    }, [pathnameState])

    useEffect(() => {
        if (searchParams) {
            setChosenRiders(Object.keys(searchParams).map(i => stringDecoder(i)))
        }
        console.log("searchParams" + searchParams)
    }, [searchParams])

    useEffect(() => {
        function handleOutsideClick(event) {
            if (containerRef.current && !containerRef.current.contains(event.target)) {
                setSearchBarActive(false);
            } else {
                setSearchBarActive(true);
            }
        }

        document.addEventListener("mousedown", handleOutsideClick, true);
        return () => {
            document.removeEventListener("mousedown", handleOutsideClick, true);
        }
    }, [containerRef])

    let groupedPoints;
    let greatestResults;
    const riderNoR = [0, 0]

    if (Object.keys(searchParams)?.length == 2 && resultsByRidersQuery?.isSuccess && pointSystemQuery.isSuccess) {
        const riderNames = Object.keys(searchParams).map(i => stringDecoder(i));
        var rider1Results = resultsByRidersQuery.data.filter(i => i.rider.toLowerCase() == riderNames[0].toLowerCase())
        var rider2Results = resultsByRidersQuery.data.filter(i => i.rider.toLowerCase() == riderNames[1].toLowerCase())

        const categories = ["Etapesejre", "Endagsløb", "Klassement", "Mesterskaber", "Bjerg-/pointtrøje"];

        groupedPoints = [rider1Results, rider2Results].map((i, riderIndex) => i.reduce((acc, obj) => {
            let pointData;
            if (obj.race.includes("etape")) {
                pointData = pointSystemQuery.data.find(i => i.raceName == obj.race.split(". e")[1].replace("tape", "etape"));
            } else {
                pointData = pointSystemQuery.data.find(i => i.raceName == obj.race);
            }

            if (!obj.race.includes("førertrøjen")) {
                riderNoR[riderIndex] += 1
            }

            let key;

            if (pointData.raceName.includes("etape")) {
                key = "Etapesejre"
            } else if (pointData.category.includes("WTC") || pointData.category.includes("Monument")) {
                key = "Endagsløb"
            } else if (pointData.category.includes("WTT") || pointData.category.includes("Tour de France") && !obj.race.includes("etape") && !obj.race.includes("Pointtrøje") && !obj.race.includes("Bjergtrøje") || pointData.category.includes("Grand Tour") && !obj.race.includes("etape") && !obj.race.includes("Pointtrøje") && !obj.race.includes("Bjergtrøje")) {
                key = "Klassement"
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

        greatestResults = [rider1Results, rider2Results].map(i => {
            const resObj = i.map(j => {
                let race = j.race;
                if (race.includes("etape")) {
                    race = race.split(". ")[1]
                }
                return pointSystemQuery.data.find(k => k.raceName == race)
            }).reduce((acc, obj) => {
                const key = obj.raceName.includes("dag i førertrøjen") ? obj.raceName.split(" da")[1].replace("g i", "dag i") : obj.raceName
                const curRace = acc[key] ?? { points: 0, amount: 0 }

                return { ...acc, [key]: { points: curRace["points"] + obj.points, amount: curRace["amount"] + 1 } }
            }, {})

            return Object.keys(resObj).map(j => { return { race: j, ...resObj[j] } }).sort((a, b) => b.points - a.points)
        })
    }

    let ridersObject = [];

    if (groupedPoints) {
        alltimeRankingQuery.isSuccess && chosenRiders.map((rider, index) => {
            const ranking = numerizeRanking(alltimeRankingQuery.data)
            const activeRanking = numerizeRanking(alltimeRankingQuery.data.filter(i => i.active == true))
            const rankingByNation = numerizeRanking(alltimeRankingQuery.data.filter(i => i.nation == alltimeRankingQuery.data.find(j => j.fullName.toLowerCase() == rider.toLowerCase()).nation))
            ridersObject.push(
                {
                    riderData: ranking.find(i => i.fullName.toLowerCase() == rider.toLowerCase()),
                    activeRanking: activeRanking,
                    rankingByNation: rankingByNation,
                    groupedPoints: groupedPoints[index],
                }
            )
        })
    }

    return (
        <div className="compare-page-container">
            <h2>Sammenlign ryttere <SectionLinkButton link={baseUrl + "/sammenlign"} sectionName={"Sammenlign ryttere"} /></h2>
            <div className="compare-search-container" ref={containerRef}>
                <input type="text" name="compare-rider-nation-search" id="compare-search-input" placeholder="Søg efter ryttere..." value={searchInput} onChange={e => setSearchInput(e.target.value)} disabled={Object.keys(searchParams).length > 1} />
                <ul className={searchBarActive ? "search-output-container show" : "search-output-container"}>
                    {alltimeRankingQuery.isSuccess && Object.keys(searchParams).length < 2 && searchInput.length > 2 && alltimeRankingQuery.data.filter(i => i.fullName.toLowerCase().includes(searchInput.toLowerCase())).sort((a, b) => b.points - a.points).map((rider, index) => {
                        return (
                            <li key={index} onClick={() => setPathnameState(e => searchOutputClickHandler(chosenRiders, rider.fullName, pathname))}>{rider.fullName}</li>
                        )
                    })}
                </ul>
            </div>


            <div className="comparison-container">
                <div className="comparison-rider-profile">
                    <div className="comparison-flex-container">
                        <div>
                            {chosenRiders[0] &&
                                <div>
                                    <button onClick={() => setPathnameState((ridersObject[1] ? pathname + "?" + stringEncoder(ridersObject[1]?.riderData.fullName) : pathname))}><IoRemoveCircleOutline />Fjern rytter</button>
                                    <RiderImage riderInfo={{ fullName: chosenRiders[0] }} />
                                    <h3><Link href={"/rytter/" + stringEncoder(chosenRiders[0])}>{chosenRiders[0]}</Link></h3>
                                </div>
                            }
                        </div>
                        <div>

                        </div>
                        <div>
                            {ridersObject[1] &&
                                <div>
                                    <button onClick={() => setPathnameState(pathname + "?" + stringEncoder(ridersObject[0].riderData.fullName))}><IoRemoveCircleOutline />Fjern rytter</button>
                                    <RiderImage riderInfo={ridersObject[1].riderData} />
                                    <h3><Link href={"/rytter/" + stringEncoder(ridersObject[1].riderData.fullName)}>{ridersObject[1].riderData.fullName}</Link></h3>
                                </div>
                            }
                        </div>
                    </div>
                </div>

                <div className="rider-info">
                    <h4>Rytterinformation</h4>
                    <div className="comparison-flex-container">
                        <div>
                            {ridersObject[0] &&
                                <div>
                                    <p><Link href={"/nation/" + nationEncoder(ridersObject[0].riderData.nation)}><span className={"fi fi-" + ridersObject[0].riderData.nationFlagCode}></span>{ridersObject[0].riderData.nation}</Link></p>
                                    <p>{ridersObject[0].riderData.currentTeam ? ridersObject[0].riderData.currentTeam : "-"}</p>
                                    <p><Link href={"listen?yearFilterRange=single&bornBefore=" + ridersObject[0].riderData.birthYear}>{ridersObject[0].riderData.birthYear}</Link></p>
                                </div>
                            }
                        </div>
                        <div>
                            <div>
                                <p>Nationalitet</p>
                                <p>Hold</p>
                                <p>Årgang</p>
                            </div>
                        </div>
                        <div>
                            {ridersObject[1] &&
                                <div>
                                    <p><Link href={"/nation/" + nationEncoder(ridersObject[1].riderData.nation)}><span className={"fi fi-" + ridersObject[1].riderData.nationFlagCode}></span>{ridersObject[1].riderData.nation}</Link></p>
                                    <p>{ridersObject[1].riderData.currentTeam ? ridersObject[1].riderData.currentTeam : "-"}</p>
                                    <p><Link href={"listen?yearFilterRange=single&bornBefore=" + ridersObject[1].riderData.birthYear}>{ridersObject[1].riderData.birthYear}</Link></p>
                                </div>
                            }
                        </div>
                    </div>
                </div>

                <div className="comparison-stats">
                    <h4>Point/resultater</h4>
                    <div className="comparison-flex-container">
                        <div>
                            {ridersObject[0] &&
                                <div>
                                    <p className={higherOrLowerHandler(ridersObject[0].riderData.points, ridersObject[1].riderData.points)}>
                                        {ridersObject[0].riderData.points}
                                    </p>
                                    <p className={higherOrLowerHandler(ridersObject[1].riderData.currentRank, ridersObject[0].riderData.currentRank)}>
                                        {ridersObject[0].riderData.currentRank}
                                    </p>
                                    <p className={ridersObject[1].riderData.active && ridersObject[0].riderData.active && higherOrLowerHandler(ridersObject[1].riderData.active ? ridersObject[1].activeRanking.find(i => i.fullName.toLowerCase() == ridersObject[1].riderData.fullName.toLowerCase()).currentRank : "-", ridersObject[1].riderData.active ? ridersObject[1].activeRanking.find(i => i.fullName == ridersObject[0].riderData.fullName).currentRank : "-")}>
                                        {ridersObject[0].riderData.active ? ridersObject[0].activeRanking.find(i => i.fullName == ridersObject[0].riderData.fullName).currentRank : "-"}</p>
                                    <p className={higherOrLowerHandler(riderNoR[0], riderNoR[1])}>
                                        {riderNoR[0]}
                                    </p>
                                </div>
                            }
                        </div>
                        <div>
                            <div>
                                <p>Point</p>
                                <p>Placering all time</p>
                                <p>Placering (kun aktive)</p>
                                <p>Antal resultater</p>
                            </div>
                        </div>
                        <div>
                            {ridersObject[1] &&
                                <div>
                                    <p className={higherOrLowerHandler(ridersObject[1].riderData.points, ridersObject[0].riderData.points)}>
                                        {ridersObject[1].riderData.points}
                                    </p>
                                    <p className={higherOrLowerHandler(ridersObject[0].riderData.currentRank, ridersObject[1].riderData.currentRank)}>
                                        {ridersObject[1].riderData.currentRank}
                                    </p>
                                    <p className={ridersObject[1].riderData.active && ridersObject[0].riderData.active && higherOrLowerHandler(ridersObject[0].riderData.active ? ridersObject[0].activeRanking.find(i => i.fullName.toLowerCase() == ridersObject[0].riderData.fullName.toLowerCase()).currentRank : "-", ridersObject[0].riderData.active ? ridersObject[0].activeRanking.find(i => i.fullName.toLowerCase() == ridersObject[1].riderData.fullName.toLowerCase()).currentRank : "-")}>
                                        {ridersObject[1].riderData.active ? ridersObject[1].activeRanking.find(i => i.fullName.toLowerCase() == ridersObject[1].riderData.fullName.toLowerCase()).currentRank : "-"}</p>
                                    <p className={higherOrLowerHandler(riderNoR[1], riderNoR[0])}>
                                        {riderNoR[1]}
                                    </p>
                                </div>
                            }
                        </div>
                    </div>
                </div>

                <div className="comparison-stats-cat">
                    <h4>Kategoriserede point</h4>
                    <div className="comparison-flex-container">
                        <div>
                            {ridersObject[0] &&
                                <div>
                                    <p className={higherOrLowerHandler(ridersObject[0].groupedPoints["Klassement"], ridersObject[1].groupedPoints["Klassement"])}>
                                        {ridersObject[0].groupedPoints["Klassement"]}
                                    </p>
                                    <p className={higherOrLowerHandler(ridersObject[0].groupedPoints["Etapesejre"], ridersObject[1].groupedPoints["Etapesejre"])}>
                                        {ridersObject[0].groupedPoints["Etapesejre"]}
                                    </p>
                                    <p className={higherOrLowerHandler(ridersObject[0].groupedPoints["Endagsløb"], ridersObject[1].groupedPoints["Endagsløb"])}>
                                        {ridersObject[0].groupedPoints["Endagsløb"]}
                                    </p>
                                    <p className={higherOrLowerHandler(ridersObject[0].groupedPoints["Mesterskaber"], ridersObject[1].groupedPoints["Mesterskaber"])}>
                                        {ridersObject[0].groupedPoints["Mesterskaber"]}
                                    </p>
                                    <p className={higherOrLowerHandler(ridersObject[0].groupedPoints["Bjerg-/pointtrøje"], ridersObject[1].groupedPoints["Bjerg-/pointtrøje"])}>
                                        {ridersObject[0].groupedPoints["Bjerg-/pointtrøje"]}
                                    </p>
                                </div>
                            }
                        </div>
                        <div>
                            <div>
                                <p>Klassement</p>
                                <p>Etapesejre</p>
                                <p>Endagsløb</p>
                                <p>Mesterskaber</p>
                                <p>Bjerg-/pointtrøjer</p>
                            </div>
                        </div>
                        <div>
                            {ridersObject[1] &&
                                <div>
                                    <p className={higherOrLowerHandler(ridersObject[1].groupedPoints["Klassement"], ridersObject[0].groupedPoints["Klassement"])}>
                                        {ridersObject[1].groupedPoints["Klassement"]}
                                    </p>
                                    <p className={higherOrLowerHandler(ridersObject[1].groupedPoints["Etapesejre"], ridersObject[0].groupedPoints["Etapesejre"])}>
                                        {ridersObject[1].groupedPoints["Etapesejre"]}
                                    </p>
                                    <p className={higherOrLowerHandler(ridersObject[1].groupedPoints["Endagsløb"], ridersObject[0].groupedPoints["Endagsløb"])}>
                                        {ridersObject[1].groupedPoints["Endagsløb"]}
                                    </p>
                                    <p className={higherOrLowerHandler(ridersObject[1].groupedPoints["Mesterskaber"], ridersObject[0].groupedPoints["Mesterskaber"])}>
                                        {ridersObject[1].groupedPoints["Mesterskaber"]}
                                    </p>
                                    <p className={higherOrLowerHandler(ridersObject[1].groupedPoints["Bjerg-/pointtrøje"], ridersObject[0].groupedPoints["Bjerg-/pointtrøje"])}>
                                        {ridersObject[1].groupedPoints["Bjerg-/pointtrøje"]}
                                    </p>
                                </div>
                            }
                        </div>
                    </div>
                </div>

                {greatestResults && ridersObject && <div className="greatest-results-comparison">
                    <h4>Største resultater</h4>
                    <div className="comparison-flex-container">
                        <div>
                            <h4 className="media">{ridersObject[0]?.riderData.fullName}</h4>
                            {greatestResults[0].slice(0, 10).map((i, k) => {
                                return (
                                    <p key={k}><span>{i.amount > 1 && i.amount + "x"}</span> {i.race.split(" (")[0]}</p>
                                )
                            })}
                        </div>
                        <div></div>
                        <div>
                            <h4 className="media">{ridersObject[1]?.riderData.fullName}</h4>
                            {greatestResults[1].slice(0, 10).map((i, k) => {
                                return (
                                    <p key={k}><span className="media">{i.amount > 1 && i.amount + "x"}</span>{i.race.split(" (")[0]} <span>{i.amount > 1 && "x" + i.amount}</span></p>
                                )
                            })}
                        </div>
                    </div>
                </div>}

                <div className="chart-container">
                    <h3>Point optjent efter alder</h3>
                    <p>Alder er opgjort som det antal år, man fylder, året hvor resultaterne er opnået.</p>

                    {ridersObject && ridersObject.length == 2 && rider1Results && rider2Results && <AgeChart data={ridersObject} riderResults={[rider1Results, rider2Results]} pointSystem={pointSystemQuery.data} />}

                    {/* {ridersObject && <RadarChart data={ridersObject} />} */}
                </div>

            </div>
        </div>
    )
}