"use client"

import { useState } from "react";
import { IoChevronBackOutline, IoChevronForwardOutline } from "react-icons/io5";

function simplifyResult(result) {
    if (result.raceName) {
        if (result.raceName.includes("dag i førertrøjen")) {
            return { ...result, raceName: result.raceName.split(" da")[1].replace("g i", "dag i") }
        } else {
            return result
        }
    } else {
        return result
    }
}

function getPoints(uniques, points, race) {
    if (race.includes("dag i førertrøjen")) {
        if (race.includes("Tour de France")) {
            if (uniques == 1) {
                return 6;
            } else if (uniques == 2) {
                return 9;
            } else if (uniques == 3) {
                return 11;
            } else {
                return 11 + uniques - 3;
            }
        } else {
            if (uniques == 1) {
                return 3;
            } else if (uniques == 2) {
                return 5;
            } else {
                return 5 + uniques - 2;
            }
        }
    } else {
        return uniques * points;
    }
}


export default function RiderAllResults(props) {
    const allRiderResults = props.resultData.reduce((allResults, result) => {
        const key = result.year;
        const curResultGroup = allResults[key] ?? [];

        return { ...allResults, [key]: [...curResultGroup, result] };
    }, {});

    const [curYear, setCurYear] = useState(0);

    return (
        <div className="rider-all-results-container">
            <h3>Alle pointgivende resultater</h3>

            <div>
                <div className={curYear == 0 ? "btn-container disabled" : "btn-container"}>
                    <button onClick={() => { curYear > 0 && setCurYear(curYear - 1) }}><IoChevronBackOutline /></button>
                </div>

                {Object.keys(allRiderResults).map(key => {
                    const resultList = allRiderResults[key].sort(function (a, b) { return b.points - a.points });


                    const resultUniques = resultList.reduce((list, result) => {
                        result = simplifyResult(result)
                        const currCount = list[result.raceName] ?? 0;
                        return {
                            ...list,
                            [result.raceName]: currCount + 1,
                        }
                    }, {})

                    const seen = new Set();

                    const filteredResults = resultList.filter(e => {
                        const rName = simplifyResult(e)
                        const duplicate = seen.has(rName.raceName);
                        seen.add(rName.raceName)

                        return !duplicate;
                    })

                    const sum = resultList.reduce((acc, obj) => {
                        acc.push(obj.points);
                        return acc;
                    }, []).reduce((acc, obj) => {
                        acc += obj;
                        return acc;
                    })

                    return (
                        <div key={key} className="rider-result-year-container">
                            <h4>{key}</h4>
                            <div>
                                <div>
                                    <h5>Resultater</h5>
                                    <ul>
                                        {filteredResults && filteredResults.map((result, index) => {
                                            result = simplifyResult(result)
                                            if (result.raceName) {
                                                return (
                                                    <li key={index}>
                                                        <span className="result-number-of-span">{resultUniques[result.raceName] > 1 && resultUniques[result.raceName] + "x "}</span>
                                                        <span className="result-race-name">{result.raceName && result.raceName.includes(" (") ? result.raceName.split(" (")[0].replace("af", "i") : result.raceName.replace("af", "i")}</span>
                                                        <span className="result-points-sum"> {getPoints(resultUniques[result.raceName], result.points, result.raceName) + "p"}</span>
                                                    </li>
                                                )
                                            }
                                        })}
                                    </ul>
                                </div>

                                <div>
                                    <h5>Højdepunkter</h5>
                                    <ul>
                                        <li>Point i {key}: <span>{sum}</span></li>
                                        <li>Point i hele karrieren: <span>{props.rankingByYearData[key + "Points"].toLocaleString("de-DE")}</span></li>
                                        <li>Placering på Prestigelisten: <span>{props.rankingByYearData[key + "Rank"].toLocaleString("de-DE")}</span></li>
                                    </ul>
                                </div>

                            </div>

                        </div>
                    )
                })[curYear]}

                <div className={curYear == Object.keys(allRiderResults).length - 1 ? "btn-container disabled" : "btn-container"}>
                    <button onClick={() => { curYear < Object.keys(allRiderResults).length - 1 && setCurYear(curYear + 1) }}><IoChevronForwardOutline /></button>
                </div>
            </div>

        </div>
    )
}