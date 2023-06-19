import SectionLinkButton from "@/components/SectionLinkButton";
import { nationEncoder, stringEncoder } from "@/components/stringHandler";
import { baseUrl } from "@/utils/baseUrl";
import { supabase } from "@/utils/supabase";
import Link from "next/link";

async function fetchData() {
    let { data: greatestSeasons } = await supabase
        .from('greatestSeasons')
        .select('*');

    let { data: rankingAlltime } = await supabase
        .from('alltimeRanking')
        .select('*');

    let { data: pointSystem } = await supabase
        .from('pointSystem')
        .select('*')

    return {
        greatestSeasons: greatestSeasons.sort((a, b) => a.place - b.place),
        rankingAlltime: rankingAlltime,
        pointSystem: pointSystem,
    };
}

async function fetchResults(riders, years) {
    let { data: results } = await supabase
        .from('results')
        .select('*')
        .in('year', years)
        .in('rider', riders);
    return results;
}

export default async function GreatestSeasons() {
    const data = await fetchData();
    const rankingAlltime = data.rankingAlltime;
    const pointSystem = data.pointSystem;
    let greatestSeasons = data.greatestSeasons;
    let results;
    let resultsWithPoints;


    results = await fetchResults(
        greatestSeasons.reduce((acc, obj) => {
            if (!acc.includes(obj.rider)) {
                acc.push(obj.rider)
            }

            return acc;
        }, []),

        greatestSeasons.reduce((acc, obj) => {
            if (!acc.includes(obj.year)) {
                acc.push(obj.year)
            }
            return acc;
        }, [])
    )


    if (results) {
        const resultsGroupedByRider = results.map(i => {
            return {
                ...i,
                racePoints: pointSystem.find(j =>
                    j.raceName == (i.race.includes("etape") ? i.race.replace("&#39;", "'").split(". ")[1].replace(/comma/g, ",") : i.race.replace("&#39;", "'").replace(/comma/g, ","))
                ).points
            }
        }).reduce((acc, obj) => {
            const key = obj["rider"];
            const curGroup = acc[key] ?? [];
            let race = obj.race;

            if (obj.race.includes("etape")) {
                race = obj.race.split(". ")[1];
            }

            return { ...acc, [key]: [...curGroup, { ...obj, race: race, count: 1 }] }
        }, {})


        resultsWithPoints = Object.keys(resultsGroupedByRider).map(i => {

            return {
                [i]: resultsGroupedByRider[i].reduce((acc, obj) => {
                    const key = obj["year"];
                    const curGroup = acc[key] ?? [];

                    if (curGroup.map(j => j.race).includes(obj.race)) {
                        let index = curGroup.findIndex(j => j.race == obj.race)
                        if (!obj.race.includes("Dag i førertrøjen")) {
                            curGroup[index].racePoints += obj.racePoints;
                        }
                        curGroup[index].count += 1
                        return { ...acc, [key]: [...curGroup].sort((a, b) => b.racePoints - a.racePoints) }
                    } else {
                        return { ...acc, [key]: [...curGroup, obj].sort((a, b) => b.racePoints - a.racePoints) }
                    }
                }, {})
            }

        })

    }


    return (
        <div className="greatest-seasons-container" id="stoerste-saesoner">
            <h3>Største individuelle sæsoner <SectionLinkButton link={baseUrl + "/#stoerste-saesoner"} sectionName={"Største individuelle sæsoner"} bg={"grey"} /></h3>
            <div className="rounded-table-container">
                <div className="table-shadow-container">
                    <div className="table">
                        <div className="table-header">
                            <p>Nr.</p>
                            <p>Rytter</p>
                            <p>Største resultater</p>
                            <p>Sæson</p>
                            <p>Point<span className="media table-previous-span">sæson</span></p>
                        </div>
                        <div className="table-content">
                            {greatestSeasons && greatestSeasons.map((s, index) => {
                                const rider = rankingAlltime.find(i => i.fullName.toLowerCase() == s.rider.toLowerCase())
                                let riderTopResults;
                                if (resultsWithPoints.length > 10) {
                                    riderTopResults = Object.values(resultsWithPoints.find(i => Object.keys(i) == s.rider))[0][s.year]
                                }


                                return (
                                    <div key={index} className="table-row">
                                        <p>{s.place}</p>
                                        {rider && <p className='table-name-reversed'><Link href={"/rytter/" + stringEncoder(rider.fullName.replace("&#39;", "'"))}><span className={'fi fi-' + rider.nationFlagCode}></span><span className='last-name'>{rider.lastName.replace("&#39;", "'")} </span>{rider.firstName}</Link></p>}
                                        {riderTopResults &&
                                            <p>{riderTopResults.slice(0, 3).map((i, index) => {
                                                let race = i.race.replace("&#39;", "'").split(" (")[0]
                                                if (race.includes("etape")) {
                                                    race = i.count + "x " + race.replace("etape", "etaper");
                                                }
                                                return (index !== 2 ? <span className="race-name-span">{race}, </span> : <span>{race}</span>)
                                            })}</p>}
                                        <p>{s.year}</p>
                                        <p>{s.points}<span className="media table-previous-span">{s.year}</span></p>
                                    </div>
                                )
                            })}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}