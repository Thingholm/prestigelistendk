import NationByYearChart from "./NationByYearChart";
import NationAccChart from "./NationAccChart";
import MobileChartsContainer from "./MobileChartsContainer";
import { useNationResultCount, useNationsAccRankByNation, useNationsRankByYear } from "@/utils/queryHooks";

export default function NationEvolution(props) {
    const nationsAccRank = useNationsAccRankByNation(props.nationData)
    const filteredAccRanking = nationsAccRank.isSuccess && Object.keys(nationsAccRank.data[0])
        .filter(i => i.includes("Rank"))
        .map(i => { return { year: parseInt(i.replace("Rank", "")), rank: nationsAccRank.data[0][i], points: nationsAccRank.data[0][i.replace("Rank", "Points")] } })

    const nationsRankByYear = useNationsRankByYear(props.nationData)
    const filteredRankByYear = nationsRankByYear.isSuccess && Object.keys(nationsRankByYear.data[0])
        .filter(i => i.includes("Rank"))
        .map(i => { return { year: parseInt(i.replace("Rank", "")), rank: nationsRankByYear.data[0][i], points: nationsRankByYear.data[0][i.replace("Rank", "Points")] } })

    const nationResultCountQuery = useNationResultCount(props.nationData);
    const nationResultCount = nationResultCountQuery.isSuccess && nationResultCountQuery.data

    return (
        <div className="nation-evolution-container">
            <div className="media">
                {filteredRankByYear && filteredAccRanking && nationResultCount && <MobileChartsContainer rankingData={filteredRankByYear} accData={filteredAccRanking} countData={nationResultCount[0]} />}
            </div>
            {filteredRankByYear && filteredAccRanking && nationResultCount && <NationByYearChart rankingData={filteredRankByYear} accData={filteredAccRanking} />}
            {filteredRankByYear && filteredAccRanking && nationResultCount && <NationAccChart rankingData={filteredAccRanking} countData={nationResultCount[0]} />}
        </div>
    )
}