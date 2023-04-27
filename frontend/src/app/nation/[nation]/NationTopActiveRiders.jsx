import RankingLinkHeader from "@/components/RankingLinkHeader";
import numerizeRanking from "@/utils/numerizeRanking";

export default function NationTopActiveRiders(props) {
    const ridersData = numerizeRanking(props.ridersData.filter(i => i.active == true));

    return (
        <div className="table-wrapper">
            <RankingLinkHeader title={"Største aktive ryttere fra " + props.nationData} link="#" mode="light" />
            <div className="table landing-ranking-rounded-container">
                <div className="table-header">
                    <p>Nr.</p>
                    <p>Rytter</p>
                    <p>Årgang</p>
                    <p>Point</p>
                </div>
                <div className="table-content">
                    {ridersData && ridersData.map(rider => {
                        return (
                            <div key={rider.id} className="table-row">
                                <p>{rider.currentRank}</p>
                                <p className="table-name-reversed"><span className={'fi fi-' + rider.nationFlagCode}></span><span className="last-name">{rider.lastName} </span><span>{rider.firstName}</span></p>
                                <p>{rider.birthYear}</p>
                                <p>{rider.points}</p>
                            </div>
                        )
                    })}
                </div>
            </div>
        </div>

    )
}