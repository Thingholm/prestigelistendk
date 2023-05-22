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

export default function NationRanking() {
    const [isLoading, setIsLoading] = useState(true);
    const [nationRanking, setNationRanking] = useState();
    const rankingAlltime = useStore((state) => state.rankingAlltime);

    useEffect(() => {
        setIsLoading(true);
        const nationsGrouped = rankingAlltime.reduce((acc, curr) => {
            const key = curr["nation"];
            const curPoints = acc[key] ?? { points: 0, numberOfRiders: 0 };

            return { ...acc, [key]: { points: curPoints.points + curr.points, nationFlagCode: curr.nationFlagCode, numberOfRiders: curPoints.numberOfRiders + 1 } };
        }, {});

        const nationsActiveGroup = rankingAlltime.filter(i => i.active).reduce((acc, curr) => {
            const key = curr["nation"];
            const curPoints = acc[key] ?? { points: 0, };

            return { ...acc, [key]: { points: curPoints.points + curr.points, } };
        }, {});

        const nationsActiveRank = numerizeRanking(Object.keys(nationsActiveGroup).map(n => { return { ...nationsActiveGroup[n], nation: n } }));

        const nationRanking = numerizeRanking(Object.keys(nationsGrouped).map(n => {
            let activeRank = "-";

            if (nationsActiveRank.find(i => i.nation == n)) {
                activeRank = nationsActiveRank.find(i => i.nation == n)
            }

            return {
                ...nationsGrouped[n],
                nation: n,
                activeRank: activeRank.currentRank,
                activePoints: activeRank.points,
            }
        }));

        setNationRanking(nationRanking);
        setIsLoading(false);
    }, [rankingAlltime])

    return (
        <div className="landing-nations-ranking-section">
            <RankingLinkHeader title="Største nationer" link="/nationer" sectionLink={<SectionLinkButton link={baseUrl + "/#stoerste-nationer"} sectionName={"Største nationer"} />} />
            <div className="table">
                <div className="table-header">
                    <p>Nr. <span className="table-previous-span">(aktive)</span></p>
                    <p>Point <span className="table-previous-span">(aktive)</span></p>
                    <p>Nation</p>
                    <p>Pt. pr. rytter</p>
                    <p>Antal ryttere</p>

                </div>
                {isLoading ? <TableSkeleton /> :
                    <div className="table-content">
                        {nationRanking.map(nation => {
                            return (
                                <div className="table-row">
                                    <p>{nation.currentRank} <span className="table-previous-span">{nation.activeRank}</span></p>
                                    <p>{nation.points} <span className="table-previous-span">{nation.activePoints}</span></p>
                                    <p><Link href={"/nation/" + nationEncoder(nation.nation)}><span className={"fi fi-" + nation.nationFlagCode}></span>{nation.nation}</Link></p>
                                    <p>{Math.round(nation.points / nation.numberOfRiders * 10) / 10}</p>
                                    <p>{nation.numberOfRiders}</p>
                                </div>
                            )
                        })}
                    </div>
                }
            </div>
        </div>
    )
}