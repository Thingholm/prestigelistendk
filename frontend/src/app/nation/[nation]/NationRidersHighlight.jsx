import { nationEncoder, stringEncoder } from "@/components/stringHandler";
import Link from "next/link";

export default function NationRidersHighlight(props) {
    const ridersFromNation = props.ridersData;

    return (
        <div className="rider-top-results-container">
            <h4>Største ryttere fra {ridersFromNation[0].nation} all time</h4>
            <ul>
                {ridersFromNation.slice(0, 6).map(r => {
                    return (
                        <li key={r.riderId}><Link href={"/rytter/" + stringEncoder(r.fullName)}>{r.fullName.replace("&#39;", "'")} (nr. {r.currentRank})</Link></li>
                    )
                })}
            </ul>
            <p><Link href={"listen?nation=" + nationEncoder(ridersFromNation[0].nation)}>Se alle ryttere på Prestigelisten fra {ridersFromNation[0].nation}...</Link></p>
        </div>
    )
}