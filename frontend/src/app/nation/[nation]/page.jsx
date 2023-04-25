import { supabase } from "@/utils/supabase"
import NationProfile from "./NationProfile";
import NationRidersHighlight from "./NationRidersHighlight";
import NationEvolution from "./NationEvolution";

async function getDataFromNation(nation) {
    let { data: alltimeRanking } = await supabase
        .from('alltimeRanking')
        .select('*')
        .eq('nation', nation)

    return {
        nationData: { nation: alltimeRanking[0].nation, nationFlagCode: alltimeRanking[0].nationFlagCode },
        ridersFromNation: alltimeRanking,
    };
}

export default async function Page({ params }) {
    const nationCapitalized = params.nation.replace("oe", "ø").replace("aa", "å").replace("ae", "æ");
    const nationString = nationCapitalized.charAt(0).toUpperCase() + nationCapitalized.slice(1);
    const fetchedData = await getDataFromNation(nationString);

    return (
        <div className="nation-page-container">
            <div className="nation-profile-container rider-profile-container">
                <NationProfile nationData={fetchedData.nationData} />
                <NationRidersHighlight ridersData={fetchedData.ridersFromNation} />
            </div>

            <NationEvolution nationData={nationString} />

        </div>
    )
}

export async function generateStaticParams() {
    let { data: rankingAlltime } = await supabase
        .from('alltimeRanking')
        .select('nation');

    return rankingAlltime.reduce((acc, curr) => {
        if (!acc.find((item) => item == curr.toString().toLowerCase().replace("ø", "oe").replace("å", "aa").replace("æ", "ae"))) {
            acc.push(curr.toString().toLowerCase().replace("ø", "oe").replace("å", "aa").replace("æ", "ae"));
        }
        return acc;
    }, []).map(nation => ({
        slug: nation,
    }))
}