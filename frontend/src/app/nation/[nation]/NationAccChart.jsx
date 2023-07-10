"use client"

import { Bar, Line } from "react-chartjs-2"
import { Chart, registerables } from 'chart.js';

Chart.register(...registerables);
import RankingLinkHeader from "@/components/RankingLinkHeader";

export default function NationAccChart(props) {
    const rankingData = props.rankingData;
    console.log(rankingData)
    const countData = props.countData;
    let labels = []
    let values = []
    if (countData) {
        labels = Object.keys(countData).filter(k => !["id", "nation"].includes(k))
        values = Object.values(countData).slice(0, 140)
    }

    const rankData = {
        labels: rankingData.map(i => i.year),
        datasets: [{
            label: "Placering på all time Prestigelisten",
            data: rankingData.map(i => {
                if (i.points > 0) {
                    return i.rank;
                } else {
                    return null;
                }
            }),
            backgroundColor: "#fee402",
            borderColor: "#fee402",
            color: "#ffffff",
            fill: false,
            pointRadius: 0,
            pointHitRadius: 100,
        }],
    }

    const pointsData = {
        labels: labels,
        datasets: [{
            label: "Antal resultater",
            data: values,
            backgroundColor: "#fee402",
            borderColor: "#fee402",
            color: "#ffffff",
            fill: true,
            pointRadius: 0,
            pointHitRadius: 100,
        }],
    }

    const rankOptions = {
        plugins: {
            legend: {
                display: false,
            },
        },
        scales: {
            y: {
                min: 1,
                reverse: true,
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

    const pointsOptions = {
        plugins: {
            legend: {
                display: false,
            },
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

    return (
        <div className="acc-charts-container charts-container">
            <div className={props.active == 3 ? "chart-container show" : "chart-container hide"}>
                <h3 className="light">Antal resultater</h3>
                <Bar data={pointsData} options={pointsOptions} />
            </div>
            <div className={props.active == 4 ? "chart-container show" : "chart-container hide"}>
                <h3 className="light">Placering på listen over største nationer</h3>
                <Line data={rankData} options={rankOptions} />
            </div>
        </div>
    )
}