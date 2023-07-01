import { supabase } from "@/utils/supabase"
import NationProfile from "./NationProfile";
import NationRidersHighlight from "./NationRidersHighlight";
import NationEvolution from "./NationEvolution";
import NationTopRiders from "./NationTopRiders";
import NationTopActiveRiders from "./NationTopActiveRiders";
import NationTopResults from "./NationTopResults";
import RankingNationsNation from "./RankingNations";
import numerizeRanking from "@/utils/numerizeRanking";

function findNation(nation, alltimeRankingAll) {
    if (["Moldova", "Sovjetunionen", "Østtyskland"].includes(nation)) {
        if (nation == "Moldova") {
            return numerizeRanking(alltimeRankingAll).filter(i => i.fullName == "Andrei Tchmil")
        } else if (nation == "Sovjetunionen") {
            return numerizeRanking(alltimeRankingAll).filter(i => ["Vladimir Pulnikov", "Asiat Saitov", "Dmitri Konychev", "Viatcheslav Ekimov", "Djamolidine Abduzhaparov"].includes(i.fullName))
        } else if (nation == "Østtyskland") {
            return numerizeRanking(alltimeRankingAll).filter(i => ["Olaf Ludwig", "Uwe Raab", "Uwe Ampler"].includes(i.fullName))
        }
    } else {
        return numerizeRanking(alltimeRankingAll).filter(i => i.nation == nation);
    }
}

async function getDataFromNation(nation) {
    let { data: alltimeRankingAll } = await supabase
        .from('alltimeRanking')
        .select('*')

    let { data: nationsRanking } = await supabase
        .from('nationsRanking')
        .select('*')

    const alltimeRanking = findNation(nation, alltimeRankingAll);

    const curNation = nationsRanking.filter(i => i.nation == nation)

    return {
        nationData: { nation: curNation[0].nation, nationFlagCode: curNation[0].flagCode },
        ridersFromNation: alltimeRanking,
        alltimeRanking: alltimeRankingAll,
        nationsRanking: nationsRanking,
    };
}

function groupFunction(obj) {
    return (obj.reduce((acc, curr) => {
        const key = curr["nation"];
        const curPoints = acc[key] ?? { points: 0, numberOfRiders: 0 };

        return { ...acc, [key]: { points: curPoints.points + curr.points, nationFlagCode: curr.nationFlagCode, numberOfRiders: curPoints.numberOfRiders + 1 } };
    }, {}))
}


export default async function Page(props) {
    const nationCapitalized = props.nation.replace("oe", "ø").replace("aa", "å").replace("ae", "æ");
    let nationString;

    if (nationCapitalized == "usa") {
        nationString = "USA"
    } else {
        nationString = nationCapitalized.split("-").map(i => i.charAt(0).toUpperCase() + i.slice(1)).join(" ");
    }
    const fetchedData = await getDataFromNation(nationString);

    const alltimeRanking = fetchedData.alltimeRanking;

    const nationsRankings = numerizeRanking(fetchedData.nationsRanking)

    const activeNationsRankings = numerizeRanking(fetchedData.nationsRanking.filter(i => i.activePoints !== null).map(i => { return { ...i, points: i.activePoints, numberOfRiders: i.activeNumberOfRiders } }))

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