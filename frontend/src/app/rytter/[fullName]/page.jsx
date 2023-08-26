"use client";

import RiderProfile from "./RiderProfile";
import RiderResults from "./RiderResults";
import RiderEvolution from "./RiderEvolution";
import RiderAllResults from "./RiderAllResults";
import RiderRankingFromNation from "./RiderRankingFromNation";
import RiderRankingFromYear from "./RiderRankingFromYear";
import { stringEncoder, stringDecoder } from "@/components/stringHandler";
import numerizeRanking from "@/utils/numerizeRanking";
import { useAlltimeRanking, usePointSystem, useResultsByRider, useRiderRankingPerYear } from "@/utils/queryHooks";
import Loading from "./loading";
import CompareFloat from "./CompareFloat";

export default function Page(props) {
    const name = stringDecoder(props.fullName);

    const alltimeRankingQuery = useAlltimeRanking();
    const alltimeRanking = alltimeRankingQuery.data;

    const pointSystemQuery = usePointSystem();
    const pointSystem = pointSystemQuery.data

    const rankingByYearsQuery = useRiderRankingPerYear(name);
    const rankingByYears = rankingByYearsQuery.data;

    const riderResultsQuery = useResultsByRider(name);

    let riderResults;
    let resultRace = "";
    let riderData;
    let alltimeRankByNation;
    let rider;

    if (alltimeRanking && pointSystem && riderResultsQuery.isSuccess) {
        riderResults = riderResultsQuery.data?.map(result => {

            if (result.race.includes("etape")) {
                resultRace = result.race.split(". ")[1]
            } else {
                resultRace = result.race
            }
            const racePointSystem = pointSystem.find(p => p.raceName == resultRace);

            const mergedLists = {
                ...result,
                ...racePointSystem,
            }

            return (mergedLists)
        });

        riderData = numerizeRanking(alltimeRanking).find(i => i.fullName.toLowerCase() == name.toLowerCase());
        alltimeRankByNation = numerizeRanking(alltimeRanking.filter(i => i.nation == riderData.nation)).find(i => i.fullName.toLowerCase() == name.toLowerCase())

        if (riderData.active) {
            riderData = { ...riderData, activeRank: numerizeRanking(alltimeRanking.filter(i => i.active == true)).find(i => i.fullName.toLowerCase() == name.toLowerCase()).currentRank }
        }
    }

    return (
        <div className="rider-page-container">
            {riderData ?
                <div>
                    {riderData && <div className="rider-profile-container">
                        <RiderProfile riderData={riderData} alltimeRankByNation={alltimeRankByNation} />
                        <RiderResults resultData={riderResults} />
                    </div>}

                    {riderResults && rankingByYearsQuery.isSuccess &&
                        <div>
                            <RiderEvolution resultData={riderResults} rankingByYearData={rankingByYears[0]} />

                            <RiderAllResults resultData={riderResults} rankingByYearData={rankingByYears[0]} />
                        </div>
                    }

                    {riderData && <div className="rider-related-rankings-container">
                        <RiderRankingFromNation riderNation={riderData.nation} rider={name} />
                        <RiderRankingFromYear riderBirthYear={riderData.birthYear} rider={name} />
                    </div>}

                    <CompareFloat rider={riderData} />
                </div> :
                <Loading riderName={props.fullName} />}
        </div>

    )
}