import Link from "next/link";
import "../../../../node_modules/flag-icons/css/flag-icons.min.css"

export default function NationProfile(props) {
    const nationData = props.nationData;

    return (
        <div className="nation-profile-info-container rider-profile-info-container">
            <div className="nation-profile-info-image-container">
                <span className={"fi fi-" + nationData.nationFlagCode}></span>
            </div>

            <div className="rider-profile-info-info-container">
                <h3>{nationData.nation}</h3>
                <p>Placering: <Link href={"/nationer"}><span className="profile-value-span">{props.nationRankData.currentRank}</span></Link></p>
                <p>Point: <span className="profile-value-span">{props.nationRankData.points}</span></p>
                <p>Placering (Aktive): <span className="profile-value-span">{props.activeNationRankData ? props.activeNationRankData.currentRank : "Ingen aktive ryttere"}</span></p>
                <p>Point (Aktive): <span className="profile-value-span">{props.activeNationRankData ? props.activeNationRankData.points : "Ingen aktive ryttere"}</span></p>
            </div>
        </div>
    )
}