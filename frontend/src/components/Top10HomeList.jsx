import { useEffect, useState } from "react";
import { useSelector } from "react-redux";

function Top10HomeList() {
    const ranking = useSelector(state => state.alltimeRanking);
    const [rankingByPoints, setRankingByPoints] = useState([]);

    useEffect(() => {
        function sortRanking() {
            let sortedRanking = ranking.alltimeRanking.slice().sort((a, b) => {
                return b.points - a.points;
            })

            setRankingByPoints(sortedRanking);
        }

        sortRanking();

        console.log(rankingByPoints);
    }, [ranking])

    return (
        <div className="landing-alltime-ranking-container">
            <h2 className="sec-header">De 10 største ryttere nogensinde</h2>
            <div className="ranking-table-container">
                <div className="ranking-table-titles ranking-table">
                    <p>Placering</p>
                    <p>Rytter</p>
                    <p>Nation</p>
                    <p>Årgang</p>
                    <p>Point</p>
                </div>
                {rankingByPoints && rankingByPoints.slice(0, 10).map((rider, index) => {
                    return (
                        <div className={"rank-nr-" + (index + 1) + " ranking-table-row ranking-table"} key={index}>
                            <p>{index + 1}</p>
                            <p><span>{rider.lastName}</span> {rider.firstName}</p>
                            <p><span className={"fi-" + rider.nationFlagCode + " fi"}></span> {rider.nation}</p>
                            <p>{rider.birthYear}</p>
                            <p>{rider.points}</p>
                        </div>
                    )
                })}
            </div>
        </div>
    )

}

export default Top10HomeList;