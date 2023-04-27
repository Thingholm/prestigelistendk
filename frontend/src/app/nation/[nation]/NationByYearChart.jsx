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
            label: "Rank hvert år",
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
            <div className="chart-container">
                <RankingLinkHeader title="Point opnået hvert år" link="#" mode="light" />
                <Bar data={pointsData} options={pointsOptions} />
            </div>
            <div className="chart-container">
                <RankingLinkHeader title="Placering på Prestigelisten hvert år" link="#" mode="light" />
                <Line data={rankData} options={rankOptions} />
            </div>
        </div>

    )
}