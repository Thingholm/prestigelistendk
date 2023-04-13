import { supabase } from "@/utils/supabase";
import RiderProfile from "./riderProfile";
import RiderResults from "./RiderResults";

async function getRiderById(id) {
    let { data: rankingAlltime } = await supabase
        .from('alltimeRanking')
        .select('*')
        .eq('riderId', id);

    let { data: results } = await supabase
        .from('results')
        .select('*')
        .eq('rider', rankingAlltime[0].fullName);

    let { data: pointSystem } = await supabase
        .from('pointSystem')
        .select('*');

    const resultsCombined = results.map(result => {
        let resultRace = "";

        if (result.race.includes("etape")) {
            resultRace = result.race.split(". ")[1].replace("&#39;", "'")
        } else {
            resultRace = result.race.replace("&#39;", "'")
        }

        const racePointSystem = pointSystem.find(p => p.raceName == resultRace);

        const mergedLists = {
            ...result,
            ...racePointSystem,
        }

        return (mergedLists)
    });

    return {
        rankingAlltime: rankingAlltime,
        results: resultsCombined,
    };
}

export default async function Page({ params }) {
    const data = await getRiderById(params.riderId);
    const rider = data.rankingAlltime;
    const results = data.results;

    return (
        <div>
            <RiderProfile riderData={rider[0]} />
            <RiderResults resultData={results} />
        </div>
    )
}

export async function generateStaticParams() {
    let { data: rankingAlltime } = await supabase.from('alltimeRanking').select('*');

    return rankingAlltime.map((rider) => ({
        slug: rider.riderId,
    }))
}