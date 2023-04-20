import RankingLinkHeader from "@/components/RankingLinkHeader";
import { supabase } from "@/utils/supabase";

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
            <RankingLinkHeader title={"Største ryttere fra " + riderNation} link="#" mode="light" />
            <div className="table landing-ranking-rounded-container">
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
                                <p>{rider.currentRank}</p>
                                <p className="table-name-reversed"><span className={'fi fi-' + rider.nationFlagCode}></span><span className="last-name">{rider.lastName} </span><span>{rider.firstName}</span></p>
                                <p>{rider.birthYear}</p>
                                <p>{rider.points}</p>
                            </div>
                        )
                    })}
                </div>
            </div>
        </div>
    )
}