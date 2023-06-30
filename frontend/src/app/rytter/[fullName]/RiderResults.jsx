import { stringEncoder } from "@/components/stringHandler";
import Link from "next/link";

function simplifyResult(result) {
    if (result.raceName.includes("dag i førertrøjen")) {
        return { ...result, raceName: result.raceName.split(" da")[1].replace("g i", "dag i") }
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

export default function RiderResults(props) {
    const resultList = props.resultData.sort(function (a, b) { return b.points - a.points });

    const resultUniques = resultList.reduce((list, result) => {
        const res = simplifyResult(result)
        const currCount = list[res.raceName] ?? 0;
        return {
            ...list,
            [res.raceName]: currCount + 1,
        }
    }, {})

    const seen = new Set();

    const filteredResults = resultList.filter(e => {
        const newE = simplifyResult(e)
        const duplicate = seen.has(newE.raceName);
        seen.add(newE.raceName)

        return !duplicate;
    })

    console.log(resultUniques)
    console.log(filteredResults)

    return (
        <div className="rider-top-results-container">
            <h4>Største resultater:</h4>
            <ul>
                {filteredResults.slice(0, 7).map(r => {
                    r = simplifyResult(r)
                    return (
                        <li key={r.id}><span className="result-number-of-span">{resultUniques[r.raceName] > 1 && resultUniques[r.raceName] + "x"}</span> <span className="rider-top-result-racename-span">{r.raceName.split(" (")[0].replace("af", "i")}</span></li>
                    )
                })}
            </ul>
        </div>
    )
}