import { Radar } from "react-chartjs-2"
import { Chart } from "chart.js/auto";

export default function RadarChart(props) {
    if (props.data[0]) {
        var chartData = {
            labels: Object.keys(props.data[0]["groupedPoints"]).sort(),
            datasets: props.data.map((i, index) => {
                const radarData = Object.keys(i["groupedPoints"]).sort().map((j, jndex) => {
                    return (i["groupedPoints"][j] / (props.data[(index == 1 ? 0 : 1)]["groupedPoints"][j] + i["groupedPoints"][j]) * 100)
                })

                return {
                    data: radarData,
                    label: i["riderData"]["fullName"],
                    backgroundColor: index == 0 ? "#fee40250" : "#da291c50",
                    borderColor: index == 0 ? "#fee402" : "#da291c"
                }
            })
        }
    }


    const chartOptions = {
        plugins: {
            legend: {
                display: true,
                labels: {
                    color: "#ffffff"
                }
            }
        },
        elements: {

        },
        scales: {
            r: {
                angleLines: {
                    color: "#ffffff30",
                },
                grid: {
                    color: "#ffffff30",
                },
                ticks: {
                    backdropColor: "#1c1c1c"
                },
                pointLabels: {
                    color: "#fff"
                }
            }
        }
    }

    return (
        <div>
            {chartData && <Radar data={chartData} options={chartOptions} />}
        </div>
    )
}