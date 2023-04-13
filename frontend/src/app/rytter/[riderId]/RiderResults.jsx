export default function RiderResults(props) {
    const resultList = props.resultData.sort(function (a, b) { return b.points - a.points });

    return (
        <div>
            {resultList.map(r => <p>{r.raceName.split(" (")[0]} {r.points}</p>)}
        </div>
    )
}