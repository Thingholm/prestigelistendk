"use client";

import SectionLinkButton from "@/components/SectionLinkButton";
import { stringEncoder } from "@/components/stringHandler";
import { baseUrl } from "@/utils/baseUrl";
import { useAlltimeRanking, useThreeYearRanking } from "@/utils/queryHooks";
import useStore from "@/utils/store";
import { supabase } from "@/utils/supabase";
import Link from "next/link";
import { useEffect, useState } from "react";

export default function ThreeYearRanking() {
    const [loadedAmount, setLoadedAmount] = useState(10);

    const alltimeRankingQuery = useAlltimeRanking();
    const alltimeRanking = alltimeRankingQuery.data

    const threeYearRankingQuery = useThreeYearRanking();
    const threeYearRanking = threeYearRankingQuery.data?.sort((a, b) => b.year - a.year)

    return (
        <div className="three-year-ranking-container" id="3-aarig-rullende">
            <h3>Største ryttere over en 3-årig periode <SectionLinkButton link={baseUrl + "/#3-aarig-rullende"} sectionName={"3-årig rullende rangliste"} /></h3>
            <div className="table-wrapper">
                <div className="table-shadow-container">
                    <div className="table">
                        <div className="table-header">
                            <p>Periode</p>
                            <p>1.</p>
                            <p>2.</p>
                            <p>3.</p>
                            <p>4.</p>
                            <p>5.</p>
                            <p>6.</p>
                            <p>7.</p>
                            <p>8.</p>
                            <p>9.</p>
                            <p>10.</p>
                        </div>
                        <div className="table-content">
                            {threeYearRankingQuery.isSuccess && alltimeRankingQuery.isSuccess && threeYearRanking.slice(0, loadedAmount).map(year => {
                                return (
                                    <div key={year.year} className="table-row">
                                        <p>{year.year}<span className="table-previous-span">{year.year - 2}</span></p>
                                        {[...Array(10)].map((i, index) => {
                                            const rider = alltimeRanking.find(j => j.fullName.toLowerCase() == year[index + 1].toLowerCase());
                                            const nameArr = rider.fullName.split(/ (.*)/);

                                            if (rider) {
                                                return (
                                                    <p key={index} className="table-name-reversed"><Link href={"/rytter/" + stringEncoder(rider.fullName)}><span className={"fi fi-" + rider.nationFlagCode}></span><span className='last-name'>{nameArr[1]} </span> <span>{nameArr[0]}</span></Link></p>
                                                )
                                            }

                                        })}
                                    </div>
                                )
                            })}
                            {loadedAmount < 200 && <button className="table-bottom-button vertical" onClick={() => setLoadedAmount(200)}>...</button>}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}