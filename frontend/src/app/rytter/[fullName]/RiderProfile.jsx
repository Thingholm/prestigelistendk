export default function RiderProfile(props) {
    const rider = props.riderData;

    return (
        <div className="rider-profile-info-container">
            <div className="rider-profile-info-image-container">
                {rider.active && <img src={"https://fyoonxbvccocgqkxnjqs.supabase.co/storage/v1/object/public/riderPortraits/" + rider.fullName.replace(" ", "").toLowerCase() + ".jpg"} />}
            </div>
            <div className="rider-profile-info-info-container">
                <h3>{rider.fullName}</h3>
                <p>Nationalitet: <span className="profile-value-span"><span className={'fi fi-' + rider.nationFlagCode}></span> {rider.nation}</span></p>
                {rider.active && <p>Hold: <span className="profile-value-span">{rider.currentTeam}</span></p>}
                <p>Placering: <span className="profile-value-span">XX</span></p>
                {rider.active && <p>Aktive placering: <span className="profile-value-span">XX</span></p>}
                <p>Point: <span className="profile-value-span">{rider.points}</span></p>
                <p>Årgang: <span className="profile-value-span">{rider.birthYear}</span></p>
            </div>
        </div>
    )
}