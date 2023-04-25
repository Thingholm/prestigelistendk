import "../../../../node_modules/flag-icons/css/flag-icons.min.css"

export default function NationProfile(props) {
    const nationData = props.nationData;

    return (
        <div className="nation-profile-info-container rider-profile-info-container">
            <span className={"rider-profile-info-image-container fi fi-" + nationData.nationFlagCode}></span>
            <div className="rider-profile-info-info-container">
                <h3>{nationData.nation}</h3>
                <p>Placering: <span className="profile-value-span">XX</span></p>
                <p>Point: <span className="profile-value-span">XX</span></p>
                <p>Aktive placering: <span className="profile-value-span">XX</span></p>
                <p>Aktive point: <span className="profile-value-span">XX</span></p>
            </div>
        </div>
    )
}