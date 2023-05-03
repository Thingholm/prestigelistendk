import numerizeRanking from "@/utils/numerizeRanking";
import { supabase } from "@/utils/supabase";
import "flag-icons/css/flag-icons.min.css"
import NationRankingTable from "./NationRankingTable";

async function fetchData() {
    let { data: alltimeRanking } = await supabase
        .from('alltimeRanking')
        .select('*');

    return alltimeRanking;
}

export default async function Page() {
    const alltimeRanking = await fetchData();
    const nationsGrouped = alltimeRanking.reduce((acc, curr) => {
        const key = curr["nation"];
        const curPoints = acc[key] ?? { points: 0, numberOfRiders: 0 };

        return { ...acc, [key]: { points: curPoints.points + curr.points, nationFlagCode: curr.nationFlagCode, numberOfRiders: curPoints.numberOfRiders + 1 } };
    }, {});

    const nationRanking = Object.keys(nationsGrouped).map(n => { return { ...nationsGrouped[n], nation: n } })

    return (
        <div className="nation-ranking-page">
            <h2>Prestigelisten for nationer</h2>
            <NationRankingTable nationRanking={nationRanking} alltimeRanking={alltimeRanking} />
        </div>
    );
}