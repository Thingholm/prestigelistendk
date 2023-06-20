"use client"

import { Line, Bar } from "react-chartjs-2"
import { Chart, registerables } from 'chart.js';

Chart.register(...registerables);
import RankingLinkHeader from "@/components/RankingLinkHeader";

export default function NationByYearChart(props) {
    const rankingData = props.rankingData;
    const accData = props.accData;

    const rankData = {
        labels: rankingData.map(i => i.year),
        datasets: [{
            label: "Årlig placering",
            data: rankingData.map(i => {
                if (accData.find(e => e.year == i.year).points > 0 && i.points > 0) {
                    return i.rank;
                } else {
                    return null;
                }
            }),
            backgroundColor: "#fee402",
            borderColor: "#fee402",
            color: "#ffffff",
            pointRadius: 0,
            pointHitRadius: 100,
            spanGaps: true,
        }],
    }

    const pointsData = {
        labels: rankingData.map(i => i.year),
        datasets: [{
            label: "Point opnået pr. år",
            data: rankingData.map(i => i.points),
            backgroundColor: "#fee402",
            borderColor: "#fee402",
            color: "#ffffff",
            pointRadius: 0,
            pointHitRadius: 100,
        }],
    }

    const pointsOptions = {
        labels: rankingData.map(i => i.year),
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

    const rankOptions = {
        plugins: {
            legend: {
                display: false,
            },
        },
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
        }
    }

    return (
        <div className="by-year-charts-container charts-container">
            <div className={props.active == 1 ? "chart-container show" : "chart-container hide"}>
                <h3 className="light">Point opnået pr. år</h3>
                <Bar data={pointsData} options={pointsOptions} />
            </div>
            <div className={props.active == 2 ? "chart-container show" : "chart-container hide"}>
                <h3 className="light">Placering på listen over nationer med flest optjente point hvert år</h3>
                <Line data={rankData} options={rankOptions} />
            </div>
        </div>

    )
}