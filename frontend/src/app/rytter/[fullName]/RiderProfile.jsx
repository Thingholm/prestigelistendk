import SectionLinkButton from "@/components/SectionLinkButton";
import { nationEncoder, stringEncoder } from "@/components/stringHandler";
import { baseUrl } from "@/utils/baseUrl";
import Image from "next/image";
import Link from "next/link";
import RiderImage from "./RiderImage";

export default function RiderProfile(props) {
    const rider = props.riderData;
    const alltimeRankByNation = props.alltimeRankByNation;

    return (
        <div className="rider-profile-info-container">
            <div className="rider-profile-info-image-container">
                <RiderImage riderInfo={rider} />
            </div>
            <div className="rider-profile-info-info-container">
                <h3 className="rider-profile-title">{rider.fullName.replace("&#39;", "'")} <SectionLinkButton link={baseUrl + "/rytter/" + stringEncoder(rider.fullName)} sectionName={rider.fullName.replace("&#39;", "'")} /></h3>
                <p>Nationalitet: <Link href={"nation/" + nationEncoder(rider.nation)}><span className="profile-value-span"><span className={'fi fi-' + rider.nationFlagCode}></span> {rider.nation}</span></Link></p>
                {rider.active && <p>Hold: <span className="profile-value-span">{rider.currentTeam}</span></p>}
                <p>Placering all time: <Link href={"listen"}><span className="profile-value-span">{rider.currentRank}</span></Link></p>
                <p>Placering all time (Kun {rider.nation}) : <Link href={"listen?nation=" + rider.nation}><span className="profile-value-span">{alltimeRankByNation.currentRank}</span></Link></p>
                {rider.active && <p>Placering (Kun aktive): <Link href={"listen?activeStatus=active"}><span className="profile-value-span">{rider.activeRank}</span></Link></p>}
                <p>Point: <span className="profile-value-span">{rider.points}</span></p>
                <p>Årgang: <Link href={"listen?yearFilterRange=single&bornBefore=" + rider.birthYear}><span className="profile-value-span">{rider.birthYear}</span></Link></p>
            </div>
        </div>
    )
}