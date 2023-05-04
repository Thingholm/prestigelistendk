import RankingLinkHeader from "@/components/RankingLinkHeader";
import { supabase } from "@/utils/supabase";
import Link from "next/link";

async function getResultsData(riders) {
    let { data: resultData } = await supabase
        .from('results')
        .select('*')
        .in('rider', riders)
    return resultData;
}

async function getPointSystem() {
    let { data: pointSystem } = await supabase
        .from('pointSystem')
        .select('*')

    return pointSystem;
}

export default async function NationTopResults(props) {
    const nation = props.nationData;
    const ridersFromNation = props.ridersData;

    let results;
    if (['Italien', 'Belgien', 'Frankrig', 'Spanien'].includes(nation)) {
        results = await getResultsData(ridersFromNation.sort((a, b) => b.points - a.points).map(i => i.fullName).slice(0, 300))
    } else {
        results = await getResultsData(ridersFromNation.sort((a, b) => b.points - a.points).map(i => i.fullName))
    }

    const pointSystem = await getPointSystem();

    const sortedResults = results.map(i => {
        let resultRace = i.race.replace("&#39;", "'");

        if (resultRace.includes("etape")) {
            resultRace = resultRace.split(". ")[1];
        }

        return {
            ...pointSystem.find(j => j.raceName == resultRace),
            ...i,
        };
    }).reduce((acc, curr) => {
        if (!acc.find((item) => item.raceName == curr.raceName)) {
            acc.push({ ...curr, resultAmount: 1, yearArr: [{ year: curr.year, rider: curr.rider }] });
        } else {
            const currentEleInAcc = acc[acc.map(i => i.raceName).indexOf(curr.raceName)]
            currentEleInAcc.rider += "&" + curr.rider;
            currentEleInAcc.yearArr.push({ year: curr.year, rider: curr.rider });
            currentEleInAcc.resultAmount++;
        }

        return acc;
    }, []).map(i => {
        return {
            ...i, rider: i.rider.split("&").reduce((acc, curr) => {
                if (!acc.includes(curr)) {
                    acc.push(curr);
                }
                return acc;
            }, [])
        }
    }).sort((a, b) => b.points - a.points).slice(0, 10);

    return (
        <div className="nation-top-results-container">
            <RankingLinkHeader title={"Største resultater af ryttere fra " + nation} link="#" />
            <div className="table">
                <div className="table-header">
                    <p>Point</p>
                    <p>Antal</p>
                    <p>Resultat</p>
                    <p>Rytter</p>
                </div>
                <div className="table-content">
                    {sortedResults.map(result => {
                        return (
                            <div key={result.id} className="table-row">
                                <p>{result.points}</p>
                                <p>{result.resultAmount}</p>
                                <p>{result.nationFlagCode} {result.raceName.includes("<") ? result.raceName : result.raceName.split(" (")[0]}</p>
                                <p>{result.rider.length > 0 ?
                                    result.rider.map((name, index) => {
                                        if (index > 0) {
                                            return <Link href="#">{", " + name + " (" + result.yearArr.filter(j => j.rider == name).map((j, indexN) => { if (indexN > 0) { return " " + j.year } else { return j.year } }) + ")"}</Link>
                                        } else {
                                            return <Link href="#">{name + " (" + result.yearArr.filter(j => j.rider == name).map((j, indexN) => { if (indexN > 0) { return " " + j.year } else { return j.year } }) + ")"}</Link>
                                        }
                                    }) : result.rider}</p>
                            </div>
                        )
                    })}
                </div>
            </div>
        </div>
    )
}