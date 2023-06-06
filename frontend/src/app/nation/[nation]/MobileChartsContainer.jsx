"use client";

import { useState } from "react";
import NationByYearChart from "./NationByYearChart";
import NationAccChart from "./NationAccChart";

export default function MobileChartsContainer(props) {
    const [graphShowStatus, setGraphShowStatus] = useState(1);

    return (
        <div className="mobile-charts-container">
            <div className="mobile-charts-header-and-options-container">
                <h3>Karriere i grafer</h3>
                <div className="btn-container">
                    <button onClick={() => setGraphShowStatus(1)} className={graphShowStatus == 1 && "btn-active"}>Point opnået hvert år</button>
                    <button onClick={() => setGraphShowStatus(2)} className={graphShowStatus == 2 && "btn-active"}>Årlig placering</button>
                    <button onClick={() => setGraphShowStatus(3)} className={graphShowStatus == 3 && "btn-active"}>Akkumulerede point</button>
                    <button onClick={() => setGraphShowStatus(4)} className={graphShowStatus == 4 && "btn-active"}>Udv. i all time placering</button>
                </div>
            </div>

            <NationByYearChart rankingData={props.rankingData} accData={props.accData} active={graphShowStatus} />
            <NationAccChart rankingData={props.accData} active={graphShowStatus} />
        </div>
    )
}