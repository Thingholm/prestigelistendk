"use client";

import { nationEncoder, stringEncoder } from "@/components/stringHandler";
import numerizeRanking from "@/utils/numerizeRanking";
import { useNationRanking } from "@/utils/queryHooks";
import Link from "next/link";
import { useEffect, useState } from "react";

function numerizeRankingByPPR(rankingInput) {
    const rankingList = rankingInput.map(i => { return { ...i, pointsPerRider: Math.round(i.points / i.numberOfRiders * 10) / 10 } })

    const sortedRanking = rankingList.sort(function (a, b) { return b.pointsPerRider - a.pointsPerRider });

    const rankedRanking = sortedRanking.map((obj, index) => {
        let rank = index + 1;

        if (index > 0 && obj.pointsPerRider == sortedRanking[index - 1].pointsPerRider) {
            rank = sortedRanking.findIndex(i => obj.pointsPerRider == i.pointsPerRider) + 1;
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

export default function NationRankingTable(props) {
    const nationsRankingQuery = useNationRanking();
    const nationsRanking = nationsRankingQuery.data;

    const [rankingFilter, setRankingFilter] = useState({
        sortBy: "point",
        filterBy: "alle",
    });

    const [filteredRanking, setFilteredRanking] = useState();
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        setRankingFilter({ ...rankingFilter, ...props.searchParams })
        if (nationsRankingQuery.isSuccess) {
            setFilteredRanking(numerizeRanking(nationsRanking));
        }
    }, [])

    useEffect(() => {
        setIsLoading(true);
        if (nationsRankingQuery.isSuccess) {
            let newFilteredRanking = nationsRanking;

            if (rankingFilter.filterBy == "aktive") {
                newFilteredRanking = nationsRanking.filter(i => i.activePoints !== null).map(i => { return { ...i, points: i.activePoints, numberOfRiders: i.activeNumberOfRiders } })
            }

            if (rankingFilter.sortBy == "point") {
                newFilteredRanking = numerizeRanking(newFilteredRanking);
            } else if (rankingFilter.sortBy == "pointPerRytter") {
                newFilteredRanking = numerizeRankingByPPR(newFilteredRanking);
            } else if (rankingFilter.sortBy == "antalRyttere") {
                newFilteredRanking = numerizeRankingByNoR(newFilteredRanking);
            }
            setFilteredRanking(newFilteredRanking);

        }

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
                            <label htmlFor="nation-sort-by-points-per-rider">Point pr. rytter</label>
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
                    </div>
                </div>
            </div>

            <div className="table">
                <div className="table-header">
                    <p>Nr.</p>
                    <p>Point</p>
                    <p>Nation</p>
                    <p>Største ryttere</p>
                    <p>Point pr. rytter</p>
                    <p>Antal ryttere</p>
                </div>
                <div className="table-content">
                    <span className={"loading-overlay " + String(isLoading)}></span>
                    {filteredRanking?.map((nation, index) => {
                        let greatestRiders = [];

                        if (rankingFilter.filterBy !== "aktive") {
                            greatestRiders = nation.greatestRiders.split(", ")
                        } else if (rankingFilter.filterBy == "aktive" && nation.activeGreatestRiders) {
                            greatestRiders = nation.activeGreatestRiders.split(", ")
                        }

                        let className = "table-row"

                        if (["Sovjetunionen", "Østtyskland"].includes(nation.nation)) {
                            className = "table-row inactive"
                        }

                        return (
                            <div key={index} className={className}>
                                <p>{nation.currentRank}</p>
                                <p>{nation.points.toLocaleString("de-DE")}</p>
                                <p><Link href={"nation/" + nationEncoder(nation.nation)}><span className={"fi fi-" + nation.flagCode}></span>{nation.nation}</Link></p>
                                <p>{greatestRiders.map((i, index) => { if (index == greatestRiders.length - 1) { return (<Link key={index} href={"rytter/" + stringEncoder(i)}>{i}</Link>) } else { return (<Link key={index} href={"rytter/" + stringEncoder(i)}>{i + ", "}</Link>) } })}</p>
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