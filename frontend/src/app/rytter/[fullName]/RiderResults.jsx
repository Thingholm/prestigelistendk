import { stringEncoder } from "@/components/stringHandler";
import Link from "next/link";

export default function RiderResults(props) {
    const resultList = props.resultData.sort(function (a, b) { return b.points - a.points });

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

    return (
        <div className="rider-top-results-container">
            <h4>Største resultater:</h4>
            <ul>
                {filteredResults.slice(0, 7).map(r =>
                    <li key={r.id}><span className="result-number-of-span">{resultUniques[r.raceName] > 1 && resultUniques[r.raceName] + "x"}</span> <span className="rider-top-result-racename-span">{r.raceName.split(" (")[0]}</span></li>
                )}
            </ul>
        </div>
    )
}