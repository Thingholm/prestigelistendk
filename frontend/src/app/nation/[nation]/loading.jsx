import { stringDecoder, nationEncoder } from "@/components/stringHandler";
import { nationFlagCodes } from "@/utils/nationFlagCodes";
import Link from "next/link";

export default function NationLoading(props) {
    const nationFlagCode = nationFlagCodes.find(i => i.nation.toLowerCase() == props.nation.replace("oe", "ø").replace("ae", "æ").replace("aa", "å").replace("-", " ")).nationFlagCode

    return (
        <div className="nation-page-container loading-ui-container">
            <div className="nation-profile-container rider-profile-container">
                <div className="nation-profile-info-container rider-profile-info-container">
                    <div className="nation-profile-info-image-container">
                        <span className={"fi fi-" + nationFlagCode}></span>
                    </div>

                    <div className="rider-profile-info-info-container">
                        <h3>{stringDecoder(props.nation).replace("Oe", "Ø").replace("ae", "æ")}</h3>
                        <p>Placering: <span></span></p>
                        <p>Point: <span></span></p>
                        <p>Placering (Kun aktive): <span></span></p>
                        <p>Point (Kun aktive): <span></span></p>
                    </div>
                </div>

                <div className="rider-top-results-container">
                    <h4>Største ryttere fra {stringDecoder(props.nation).replace("Oe", "Ø").replace("ae", "æ")} all time</h4>
                    <ul>
                        {[...Array(6)].map((i, index) => {
                            return (
                                <li key={index}><span></span></li>
                            )
                        })}
                    </ul>
                    <p><Link href={"listen?nation=" + nationEncoder(props.nation)}>Se alle ryttere på Prestigelisten fra {stringDecoder(props.nation)}...</Link></p>
                </div>
            </div>

            <div className="nation-evolution-container">
                <div className="by-year-charts-container charts-container">
                    <div className="chart-container">
                        <h3 className="light">Point opnået pr. år</h3>
                        <span></span>
                    </div>
                    <div className="chart-container">
                        <h3 className="light">Placering på listen over nationer med flest optjente point hvert år</h3>
                        <span></span>
                    </div>
                </div>

                <div className="acc-charts-container charts-container">
                    <div className="chart-container">
                        <h3 className="light">Akkumulerede Prestigelisten-point</h3>
                        <span></span>
                    </div>
                    <div className="chart-container">
                        <h3 className="light">Placering på listen over største nationer</h3>
                        <span></span>
                    </div>
                </div>
            </div>
        </div>
    )
}