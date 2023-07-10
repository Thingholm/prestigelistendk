import RankingLinkHeader from "@/components/RankingLinkHeader";
import { nationEncoder, stringEncoder } from "@/components/stringHandler";
import numerizeRanking from "@/utils/numerizeRanking";
import { useAlltimeRanking } from "@/utils/queryHooks";
import { supabase } from "@/utils/supabase";
import Link from "next/link";

export default function RiderRankingFromNation(props) {
    const riderNation = props.riderNation;

    const alltimeRankingQuery = useAlltimeRanking();
    const alltimeRanking = alltimeRankingQuery.isSuccess && numerizeRanking(alltimeRankingQuery.data.filter(i => i.nation == riderNation))


    return (
        <div className="table-wrapper">
            <RankingLinkHeader title={"Største ryttere fra " + riderNation} link={"/listen?nation=" + nationEncoder(riderNation)} mode="light" />
            <div className="rounded-table-container">
                <div className="table-shadow-container">
                    <div className="table">
                        <div className="table-header">
                            <p>Nr.</p>
                            <p>Rytter</p>
                            <p>Årgang</p>
                            <p>Point</p>
                        </div>
                        <div className="table-content">
                            {alltimeRanking && alltimeRanking.map(rider => {
                                const nameArr = rider.fullName.split(/ (.*)/);

                                return (
                                    <div key={rider.id} className={rider.fullName == props.rider ? "table-row highlight" : "table-row"}>
                                        <p>{rider.currentRank.toLocaleString("de-DE")}</p>
                                        <p className="table-name-reversed"><Link href={"/rytter/" + stringEncoder(rider.fullName)}><span className={'fi fi-' + rider.nationFlagCode}></span><span className="last-name">{nameArr[1]} </span><span>{nameArr[0]}</span></Link></p>
                                        <p><Link href={"/listen?yearFilterRange=single&bornBefore=" + rider.birthYear}>{rider.birthYear}</Link></p>
                                        <p>{rider.points.toLocaleString("de-DE")}</p>
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