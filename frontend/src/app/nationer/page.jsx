import { supabase } from "@/utils/supabase";
import "flag-icons/css/flag-icons.min.css";
import NationRankingTable from "./NationRankingTable";
import NationsRankingEvolution from "./NationsRankingEvolution";

async function fetchData() {
    let { data: alltimeRanking } = await supabase
        .from('alltimeRanking')
        .select('*');

    let { data: nationsAccRank } = await supabase
        .from('nationsAccRank')
        .select('*');

    return { alltimeRanking: alltimeRanking, nationsAccRank: nationsAccRank };
}

export default async function Page({ searchParams }) {
    const fetchedData = await fetchData();
    const alltimeRanking = fetchedData.alltimeRanking;
    const nationsAccRank = fetchedData.nationsAccRank;


    const nationsGrouped = alltimeRanking.reduce((acc, curr) => {
        const key = curr["nation"];
        const curPoints = acc[key] ?? { points: 0, numberOfRiders: 0 };

        return { ...acc, [key]: { points: curPoints.points + curr.points, nationFlagCode: curr.nationFlagCode, numberOfRiders: curPoints.numberOfRiders + 1 } };
    }, {});

    const nationRanking = Object.keys(nationsGrouped).map(n => { return { ...nationsGrouped[n], nation: n } })

    return (
        <div>
            <NationRankingTable nationRanking={nationRanking} alltimeRanking={alltimeRanking} searchParams={searchParams} />

            <NationsRankingEvolution nationsAccRank={nationsAccRank} nationsFlagCode={nationRanking.map(n => { return { nationFlagCode: n.nationFlagCode, nation: n.nation } })} />
        </div>
    );
}