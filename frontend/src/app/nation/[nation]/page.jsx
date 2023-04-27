import { supabase } from "@/utils/supabase"
import NationProfile from "./NationProfile";
import NationRidersHighlight from "./NationRidersHighlight";
import NationEvolution from "./NationEvolution";
import NationTopRiders from "./NationTopRiders";
import NationTopActiveRiders from "./NationTopActiveRiders";
import NationTopResults from "./NationTopResults";
import RankingNationsNation from "./RankingNations";
import numerizeRanking from "@/utils/numerizeRanking";

async function getDataFromNation(nation) {
    let { data: alltimeRankingAll } = await supabase
        .from('alltimeRanking')
        .select('*')

    const alltimeRanking = numerizeRanking(alltimeRankingAll).filter(i => i.nation == nation)

    return {
        nationData: { nation: alltimeRanking[0].nation, nationFlagCode: alltimeRanking[0].nationFlagCode },
        ridersFromNation: alltimeRanking,
        alltimeRanking: alltimeRankingAll,
    };
}

function groupFunction(obj) {
    return (obj.reduce((acc, curr) => {
        const key = curr["nation"];
        const curPoints = acc[key] ?? { points: 0, numberOfRiders: 0 };

        return { ...acc, [key]: { points: curPoints.points + curr.points, nationFlagCode: curr.nationFlagCode, numberOfRiders: curPoints.numberOfRiders + 1 } };
    }, {}))
}


export default async function Page({ params }) {
    const nationCapitalized = params.nation.replace("oe", "ø").replace("aa", "å").replace("ae", "æ");
    let nationString;

    if (nationCapitalized == "usa") {
        nationString = "USA"
    } else {
        nationString = nationCapitalized.split("-").map(i => i.charAt(0).toUpperCase() + i.slice(1)).join(" ");
    }
    const fetchedData = await getDataFromNation(nationString);

    const alltimeRanking = fetchedData.alltimeRanking;

    const nationsGrouped = groupFunction(alltimeRanking)
    const activeNationsGrouped = groupFunction(alltimeRanking.filter(i => i.active == true))

    const nationsRankings = numerizeRanking(Object.keys(nationsGrouped).map(i => { return { nation: i, ...nationsGrouped[i] } }))
    const activeNationsRankings = numerizeRanking(Object.keys(activeNationsGrouped).map(i => { return { nation: i, ...activeNationsGrouped[i] } }))

    const currentNationRank = nationsRankings.find(i => i.nation == nationString)
    const currentNationActiveRank = activeNationsRankings.find(i => i.nation == nationString)

    return (
        <div className="nation-page-container">
            <div className="nation-profile-container rider-profile-container">
                <NationProfile nationData={fetchedData.nationData} nationRankData={currentNationRank} activeNationRankData={currentNationActiveRank} />
                <NationRidersHighlight ridersData={fetchedData.ridersFromNation} />
            </div>

            <NationEvolution nationData={nationString} />

            <NationTopResults nationData={nationString} ridersData={fetchedData.ridersFromNation} />

            <div className="nation-rankings-container riders-ranked dark">
                <NationTopRiders ridersData={fetchedData.ridersFromNation} />
                <NationTopActiveRiders ridersData={fetchedData.ridersFromNation} nationData={nationString} />
            </div>

            <RankingNationsNation currentNation={nationString} rankingNations={nationsRankings} activeRankingNations={activeNationsRankings} />
        </div>
    )
}

export async function generateStaticParams() {
    let { data: rankingAlltime } = await supabase
        .from('alltimeRanking')
        .select('nation');

    return rankingAlltime.reduce((acc, curr) => {
        if (!acc.find((item) => item == curr.toString().toLowerCase().replace("ø", "oe").replace("å", "aa").replace("æ", "ae").replace(" ", "-"))) {
            acc.push(curr.toString().toLowerCase().replace("ø", "oe").replace("å", "aa").replace("æ", "ae").replace(" ", "-"));
        }
        return acc;
    }, []).map(nation => ({
        slug: nation,
    }))
}