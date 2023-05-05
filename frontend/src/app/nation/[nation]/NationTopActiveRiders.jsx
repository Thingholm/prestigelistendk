import RankingLinkHeader from "@/components/RankingLinkHeader";
import { nationEncoder, stringEncoder } from "@/components/stringHandler";
import numerizeRanking from "@/utils/numerizeRanking";
import Link from "next/link";

export default function NationTopActiveRiders(props) {
    const ridersData = numerizeRanking(props.ridersData.filter(i => i.active == true));

    return (
        <div className="table-wrapper">
            <RankingLinkHeader title={"Største aktive ryttere fra " + props.nationData} link={"/listen?nation=" + nationEncoder(props.nationData) + "&activeStatus=active"} mode="light" />
            <div className="table landing-ranking-rounded-container">
                <div className="table-header">
                    <p>Nr.</p>
                    <p>Rytter</p>
                    <p>Årgang</p>
                    <p>Point</p>
                </div>
                <div className="table-content">
                    {ridersData && ridersData.map(rider => {
                        return (
                            <div key={rider.id} className="table-row">
                                <p>{rider.currentRank}</p>
                                <p className="table-name-reversed"><Link href={"/rytter/" + stringEncoder(rider.fullName)}><span className={'fi fi-' + rider.nationFlagCode}></span><span className="last-name">{rider.lastName} </span><span>{rider.firstName}</span></Link></p>
                                <p><Link href={"/listen?yearFilterRange=single&bornBefore=" + rider.birthYear}>{rider.birthYear}</Link></p>
                                <p>{rider.points}</p>
                            </div>
                        )
                    })}
                </div>
            </div>
        </div>

    )
}