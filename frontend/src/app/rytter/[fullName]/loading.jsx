import { stringDecoder } from "@/components/stringHandler";

export default function Loading(props) {
    return (
        <div className="rider-page-container loading-ui-container">
            <div className="rider-profile-container">
                <div className="rider-profile-info-container">
                    <div className="rider-profile-info-image-container">
                        <span></span>
                    </div>
                    <div className="rider-profile-info-info-container">
                        <h3>{stringDecoder(props.riderName)}</h3>
                        <p>Nationalitet: <span></span></p>
                        <p>Placering: <span></span></p>
                        <p>Point: <span></span></p>
                        <p>Årgang: <span></span></p>
                    </div>
                </div>

                <div className="rider-top-results-container">
                    <h4>Største resultater:</h4>
                    <ul>
                        {[...Array(7)].map((i, index) =>
                            <li key={index}><span></span></li>
                        )}
                    </ul>
                </div>
            </div>

            <div className="rider-evolution-container">
                <div className="chart-container">
                    <h3 className="light">Point opnået hvert år</h3>
                    <span></span>
                </div>

                <div className="chart-container">
                    <h3 className="light">Placering på Prestigelisten</h3>
                    <span></span>
                </div>
            </div>

            <div className="rider-all-results-container">
                <h3>Alle pointgivende resultater</h3>
                <span></span>
            </div>
        </div>
    )
}