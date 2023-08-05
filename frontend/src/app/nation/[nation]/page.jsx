"use client";

import { supabase } from "@/utils/supabase"
import NationProfile from "./NationProfile";
import NationRidersHighlight from "./NationRidersHighlight";
import NationEvolution from "./NationEvolution";
import NationTopRiders from "./NationTopRiders";
import NationTopActiveRiders from "./NationTopActiveRiders";
import NationTopResults from "./NationTopResults";
import RankingNationsNation from "./RankingNations";
import numerizeRanking from "@/utils/numerizeRanking";
import { useAlltimeRanking, useNationRanking } from "@/utils/queryHooks";
import NationLoading from "./loading";

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


export default function Page(props) {
    const nationCapitalized = props.nation.replace("oe", "ø").replace("aa", "å").replace("ae", "æ");
    let nationString;

    if (nationCapitalized == "usa") {
        nationString = "USA"
    } else {
        nationString = nationCapitalized.split("-").map(i => i.charAt(0).toUpperCase() + i.slice(1)).join(" ");
    }

    let isLoaded = false;

    const alltimeRankingQuery = useAlltimeRanking();
    const alltimeRanking = alltimeRankingQuery.data;

    const ridersFromNation = alltimeRanking && findNation(nationString, alltimeRanking)

    const nationRankingQuery = useNationRanking();
    const nationsRanking = nationRankingQuery.isSuccess && numerizeRanking(nationRankingQuery.data)

    const activeNationsRanking = nationRankingQuery.isSuccess && numerizeRanking(nationsRanking.filter(i => i.activePoints !== null).map(i => { return { ...i, points: i.activePoints, numberOfRiders: i.activeNumberOfRiders } }))

    const nationData = nationsRanking && { nation: nationsRanking.filter(i => i.nation == nationString)[0].nation, nationFlagCode: nationsRanking.filter(i => i.nation == nationString)[0].flagCode }

    const currentNationRank = nationsRanking && nationsRanking.find(i => i.nation == nationString)
    const currentNationActiveRank = activeNationsRanking && activeNationsRanking.find(i => i.nation == nationString)

    if (currentNationActiveRank) {
        isLoaded = true
    } else if (currentNationRank) {
        isLoaded = true
    }

    return (
        <div className="nation-page-container">
            {isLoaded && nationData && currentNationRank && ridersFromNation ?
                <div>
                    {nationData && ridersFromNation && isLoaded && <div className="nation-profile-container rider-profile-container">
                        <NationProfile nationData={nationData} nationRankData={currentNationRank} activeNationRankData={currentNationActiveRank} />
                        <NationRidersHighlight ridersData={ridersFromNation} nationData={nationData} />
                    </div>}

                    <NationEvolution nationData={nationString} />

                    {ridersFromNation && <NationTopResults nationData={nationString} ridersData={ridersFromNation} />}

                    {ridersFromNation && <div className="nation-rankings-container riders-ranked dark">
                        <NationTopRiders ridersData={ridersFromNation} nationData={nationString} />
                        <NationTopActiveRiders ridersData={ridersFromNation} nationData={nationString} />
                    </div>}

                    {activeNationsRanking && <RankingNationsNation currentNation={nationString} rankingNations={nationsRanking} activeRankingNations={activeNationsRanking} />}
                </div>
                : <NationLoading nation={props.nation} />}

        </div>
    )
}