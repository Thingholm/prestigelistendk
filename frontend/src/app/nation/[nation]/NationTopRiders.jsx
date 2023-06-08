import RankingLinkHeader from "@/components/RankingLinkHeader";
import { nationEncoder, stringEncoder } from "@/components/stringHandler";
import numerizeRanking from "@/utils/numerizeRanking";
import Link from "next/link";

export default function NationTopRiders(props) {
    const ridersData = numerizeRanking(props.ridersData);

    return (
        <div className="table-wrapper">
            <RankingLinkHeader title={"Største ryttere fra " + ridersData[0].nation} link={"/listen?nation=" + nationEncoder(ridersData[0].nation)} mode="light" />
            <div className="rounded-table-container">
                <div className="table-shadow-container">
                    <div className="table ">
                        <div className="table-header">
                            <p>Nr.</p>
                            <p>Rytter</p>
                            <p>År<span>gang</span></p>
                            <p>Point</p>
                        </div>
                        <div className="table-content">
                            {ridersData.map(rider => {
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
            </div>
        </div>

    )
}