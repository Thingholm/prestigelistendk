"use client";

import { Bar, Line } from "react-chartjs-2";
import { Chart } from "chart.js/auto";
import RankingLinkHeader from "@/components/RankingLinkHeader";
import { useEffect, useState } from "react";

function createLabels(arr) {
    let newData = [];
    for (let i = arr[0].year; i <= arr[arr.length - 1].year; i++) {
        const curYear = arr.find(j => j.year == i);
        let curPoints = 0;
        if (curYear) {
            curPoints = curYear.points;
        }
        newData.push({ year: i, points: curPoints });
    }
    return newData;
}

function simplifyResult(result) {
    if (result) {
        if (result.includes("dag i førertrøjen")) {
            return result.split(" da")[1].replace("g i", "dag i")
        } else {
            return result
        }
    } else {
        return result;
    }
}

export default function RiderEvolution(props) {
    const results = props.resultData;
    const [graphShowStatus, setGraphShowStatus] = useState(1);
    const rankingByYears = props.rankingByYearData[0];
    const rankingByYearsChartData = Object.keys(rankingByYears)
        .filter(i => i.includes("Rank"))
        .filter(i => rankingByYears[i.replace("Rank", "Points")] > 0)
        .map(i => { return { year: parseInt(i.replace("Rank", "")), rank: rankingByYears[i] } });

    const summedPointsByYear = createLabels(results.reduce((acc, result) => {
        const resultIndex = acc.findIndex(i => i.year === result.year);
        if (resultIndex !== -1) {
            acc[resultIndex].points += result.points;
        } else {
            acc.push({ year: result.year, points: result.points });
        }
        return acc;
    }, []).sort(function (a, b) { return a.year - b.year }));

    const barData = {
        labels: summedPointsByYear.map(i => i.year),
        datasets: [{
            label: "Point vundet på et år",
            data: summedPointsByYear.map(i => i.points),
            backgroundColor: "#fee402",
            color: "#ffffff",
        }]
    }

    const lineData = {
        labels: rankingByYearsChartData.map(i => i.year),
        datasets: [{
            label: "Placering på Prestigelisten",
            data: rankingByYearsChartData.map(i => i.rank),
            backgroundColor: "#fee402",
            borderColor: "#fee40290",
            color: "#ffffff",
        }]
    }

    const chartOptions = {
        plugins: {
            tooltip: {
                callbacks: {
                    afterBody: function (context) {
                        const contextYear = context[0].label;

                        const resultsByYear = results.filter(i => i.year == contextYear).map(i => i.raceName.split(" (")[0])

                        const resultUniques = resultsByYear.reduce((list, result) => {
                            const res = simplifyResult(result)
                            const currCount = list[res] ?? 0;
                            return {
                                ...list,
                                [res]: currCount + 1,
                            }
                        }, {})

                        const seen = new Set();
                        const filteredResults = resultsByYear.filter(e => {
                            const newE = simplifyResult(e)
                            const duplicate = seen.has(newE);
                            seen.add(newE)

                            return !duplicate;
                        }).map(e => {
                            const newE = simplifyResult(e)
                            if (resultUniques[newE] > 1) {
                                return resultUniques[newE] + "x " + newE.replace("etape", "etaper").replace("Dag", "dage");
                            } else {
                                return newE;
                            }
                        })
                        return filteredResults;
                    },
                }
            },
            legend: {
                display: false,
            }
        },
        scales: {
            y: {
                grid: {
                    color: "#ffffff50"
                },
                ticks: {
                    color: "#fff"
                }
            },
            x: {
                grid: {
                    color: "#ffffff50"
                },
                ticks: {
                    color: "#fff"
                }
            }
        }
    }

    const rankChartOptions = {
        scales: {
            y: {
                reverse: true,
                min: 1,
                grid: {
                    color: "#ffffff50"
                },
                ticks: {
                    color: "#fff"
                }
            },
            x: {
                grid: {
                    color: "#ffffff50"
                },
                ticks: {
                    color: "#fff"
                }
            }
        },
    }

    const mergedChartOptions = {};

    return (
        <div className="rider-evolution-container">
            <div className="media">
                <h3>Karriere i grafer</h3>
                <div className="btn-container">
                    <button onClick={() => setGraphShowStatus(1)} className={graphShowStatus == 1 && "btn-active"}>Point opnået hvert år</button>
                    <button onClick={() => setGraphShowStatus(2)} className={graphShowStatus == 2 && "btn-active"}>Udv. i placering på Prestigelisten</button>
                </div>
            </div>
            <div className={graphShowStatus == 1 ? "chart-container show" : "chart-container hide"}>
                <h3 className="light">Point optjent hvert år</h3>
                <Bar data={barData} options={chartOptions} />
            </div>

            <div className={graphShowStatus == 2 ? "chart-container show" : "chart-container hide"}>
                <h3 className="light">Placering på Prestigelisten</h3>
                <Line data={lineData} options={Object.assign(mergedChartOptions, chartOptions, rankChartOptions)} />
            </div>
        </div>
    )
}