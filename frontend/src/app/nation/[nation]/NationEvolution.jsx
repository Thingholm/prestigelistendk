import { supabase } from "@/utils/supabase"
import NationByYearChart from "./NationByYearChart";
import NationAccChart from "./NationAccChart";

async function fetchData(nation) {
    let { data: accRanking } = await supabase
        .from('nationsAccRank')
        .select('*')
        .eq('nation', nation);

    let { data: byYearRanking } = await supabase
        .from('nationsRankByYear')
        .select('*')
        .eq('nation', nation)

    const filteredAccRanking = Object.keys(accRanking[0])
        .filter(i => i.includes("Rank"))
        .map(i => { return { year: parseInt(i.replace("Rank", "")), rank: accRanking[0][i], points: accRanking[0][i.replace("Rank", "Points")] } })

    const filteredYearRanking = Object.keys(byYearRanking[0])
        .filter(i => i.includes("Rank"))
        .map(i => { return { year: parseInt(i.replace("Rank", "")), rank: byYearRanking[0][i], points: byYearRanking[0][i.replace("Rank", "Points")] } })


    return {
        accRanking: filteredAccRanking,
        yearRanking: filteredYearRanking,
    };
}

export default async function NationEvolution(props) {
    const nationRankingsData = await fetchData(props.nationData)

    return (
        <div className="nation-evolution-container">
            <NationByYearChart rankingData={nationRankingsData.yearRanking} accData={nationRankingsData.accRanking} />
            <NationAccChart rankingData={nationRankingsData.accRanking} />
        </div>
    )
}