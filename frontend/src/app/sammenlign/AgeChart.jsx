import { Line } from "react-chartjs-2";
import { Chart } from "chart.js/auto";

export default function AgeChart(props) {
    const ridersData = props.data
    const pointSystem = props.pointSystem
    const riderResults = props.riderResults?.map(rider => {
        const riderName = rider[0]["rider"]
        return {
            [riderName]: rider.reduce((acc, res) => {
                const key = res["year"] - ridersData.find(j => j.riderData.fullName == riderName).riderData.birthYear;
                const curYear = acc[key] ?? 0;
                const points = pointSystem.find(i => i.raceName == (res.race.includes("etape") ? res.race.split(". ")[1] : res.race)).points

                return { ...acc, [key]: curYear + points }
            }, {})
        }
    })

    const allAges = Object.keys(Object.values(riderResults[0])[0]).concat(Object.keys(Object.values(riderResults[1])[0])).sort().reduce((acc, obj) => {
        if (!acc.includes(obj)) {
            return [...acc, obj]
        } else {
            return acc
        }
    }, [])

    let chartData;

    if (allAges) {
        chartData = {
            labels: allAges,
            datasets: riderResults.map((i, index) => {
                const rider = Object.keys(i)[0]

                return {
                    label: rider,
                    data: allAges.map(j => {
                        const riderAges = Object.keys(i[rider]).sort()
                        if (i[rider][j]) {
                            return i[rider][j]
                        } else {
                            if (Math.min(...riderAges) > j || Math.max(...riderAges) < j) {
                                return null
                            } else {
                                return 0
                            }
                        }
                    }),
                    backgroundColor: index == 0 ? "#fdca0050" : "#da291c50",
                    borderColor: index == 0 ? "#fdca00" : "#da291c"
                }
            })
        }
    }

    const chartOptions = {
        plugins: {
            tooltip: {
                callbacks: {
                    label: function (context) {
                        let label = context.dataset.label + ": " + context.parsed.y + " point" ?? '';
                        return label
                    },
                    title: function (context) {
                        return 'Alder: ' + context[0].label
                    }
                }
            }
        },
        scales: {
            y: {
                title: {
                    text: "Point"
                }
            },
            x: {
                title: {
                    text: "Alder"
                }
            }
        }
    }

    return (
        <div>
            {chartData && <Line data={chartData} options={chartOptions} />}
        </div>
    )
}