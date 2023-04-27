import Link from "next/link";

export default function NationRidersHighlight(props) {
    const ridersFromNation = props.ridersData;

    return (
        <div className="rider-top-results-container">
            <h4>Største ryttere fra {ridersFromNation[0].nation}</h4>
            <ul>
                {ridersFromNation.slice(0, 6).map(r => {
                    return (
                        <li key={r.riderId}><Link href={"/rytter/" + r.riderId}>{r.fullName} (nr. {r.currentRank})</Link></li>
                    )
                })}
            </ul>
            <p><Link href="#">Se alle ryttere på Prestigelisten fra {ridersFromNation[0].nation}...</Link></p>
        </div>
    )
}