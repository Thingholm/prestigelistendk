"use client";

import { Line } from "react-chartjs-2";
import { Chart } from "chart.js/auto";
import colorDict from "@/utils/nationsColors";
import "flag-icons/css/flag-icons.min.css";
import { useState } from "react";

function findNationColor(nation) {
    let nColor = "";

    if (colorDict[nation]) {
        nColor = colorDict[nation]
    } else {
        nColor = "#000000";
    }

    return nColor;
}

function findFontColor(nation) {
    let fColor = "#ffffff";
    const darkColorNations = ["Moldova", "Australien", "Brasilien", "Japan", "Colombia", "Ecuador", "Finland", "Litauen", "New Zealand", "Polen", "Rusland", "Slovakiet", "Slovenien", "Sverige", "Tyskland", "Ukraine", "Venezuela"];

    if (darkColorNations.includes(nation)) {
        fColor = "#1c1c1c"
    }

    return fColor
}

export default function NationsRankingEvolution(props) {
    const nationsAccRank = props.nationsAccRank;
    const [chartSelectedNations, setChartSelectedNations] = useState(["Italien", "Belgien", "Frankrig", "Nederlandene", "Spanien"]);
    const [chartDeselectedNations, setChartDeselectedNations] = useState(nationsAccRank.map(n => n.nation).filter(n => !chartSelectedNations.includes(n)))

    const chartData = {
        labels: Object.keys(nationsAccRank[0]).filter(i => i.includes("Rank")).map(i => i.replace("Rank", "")),
        datasets: nationsAccRank.map(nation => {
            let showStatus = true;
            if (chartSelectedNations.includes(nation.nation)) {
                showStatus = false;
            }

            return {
                label: nation.nation,
                data: Object.entries(nation).filter(i => i[0].includes("Rank")).map(i => { if (i[1] == 0) { return null } else { return i[1] } }),
                backgroundColor: findNationColor(nation.nation),
                borderColor: findNationColor(nation.nation),
                pointRadius: 0,
                pointHitRadius: 20,
                hidden: showStatus,
            }
        })
    }

    const chartOptions = {
        responsive: true,
        scales: {
            y: {
                reverse: true,
                min: 1,
                grid: {
                    color: "#ffffff30"
                },
                ticks: {
                    color: "#fff"
                }
            },
            x: {
                grid: {
                    color: "#ffffff00"
                },
                ticks: {
                    color: "#fff"
                }
            }
        },
        plugins: {
            legend: {
                display: false,
            }
        }
    }

    return (
        <div className="nations-ranking-chart-container">
            <h3>Udvikling i Prestigelisten for nationer</h3>

            <Line data={chartData} options={chartOptions} />

            <div className="chart-custom-legend">
                <h4>Valgte nationer</h4>
                <ul>
                    {chartSelectedNations.sort().map((n, index) => {
                        return (
                            <li
                                key={index}
                                onClick={i => {
                                    setChartSelectedNations(chartSelectedNations.filter((j, jIndex) => index !== jIndex));
                                    setChartDeselectedNations([...chartDeselectedNations, n])
                                }}
                                style={{
                                    backgroundColor: findNationColor(n),
                                    color: findFontColor(n),
                                }}
                            >
                                <span className={"fi fi-" + props.nationsFlagCode.find(i => i.nation == n).nationFlagCode}></span>
                                {n}
                            </li>
                        )
                    })}
                </ul>

                <h4>Fravalgte nationer</h4>
                <ul>
                    {chartDeselectedNations.sort().map((n, index) => {
                        return (
                            <li
                                key={index}
                                onClick={i => {
                                    setChartDeselectedNations(chartDeselectedNations.filter((j, jIndex) => index !== jIndex));
                                    setChartSelectedNations([...chartSelectedNations, n])
                                }}
                                style={{
                                    backgroundColor: findNationColor(n),
                                    color: findFontColor(n),
                                }}
                            >

                                <span className={"fi fi-" + props.nationsFlagCode.find(i => i.nation == n).nationFlagCode}></span>
                                {n}
                            </li>
                        )
                    })}
                </ul>
            </div>
        </div>
    );
}