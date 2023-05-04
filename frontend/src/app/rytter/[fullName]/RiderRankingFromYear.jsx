import RankingLinkHeader from "@/components/RankingLinkHeader";
import { supabase } from "@/utils/supabase";
import "../../../../node_modules/flag-icons/css/flag-icons.min.css"
import Link from "next/link";
import { nationEncoder, stringEncoder } from "@/components/stringHandler";

async function getRankingFromNation(birthYear) {
    let { data: alltimeRanking } = await supabase
        .from('alltimeRanking')
        .select('*')
        .eq('birthYear', birthYear)

    return (alltimeRanking)
}

export default async function RiderRankingFromYear(props) {
    const riderBirthYear = props.riderBirthYear;
    const rankingFetch = await getRankingFromNation(riderBirthYear)

    const sortedRanking = rankingFetch.sort(function (a, b) { return b.points - a.points });

    const rankedRanking = sortedRanking.map((obj, index) => {
        let rank = index + 1;
        if (index > 0 && obj.points == sortedRanking[index - 1].points) {
            rank = sortedRanking.findIndex(i => obj.points == i.points) + 1;
        }

        return ({ ...obj, currentRank: rank });
    });

    return (
        <div className="table-wrapper">
            <RankingLinkHeader title={"Største ryttere født i " + riderBirthYear} link={"listen?yearFilterRange=single&bornBefore=" + riderBirthYear} mode="light" />
            <div className="table landing-ranking-rounded-container">
                <div className="table-header">
                    <p>Nr.</p>
                    <p>Rytter</p>
                    <p>Nation</p>
                    <p>Point</p>
                </div>
                <div className="table-content">
                    {rankedRanking.map(rider => {
                        return (
                            <div key={rider.id} className="table-row">
                                <p>{rider.currentRank}</p>
                                <p className="table-name-reversed"><Link href={"/rytter/" + stringEncoder(rider.fullName)}><span className="last-name">{rider.lastName} </span><span>{rider.firstName}</span></Link></p>
                                <p><Link href={"/nation/" + nationEncoder(rider.nation)}><span className={'fi fi-' + rider.nationFlagCode}></span> {rider.nation}</Link></p>
                                <p>{rider.points}</p>
                            </div>
                        )
                    })}
                </div>
            </div>
        </div>
    )
}