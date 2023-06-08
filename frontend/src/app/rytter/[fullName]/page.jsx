import { supabase } from "@/utils/supabase";
import RiderProfile from "./RiderProfile";
import RiderResults from "./RiderResults";
import RiderEvolution from "./RiderEvolution";
import RiderAllResults from "./RiderAllResults";
import RiderRankingFromNation from "./RiderRankingFromNation";
import RiderRankingFromYear from "./RiderRankingFromYear";
import { stringEncoder, stringDecoder } from "@/components/stringHandler";
import numerizeRanking from "@/utils/numerizeRanking";

async function getRiderById(name) {
    let { data: rankingAlltime } = await supabase
        .from('alltimeRanking')
        .select('*')

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
            resultRace = result.race.split(". ")[1].replace("&#39;", "'").replace(/comma/g, ",")
        } else {
            resultRace = result.race.replace("&#39;", "'").replace(/comma/g, ",")
        }
        const racePointSystem = pointSystem.find(p => p.raceName == resultRace);

        const mergedLists = {
            ...result,
            ...racePointSystem,
        }

        return (mergedLists)
    });

    let riderData = numerizeRanking(rankingAlltime).find(i => i.fullName.toLowerCase() == name.toLowerCase());

    if (riderData.active) {
        riderData = { ...riderData, activeRank: numerizeRanking(rankingAlltime.filter(i => i.active == true)).find(i => i.fullName.toLowerCase() == name.toLowerCase()).currentRank }
    }

    return {
        rankingAlltime: rankingAlltime,
        riderData: riderData,
        results: resultsCombined,
        rankingByYears: rankingByYears,
    };
}

export default async function Page(props) {
    const data = await getRiderById(stringDecoder(props.fullName));
    const rider = data.riderData;
    const results = data.results;
    const rankingByYears = data.rankingByYears;

    return (
        <div className="rider-page-container">
            <div className="rider-profile-container">
                <RiderProfile riderData={rider} />
                <RiderResults resultData={results} />
            </div>

            <RiderEvolution resultData={results} rankingByYearData={rankingByYears} />

            <RiderAllResults resultData={results} rankingByYearData={rankingByYears} />

            <div className="rider-related-rankings-container">
                <RiderRankingFromNation riderNation={rider.nation} />
                <RiderRankingFromYear riderBirthYear={rider.birthYear} />
            </div>
        </div>

    )
}