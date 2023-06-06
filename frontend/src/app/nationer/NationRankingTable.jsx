"use client";

import { nationEncoder, stringEncoder } from "@/components/stringHandler";
import numerizeRanking from "@/utils/numerizeRanking";
import Link from "next/link";
import { useEffect, useState } from "react";

function numerizeRankingByPPR(rankingList) {
    const newRanking = rankingList.map(i => { return { ...i, ppr: i.points / i.numberOfRiders } })

    const sortedRanking = newRanking.sort(function (a, b) { return b.ppr - a.ppr });

    const rankedRanking = sortedRanking.map((obj, index) => {
        let rank = index + 1;

        if (index > 0 && obj.ppr == sortedRanking[index - 1].ppr) {
            rank = sortedRanking.findIndex(i => obj.ppr == i.ppr) + 1;
        }

        return ({ ...obj, currentRank: rank })
    });

    return (rankedRanking)
}

function numerizeRankingByNoR(rankingList) {
    const sortedRanking = rankingList.sort(function (a, b) { return b.numberOfRiders - a.numberOfRiders });

    const rankedRanking = sortedRanking.map((obj, index) => {
        let rank = index + 1;

        if (index > 0 && obj.numberOfRiders == sortedRanking[index - 1].numberOfRiders) {
            rank = sortedRanking.findIndex(i => obj.numberOfRiders == i.numberOfRiders) + 1;
        }

        return ({ ...obj, currentRank: rank })
    });

    return (rankedRanking)
}
{/* 625 */ }
export default function NationRankingTable(props) {
    const nationRanking = props.nationRanking;
    const alltimeRanking = props.alltimeRanking;
    const [rankingFilter, setRankingFilter] = useState({
        sortBy: "point",
        filterBy: "alle",
    });
    const [filteredRanking, setFilteredRanking] = useState(numerizeRanking(nationRanking));
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        setRankingFilter({ ...rankingFilter, ...props.searchParams })
    }, [])

    useEffect(() => {
        setIsLoading(true);
        let newFilteredRanking = nationRanking;

        if (rankingFilter.filterBy == "aktive") {
            const nationsGrouped = alltimeRanking.filter(i => i.active == true).reduce((acc, curr) => {
                const key = curr["nation"];
                const curPoints = acc[key] ?? { points: 0, numberOfRiders: 0 };

                return { ...acc, [key]: { points: curPoints.points + curr.points, nationFlagCode: curr.nationFlagCode, numberOfRiders: curPoints.numberOfRiders + 1 } };
            }, {});

            newFilteredRanking = Object.keys(nationsGrouped).map(n => { return { ...nationsGrouped[n], nation: n } })
        } else if (rankingFilter.filterBy == "inaktive") {
            const nationsGrouped = alltimeRanking.filter(i => i.active !== true).reduce((acc, curr) => {
                const key = curr["nation"];
                const curPoints = acc[key] ?? { points: 0, numberOfRiders: 0 };

                return { ...acc, [key]: { points: curPoints.points + curr.points, nationFlagCode: curr.nationFlagCode, numberOfRiders: curPoints.numberOfRiders + 1 } };
            }, {});

            newFilteredRanking = Object.keys(nationsGrouped).map(n => { return { ...nationsGrouped[n], nation: n } })
        }

        if (rankingFilter.sortBy == "point") {
            newFilteredRanking = numerizeRanking(newFilteredRanking);
        } else if (rankingFilter.sortBy == "pointPerRytter") {
            newFilteredRanking = numerizeRankingByPPR(newFilteredRanking);
        } else if (rankingFilter.sortBy == "antalRyttere") {
            newFilteredRanking = numerizeRankingByNoR(newFilteredRanking);
        }

        setFilteredRanking(newFilteredRanking);
        setIsLoading(false);
    }, [rankingFilter])

    return (
        <div className="nation-table-wrapper">
            <div className="nation-ranking-table-filter-container">
                <div className="sort-container">
                    <p>Rangér efter:</p>
                    <div className="sort-options-container">
                        <div className="sort-option">
                            <input
                                type="radio"
                                name="nation-sort-radio"
                                id="nation-sort-by-points"
                                value="point"
                                checked={rankingFilter.sortBy == "point"}
                                onChange={e => { setIsLoading(true); setRankingFilter({ ...rankingFilter, sortBy: e.currentTarget.value }) }
                                } />
                            <label htmlFor="nation-sort-by-points">Point</label>
                        </div>

                        <div className="sort-option">
                            <input
                                type="radio"
                                name="nation-sort-radio"
                                id="nation-sort-by-points-per-rider"
                                value="pointPerRytter"
                                checked={rankingFilter.sortBy == "pointPerRytter"}
                                onChange={e => { setIsLoading(true); setRankingFilter({ ...rankingFilter, sortBy: e.currentTarget.value }) }
                                } />
                            <label htmlFor="nation-sort-by-points-per-rider">Point per rytter</label>
                        </div>

                        <div className="sort-option">
                            <input
                                type="radio"
                                name="nation-sort-radio"
                                id="nation-sort-by-number-of-riders"
                                value="antalRyttere"
                                checked={rankingFilter.sortBy == "antalRyttere"}
                                onChange={e => { setIsLoading(true); setRankingFilter({ ...rankingFilter, sortBy: e.currentTarget.value }) }
                                } />
                            <label htmlFor="nation-sort-by-number-of-riders">Antal ryttere</label>
                        </div>
                    </div>
                </div>

                <div className="filter-container">
                    <p>Filtrér:</p>
                    <div className="filter-options-container">
                        <div className="filter-option">
                            <input
                                type="radio"
                                name="nation-filter-radio"
                                id="nation-filter-all"
                                value="alle"
                                checked={rankingFilter.filterBy == "alle"}
                                onChange={e => { setIsLoading(true); setRankingFilter({ ...rankingFilter, filterBy: e.currentTarget.value }) }}
                            />
                            <label htmlFor="nation-filter-all">Alle ryttere</label>
                        </div>

                        <div className="filter-option">
                            <input
                                type="radio"
                                name="nation-filter-radio"
                                id="nation-filter-active"
                                value="aktive"
                                checked={rankingFilter.filterBy == "aktive"}
                                onChange={e => { setIsLoading(true); setRankingFilter({ ...rankingFilter, filterBy: e.currentTarget.value }) }}
                            />
                            <label htmlFor="nation-filter-active">Aktive ryttere</label>
                        </div>

                        <div className="filter-option">
                            <input
                                type="radio"
                                name="nation-filter-radio"
                                id="nation-filter-inactive"
                                value="inaktive"
                                checked={rankingFilter.filterBy == "inaktive"}
                                onChange={e => { setIsLoading(true); setRankingFilter({ ...rankingFilter, filterBy: e.currentTarget.value }) }}
                            />
                            <label htmlFor="nation-filter-inactive">Inaktive ryttere</label>
                        </div>
                    </div>
                </div>
            </div>

            <div className="table">
                <div className="table-header">
                    <p>Nr.</p>
                    <p>Point</p>
                    <p>Nation</p>
                    <p>Største ryttere</p>
                    <p>Point per rytter</p>
                    <p>Antal ryttere</p>
                </div>
                <div className="table-content">
                    <span className={"loading-overlay " + String(isLoading)}></span>
                    {filteredRanking.map((nation, index) => {
                        const greatestRiders = numerizeRanking(alltimeRanking)
                            .filter(i => i.nation == nation.nation)
                            .filter(i => { if (rankingFilter.filterBy == "aktive") { return i.active == true } else if (rankingFilter.filterBy == "inaktive") { return i.active !== true } else { return i } })
                            .slice(0, 3);

                        return (
                            <div key={index} className="table-row">
                                <p>{nation.currentRank}</p>
                                <p>{nation.points}</p>
                                <p><Link href={"nation/" + nationEncoder(nation.nation)}><span className={"fi fi-" + nation.nationFlagCode}></span>{nation.nation}</Link></p>
                                <p>{greatestRiders.map((i, index) => { if (index == 2) { return (<Link key={index} href={"rytter/" + stringEncoder(i.fullName)}>{i.fullName}</Link>) } else { return (<Link key={index} href={"rytter/" + stringEncoder(i.fullName)}>{i.fullName + ", "}</Link>) } })}</p>
                                <p>{Math.round(nation.points / nation.numberOfRiders * 10) / 10}</p>
                                <p>{nation.numberOfRiders}</p>
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>

    );
}