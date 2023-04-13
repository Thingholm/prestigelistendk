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
            {filteredResults.slice(0, 10).map(r =>
                <p key={r.riderId}>{resultUniques[r.raceName] > 1 && resultUniques[r.raceName] + "x"} {r.raceName.split(" (")[0]} - {r.points}</p>
            )}
            <p><Link href="#">Se alle pointgivende resultater...</Link></p>
        </div>
    )
}