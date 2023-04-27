import { supabase } from "@/utils/supabase";
import RiderProfile from "./riderProfile";
import RiderResults from "./RiderResults";
import RiderEvolution from "./RiderEvolution";
import RiderAllResults from "./RiderAllResults";
import RiderRankingFromNation from "./RiderRankingFromNation";
import RiderRankingFromYear from "./RiderRankingFromYear";
import { stringEncoder, stringDecoder } from "@/components/stringHandler";

async function getRiderById(name) {
    let { data: rankingAlltime } = await supabase
        .from('alltimeRanking')
        .select('*')
        .ilike('fullName', "%" + name + "%");

    let { data: results } = await supabase
        .from('results')
        .select('*')
        .ilike('rider', "%" + name + "%");

    let { data: pointSystem } = await supabase
        .from('pointSystem')
        .select('*');

    let { data: rankingByYears } = await supabase
        .from('alltimeRankingPerYear')
        .select('*')
        .ilike('rider', "%" + name + "%");

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
    const data = await getRiderById(stringDecoder(params.fullName));
    const rider = data.rankingAlltime;
    const results = data.results;
    const rankingByYears = data.rankingByYears;

    // console.log(stringEncoder(rider[0].fullName))
    // console.log(stringDecoder(stringEncoder(rider[0].fullName)))
    return (
        <div className="rider-page-container">
            <div className="rider-profile-container">
                <RiderProfile riderData={rider[0]} />
                <RiderResults resultData={results} />
            </div>

            <RiderEvolution resultData={results} rankingByYearData={rankingByYears} />

            <RiderAllResults resultData={results} />

            <div className="rider-related-rankings-container">
                <RiderRankingFromNation riderNation={rider[0].nation} />
                <RiderRankingFromYear riderBirthYear={rider[0].birthYear} />
            </div>
        </div>

    )
}

export async function generateStaticParams() {
    let { data: rankingAlltime } = await supabase.from('alltimeRanking').select('*');

    return rankingAlltime.map((rider) => ({
        slug: stringEncoder(rider.fullName),
    }))
}   