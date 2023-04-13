export default function RiderProfile(props) {
    const rider = props.riderData;

    return (
        <div className="rider-profile-container">
            <div className="rider-profile-image-container">

            </div>
            <div className="rider-profile-info-container">
                <h3>{rider.fullName}</h3>
                <p>Nationalitet: <span className={'fi fi-' + rider.nationFlagCode}></span> {rider.nation}</p>
                <p>Placering: XX</p>
                <p>Point: {rider.points}</p>
                <p>Årgang: {rider.birthYear}</p>
            </div>
        </div>
    )
}