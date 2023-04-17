import { supabase } from "@/utils/supabase";
import RiderProfile from "./riderProfile";
import RiderResults from "./RiderResults";
import RiderEvolution from "./RiderEvolution";

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

    let { data: rankingByYears } = await supabase
        .from('alltimeRankingPerYear')
        .select('*')
        .eq('rider', rankingAlltime[0].fullName);

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
        rankingByYears: rankingByYears,
    };
}

export default async function Page({ params }) {
    const data = await getRiderById(params.riderId);
    const rider = data.rankingAlltime;
    const results = data.results;
    const rankingByYears = data.rankingByYears;

    return (
        <div className="rider-page-container">
            <div className="rider-profile-container">
                <RiderProfile riderData={rider[0]} />
                <RiderResults resultData={results} />
            </div>

            <RiderEvolution resultData={results} rankingByYearData={rankingByYears} />
        </div>

    )
}

export async function generateStaticParams() {
    let { data: rankingAlltime } = await supabase.from('alltimeRanking').select('*');

    return rankingAlltime.map((rider) => ({
        slug: rider.riderId,
    }))
}