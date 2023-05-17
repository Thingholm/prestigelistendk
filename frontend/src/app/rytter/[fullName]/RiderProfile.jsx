import SectionLinkButton from "@/components/SectionLinkButton";
import { nationEncoder, stringEncoder } from "@/components/stringHandler";
import { baseUrl } from "@/utils/baseUrl";
import Link from "next/link";

export default function RiderProfile(props) {
    const rider = props.riderData;

    return (
        <div className="rider-profile-info-container">
            <div className="rider-profile-info-image-container">
                {rider.active && <img src={"https://fyoonxbvccocgqkxnjqs.supabase.co/storage/v1/object/public/riderPortraits/" + rider.fullName.replace(" ", "").toLowerCase() + ".jpg"} />}
            </div>
            <div className="rider-profile-info-info-container">
                <h3 className="rider-profile-title">{rider.fullName} <SectionLinkButton link={baseUrl + "/rytter/" + stringEncoder(rider.fullName)} sectionName={rider.fullName} /></h3>
                <p>Nationalitet: <Link href={"nation/" + nationEncoder(rider.nation)}><span className="profile-value-span"><span className={'fi fi-' + rider.nationFlagCode}></span> {rider.nation}</span></Link></p>
                {rider.active && <p>Hold: <span className="profile-value-span">{rider.currentTeam}</span></p>}
                <p>Placering: <Link href={"listen"}><span className="profile-value-span">{rider.currentRank}</span></Link></p>
                {rider.active && <p>Placering (aktive): <Link href={"listen?activeStatus=active"}><span className="profile-value-span">{rider.activeRank}</span></Link></p>}
                <p>Point: <span className="profile-value-span">{rider.points}</span></p>
                <p>Årgang: <Link href={"listen?yearFilterRange=single&bornBefore=" + rider.birthYear}><span className="profile-value-span">{rider.birthYear}</span></Link></p>
            </div>
        </div>
    )
}