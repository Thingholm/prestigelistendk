import { useSelector } from "react-redux";

function Top10HomeList() {
    const ranking = useSelector(state => state.alltimeRanking);

    return (
        <div className="landing-alltime-ranking-container">
            <h2>Top10 ryttere nogensinde:</h2>
            <div className="ranking-table-container">
                <div className="ranking-table-titles">
                    <p>Placering</p>
                    <p>Nation</p>
                    <p>Rytter</p>
                    <p>Årgang</p>
                    <p>Point</p>
                </div>
                {ranking.alltimeRanking && ranking.alltimeRanking.slice(0, 10).map((rider, index) => {
                    return (
                        <div className="ranking-table-row" key={index}>
                            <p>{index + 1}</p>
                            <span className={"fi-" + rider.nationFlagCode + " fi"}></span>
                            <p>{rider.firstName} <b>{rider.lastName}</b></p>
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