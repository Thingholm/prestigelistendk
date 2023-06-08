"use client"

import { useState } from "react";
import { IoChevronBackOutline, IoChevronForwardOutline } from "react-icons/io5";

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
                        const currCount = list[result.raceName] ?? 0;
                        return {
                            ...list,
                            [result.raceName]: currCount + 1,
                        }
                    }, {})

                    const seen = new Set();

                    const filteredResults = resultList.filter(e => {
                        const duplicate = seen.has(e.raceName);
                        seen.add(e.raceName)

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
                                        {filteredResults && filteredResults.map((result, index) =>
                                            <li key={index}>
                                                <span className="result-number-of-span">{resultUniques[result.raceName] > 1 && resultUniques[result.raceName] + "x "}</span>
                                                <span className="result-race-name">{result.raceName && result.raceName.includes(" (") ? result.raceName.split(" (")[0] : result.raceName}</span>
                                                <span className="result-points-sum"> {resultUniques[result.raceName] > 1 ? (result.points * resultUniques[result.raceName]) + "p" : result.points + "p"}</span>
                                            </li>
                                        )}
                                    </ul>
                                </div>

                                <div>
                                    <h5>Højdepunkter</h5>
                                    <ul>
                                        <li>Point i {key}: <span>{sum}</span></li>
                                        <li>Point i hele karrierien: <span>{props.rankingByYearData[0][key + "Points"]}</span></li>
                                        <li>Placering på Prestigelisten: <span>{props.rankingByYearData[0][key + "Rank"]}</span></li>
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