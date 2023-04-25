"use client"

import { Line } from "react-chartjs-2"
import { Chart, registerables } from 'chart.js';

Chart.register(...registerables);
import RankingLinkHeader from "@/components/RankingLinkHeader";

export default function NationAccChart(props) {
    const rankingData = props.rankingData;

    const rankData = {
        labels: rankingData.map(i => i.year),
        datasets: [{
            label: "Point opnået pr. år",
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
        labels: rankingData.map(i => i.year),
        datasets: [{
            label: "Point opnået pr. år",
            data: rankingData.map(i => i.points),
            backgroundColor: "#fee40250",
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
            <div className="chart-container">
                <RankingLinkHeader title="Point opnået all time hvert år" link="#" mode="light" />
                <Line data={pointsData} options={pointsOptions} />
            </div>
            <div className="chart-container">
                <RankingLinkHeader title="All time placering hvert år" link="#" mode="light" />
                <Line data={rankData} options={rankOptions} />
            </div>
        </div>
    )
}