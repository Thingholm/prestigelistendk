import TableSkeleton from "@/components/TableSkeleton"
import { nationEncoder, stringEncoder } from "@/components/stringHandler";
import numerizeRanking from "@/utils/numerizeRanking";
import { useAlltimeEachYear, useAlltimeRanking, useAlltimePointsPerYearAcc } from "@/utils/queryHooks";
import { useSearchParams } from "next/navigation"
import { useEffect, useState } from "react";
import Link from "next/link";
import "../../../node_modules/flag-icons/css/flag-icons.min.css"

export default function AgeRanking() {
    const [rankingByAge, setRankingByAge] = useState();
    const [amountLoaded, setAmountLoaded] = useState(100);
    const [currAge, setCurrAge] = useState();
    const searchParams = useSearchParams();
    const selectedAge = searchParams.toString().replace("=", "");

    const alltimeRankingQuery = useAlltimeRanking();

    const alltimePointsPerYear = useAlltimePointsPerYearAcc();

    useEffect(() => {
        if (alltimePointsPerYear.isSuccess && alltimeRankingQuery.isSuccess) {
            if (!rankingByAge || selectedAge !== currAge) {
                setCurrAge(selectedAge);
                setRankingByAge(numerizeRanking(alltimePointsPerYear.data.reduce((acc, obj) => {
                    const key = obj.rider;
                    const rider = alltimeRankingQuery.data.find(i => i.fullName.toLowerCase() == key.toLowerCase());
                    const birthYear = rider && rider?.birthYear;
                    const agePoints = Object.entries(obj).slice(2).filter(i => i[1] !== 0 && (parseInt(i[0].replace("Points", "")) - birthYear) == selectedAge)

                    if (agePoints.length > 0 && birthYear && !["Henri Bertrand"].includes(key)) {
                        return [...acc, { ...rider, points: agePoints[0][1] }]
                    } else {
                        return acc
                    }
                }, [])))
            }
        }
    }, [alltimePointsPerYear, alltimeRankingQuery])

    return (
        <div className="age-container">
            <div className="table">
                <div className="table-header">
                    <p><span className="media">Nr.</span><span>Placering</span></p>
                    <p>Rytter</p>
                    <p>Nationalitet</p>
                    <p>Årgang</p>
                    <p>Point</p>
                </div>
                <div className="table-content">
                    {rankingByAge ?
                        rankingByAge.slice(0, amountLoaded).map((i, index) => {
                            const nameArr = i.fullName.split(/ (.*)/);
                            return (
                                <div key={index} className="table-row">
                                    <p>{i.currentRank.toLocaleString("de-DE")}</p>
                                    <p className='table-name-reversed'><Link href={"/rytter/" + stringEncoder(i.fullName)}><span className={'media fi fi-' + i.nationFlagCode}></span><span className='last-name'>{nameArr[1]} </span><span className='first-name'>{nameArr[0]}</span></Link></p>
                                    <p><Link href={"/nation/" + nationEncoder(i.nation)}><span className={"fi fi-" + i.nationFlagCode}></span>{i.nation}</Link></p>
                                    <p>{i.birthYear}</p>
                                    <p>{i.points.toLocaleString("de-DE")}</p>
                                </div>
                            )
                        })
                        : <TableSkeleton />}
                    {rankingByAge?.length > amountLoaded && <button className="load-more-results-button" onClick={() => setAmountLoaded(amountLoaded + 100)}>Indlæs flere...</button>}

                </div>
            </div>
        </div>
    )
}