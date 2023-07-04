"use client";

import RankingLinkHeader from "@/components/RankingLinkHeader";
import { nationEncoder } from "@/components/stringHandler";
import Link from "next/link";
import numerizeRanking from "@/utils/numerizeRanking";
import useStore from "@/utils/store";
import "flag-icons/css/flag-icons.min.css";
import { useEffect, useState } from "react";
import TableSkeleton from "@/components/TableSkeleton";
import SectionLinkButton from "@/components/SectionLinkButton";
import { baseUrl } from "@/utils/baseUrl";
import { supabase } from "@/utils/supabase";

async function fetchData() {
    let { data: nationsRanking } = await supabase
        .from("nationsRanking")
        .select("*");

    return {
        nationsRanking: numerizeRanking(nationsRanking),
        activeRanking: numerizeRanking(nationsRanking.filter(i => i.activePoints !== null).map(i => { return { ...i, points: i.activePoints, numberOfRiders: i.activeNumberOfRiders } }))
    }
}

export default function NationRanking() {
    const [isLoading, setIsLoading] = useState(true);
    const [nationsRanking, setNationsRanking] = useState([]);
    const [activeRanking, setActiveRanking] = useState([]);


    useEffect(() => {
        setIsLoading(true)
        fetchData().then(res => {
            setNationsRanking(res.nationsRanking)
            setActiveRanking(res.activeRanking)
        })
        setIsLoading(false)
    }, [])


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
                    {isLoading ? <TableSkeleton /> :
                        <div className="table-content">
                            {nationsRanking.map((nation, index) => {
                                const activeList = activeRanking.find(i => i.nation == nation.nation)

                                let className = "table-row";
                                if (["Moldova", "Sovjetunionen", "Østtyskland"].includes(nation.nation)) {
                                    className = "table-row inactive";
                                }

                                return (
                                    <div key={index} className={className}>
                                        <p>{nation.currentRank} <span className="table-previous-span">{activeList && activeList.currentRank}</span></p>
                                        <p>{nation.points.toLocaleString("de-DE")} <span className="table-previous-span">{nation.activePoints && nation.activePoints.toLocaleString("de-DE")}</span></p>
                                        <p><Link href={"/nation/" + nationEncoder(nation.nation)}><span className={"fi fi-" + nation.flagCode}></span>{nation.nation}</Link></p>
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