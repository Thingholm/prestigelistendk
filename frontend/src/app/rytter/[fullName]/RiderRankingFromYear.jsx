import RankingLinkHeader from "@/components/RankingLinkHeader";
import "../../../../node_modules/flag-icons/css/flag-icons.min.css"
import Link from "next/link";
import { nationEncoder, stringEncoder } from "@/components/stringHandler";
import { useAlltimeRanking } from "@/utils/queryHooks";
import numerizeRanking from "@/utils/numerizeRanking";
import OverflowButton from "@/components/OverflowButton";

export default function RiderRankingFromYear(props) {
    const riderBirthYear = props.riderBirthYear;

    const alltimeRankingQuery = useAlltimeRanking();
    const alltimeRanking = alltimeRankingQuery.isSuccess && numerizeRanking(alltimeRankingQuery.data.filter(i => i.birthYear == riderBirthYear))

    return (
        <div className="table-wrapper">
            <RankingLinkHeader title={"Største ryttere født i " + riderBirthYear} link={"listen?yearFilterRange=single&bornBefore=" + riderBirthYear} mode="light" />
            <div className="rounded-table-container">
                <div className="table-shadow-container">
                    <div className="table">
                        <div className="table-header">
                            <p>Nr.</p>
                            <p>Rytter</p>
                            <p>Nation</p>
                            <p>Point</p>
                        </div>
                        <div className="table-content">
                            {alltimeRanking && alltimeRanking.map(rider => {
                                const nameArr = rider.fullName.split(/ (.*)/);

                                return (
                                    <div key={rider.id} className={rider.fullName == props.rider ? "table-row highlight" : "table-row"}>
                                        <p>{rider.currentRank.toLocaleString("de-DE")}</p>
                                        <p className="table-name-reversed"><Link href={"/rytter/" + stringEncoder(rider.fullName)}><span className={'media fi fi-' + rider.nationFlagCode}></span><span className="last-name">{nameArr[1]} </span><span>{nameArr[0]}</span></Link></p>
                                        <p><Link href={"/nation/" + nationEncoder(rider.nation)}><span className={'fi fi-' + rider.nationFlagCode}></span> {rider.nation}</Link></p>
                                        <p>{rider.points.toLocaleString("de-DE")}</p>
                                    </div>
                                )
                            })}
                        </div>
                        <OverflowButton />
                    </div>
                </div>
            </div>
        </div>
    )
}