import RankingLinkHeader from "@/components/RankingLinkHeader";
import { nationEncoder, stringEncoder } from "@/components/stringHandler";
import { supabase } from "@/utils/supabase";
import Link from "next/link";

async function getRankingFromNation(nation) {
    let { data: alltimeRanking } = await supabase
        .from('alltimeRanking')
        .select('*')
        .eq('nation', nation)

    return (alltimeRanking)
}

export default async function RiderRankingFromNation(props) {
    const riderNation = props.riderNation;
    const rankingFetch = await getRankingFromNation(riderNation)

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
                            {rankedRanking.map(rider => {
                                return (
                                    <div key={rider.id} className="table-row">
                                        <p>{rider.currentRank.toLocaleString("de-DE")}</p>
                                        <p className="table-name-reversed"><Link href={"/rytter/" + stringEncoder(rider.fullName)}><span className={'fi fi-' + rider.nationFlagCode}></span><span className="last-name">{rider.lastName.replace("&#39;", "'")} </span><span>{rider.firstName}</span></Link></p>
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