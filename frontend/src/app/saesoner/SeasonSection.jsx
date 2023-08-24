import TableSkeleton from "@/components/TableSkeleton";
import numerizeRanking from "@/utils/numerizeRanking";
import { useAlltimeRanking, usePointSystem, useResultsByYear } from "@/utils/queryHooks";
import { useSearchParams } from "next/navigation"
import "../../../node_modules/flag-icons/css/flag-icons.min.css"
import Link from "next/link";
import { nationEncoder, stringEncoder } from "@/components/stringHandler";
import { useState } from "react";
import { IoChevronDownOutline } from "react-icons/io5";


export default function SeasonSection() {
    const searchParams = useSearchParams();
    const selectedSeason = searchParams.toString().replace("=", "");

    const alltimeRankingQuery = useAlltimeRanking()
    const alltimeRanking = alltimeRankingQuery?.isSuccess && numerizeRanking(alltimeRankingQuery.data)
    const resultsQuery = useResultsByYear(selectedSeason);
    const pointSystemQuery = usePointSystem();

    const [resultsSpoiler, setResultsSpoiler] = useState(null);

    let seasonResults;
    let seasonRidersRanked;
    if (resultsQuery?.isSuccess && pointSystemQuery?.isSuccess) {
        seasonResults = resultsQuery.data.reduce((acc, res) => {
            const race = res.race.includes("etape") ? res.race.split(". ")[1] : res.race;
            const rider = res.rider;
            const points = pointSystemQuery.data.find(i => i.raceName == race).points;
            const curRider = acc[rider] ?? { points: 0, results: [] };

            return { ...acc, [rider]: { points: curRider["points"] + points, results: [...curRider["results"], race] } }
        }, {})

        seasonRidersRanked = numerizeRanking(Object.keys(seasonResults).sort((a, b) => seasonResults[b].points - seasonResults[a].points).map(i => { return { fullName: i, points: seasonResults[i]["points"] } }))
    }

    return (
        <div>
            <div className="table">
                <div className="table-header">
                    <p><span className="media">Nr.</span><span>Placering</span></p>
                    <p>All time placering</p>
                    <p>Rytter</p>
                    <p>Nationalitet</p>
                    <p>Point</p>
                </div>

                <div className="table-content">
                    {seasonRidersRanked && alltimeRankingQuery?.isSuccess ?
                        seasonRidersRanked.map((i, index) => {
                            const riderNationData = alltimeRanking.find(j => j.fullName.toLowerCase() == i.fullName.toLowerCase())
                            const riderResults = seasonResults[i.fullName]["results"].reduce((acc, res) => {
                                const key = res.includes("førertrøjen") ? res.split("dag i ")[1] : res;
                                const curRes = acc[key] ?? { amount: 0, points: 0 };
                                const points = pointSystemQuery.data.find(j => j.raceName == res).points;

                                return { ...acc, [key]: { amount: curRes["amount"] + 1, points: curRes["points"] + points } }
                            }, {})

                            const nameArr = i.fullName.split(/ (.*)/);

                            if (riderNationData !== undefined) {
                                return (
                                    <div key={index} className="table-row">
                                        <div className="row-content">
                                            <p>{i.currentRank}</p>
                                            <p>{riderNationData.currentRank}</p>
                                            <p className='table-name-reversed'><Link href={"/rytter/" + stringEncoder(i.fullName)}><span className={'media fi fi-' + riderNationData.nationFlagCode}></span><span className='last-name'>{nameArr[1]} </span><span className='first-name'>{nameArr[0]}</span></Link></p>
                                            <p><Link href={"/nation/" + nationEncoder(riderNationData.nation)}><span className={"fi fi-" + riderNationData.nationFlagCode}></span>{riderNationData.nation}</Link></p>
                                            <p>{i.points}</p>
                                            <p onClick={() => setResultsSpoiler(e => e == index ? null : index)} className={index == resultsSpoiler ? "expand-btn show" : "expand-btn"}><IoChevronDownOutline /></p>
                                        </div>
                                        <div className={index == resultsSpoiler ? "row-expansion show" : "row-expansion"}>
                                            <h4>Resultater:</h4>
                                            <div>
                                                {riderResults && Object.keys(riderResults).sort((a, b) => riderResults[b]["points"] - riderResults[a]["points"]).map((res, resIndex) => {
                                                    return (
                                                        <p key={resIndex}>{riderResults[res]["amount"] > 1 && <span>{riderResults[res]["amount"] + "x"}</span>}{res.split(" (")[0]}</p>
                                                    )
                                                })}
                                            </div>
                                        </div>
                                    </div>
                                )
                            }
                        })
                        : <TableSkeleton />}
                </div>
            </div>
        </div>
    )
}