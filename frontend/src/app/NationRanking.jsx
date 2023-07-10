"use client";

import RankingLinkHeader from "@/components/RankingLinkHeader";
import { nationEncoder } from "@/components/stringHandler";
import Link from "next/link";
import numerizeRanking from "@/utils/numerizeRanking";
import "flag-icons/css/flag-icons.min.css";
import { useEffect, useState } from "react";
import TableSkeleton from "@/components/TableSkeleton";
import SectionLinkButton from "@/components/SectionLinkButton";
import { baseUrl } from "@/utils/baseUrl";
import { useNationRanking } from "@/utils/queryHooks";

export default function NationRanking() {
    const [nationsRanking, setNationsRanking] = useState([]);
    const [activeRanking, setActiveRanking] = useState([]);

    const nationRankingQuery = useNationRanking();

    useEffect(() => {
        if (nationRankingQuery.isSuccess) {
            setNationsRanking(
                numerizeRanking(nationRankingQuery.data)
            )

            setActiveRanking(
                numerizeRanking(
                    nationRankingQuery.data
                        .filter(i => i.activePoints > 0)
                        .map(i => {
                            return { ...i, points: i.activePoints, numberOfRiders: i.activeNumberOfRiders }
                        })
                )
            )
        }
    }, [nationRankingQuery])


    return (
        <div className="landing-nations-ranking-section">
            <RankingLinkHeader title="Største nationer" link="/nationer" sectionLink={<SectionLinkButton link={baseUrl + "/#stoerste-nationer"} sectionName={"Største nationer"} />} />
            <div className="table-shadow-container">
                <div className="table">
                    <div className="table-header">
                        <p>Nr. <span className="table-previous-span">kun aktive</span></p>
                        <p>Point <span className="table-previous-span">kun aktive</span></p>
                        <p>Nation</p>
                        <p>Point pr. rytter</p>
                        <p>Antal ryttere <span className="table-previous-span">kun aktive</span></p>

                    </div>
                    {nationRankingQuery.isLoading ? <TableSkeleton /> :
                        <div className="table-content">
                            {nationsRanking.map((nation, index) => {
                                const activeList = activeRanking.find(i => i.nation == nation.nation)

                                let className = "table-row";
                                if (["Moldova", "Sovjetunionen", "Østtyskland"].includes(nation.nation)) {
                                    className = "table-row inactive";
                                }

                                let flagCode = "fi fi-" + nation.flagCode;

                                if (nation.nation == "Sovjetunionen") {
                                    flagCode = "custom-flag f-sovjet"
                                } else if (nation.nation == "Østtyskland") {
                                    flagCode = "custom-flag f-ddr"
                                }

                                return (
                                    <div key={index} className={className}>
                                        <p>{nation.currentRank} <span className="table-previous-span">{activeList && activeList.currentRank}</span></p>
                                        <p>{nation.points.toLocaleString("de-DE")} <span className="table-previous-span">{nation.activePoints && nation.activePoints.toLocaleString("de-DE")}</span></p>
                                        <p><Link href={"/nation/" + nationEncoder(nation.nation)}><span className={flagCode}></span>{nation.nation}</Link></p>
                                        <p>{Math.round(nation.points / nation.numberOfRiders * 10) / 10}</p>
                                        <p>{nation.numberOfRiders.toLocaleString("de-DE")} <span className="table-previous-span">{activeList && activeList.numberOfRiders.toLocaleString("de-DE")}</span></p>
                                    </div>
                                )
                            })}
                        </div>
                    }
                </div>
            </div>
        </div>
    )
}