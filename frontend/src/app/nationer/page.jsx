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

    let { data: nationsRanking } = await supabase
        .from('nationsRanking')
        .select('*');

    return {
        alltimeRanking: alltimeRanking,
        nationsAccRank: nationsAccRank,
        nationsRanking: nationsRanking,
    };
}

export default async function Page({ searchParams }) {
    const fetchedData = await fetchData();
    const alltimeRanking = fetchedData.alltimeRanking;
    const nationsAccRank = fetchedData.nationsAccRank;
    const nationsRanking = fetchedData.nationsRanking;

    return (
        <div>
            <NationRankingTable nationsRanking={nationsRanking} alltimeRanking={alltimeRanking} searchParams={searchParams} />

            <NationsRankingEvolution nationsAccRank={nationsAccRank} nationsFlagCode={nationsRanking.map(n => { return { nationFlagCode: n.nationFlagCode, nation: n.nation } })} />
        </div>
    );
}