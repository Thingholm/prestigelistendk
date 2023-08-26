import RiderImage from "../rytter/[fullName]/RiderImage";
import "@/../flag-icons/css/flag-icons.min.css"

export default function ComparisonRiderProfile(props) {
    const riderData = props.alltimeRanking.find(i => i.fullName == props.riderName)

    return (
        <div className="comparison-rider-profile-container">
            <RiderImage riderInfo={riderData} />
            <h3>{props.riderName}</h3>
            <p>Nation: <span><span className={"fi fi-" + riderData.nationFlagCode}></span>{riderData.nation}</span></p>
            <p>Årgang: <span>{riderData.birthYear}</span></p>
            <p>Point: <span>{riderData.points}</span></p>
            <p>Placering all time: <span>{riderData.currentRank}</span></p>
            <p>Placering blandt aktive: <span>{props.activeRanking.find(i => i.fullName == props.riderName).currentRank}</span></p>
            <p>Placering i {riderData.nation}: <span>{props.rankingByNation.find(i => i.fullName == props.riderName).currentRank}</span></p>
            {props.groupedPoints && Object.keys(props.groupedPoints).map(cat => {
                return (
                    <p key={cat}>{cat}: <span>{props.groupedPoints[cat]}</span></p>
                )
            })}
        </div>
    )
}