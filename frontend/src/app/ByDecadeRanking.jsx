"use client";

import useStore from "@/utils/store";
import { supabase } from "@/utils/supabase";
import { useEffect, useState } from "react";
import Link from "next/link";
import { stringEncoder } from "@/components/stringHandler";
import { baseUrl } from "@/utils/baseUrl";
import SectionLinkButton from "@/components/SectionLinkButton";
import { useAlltimeEachDecade, useAlltimeRanking } from "@/utils/queryHooks";
import TableSkeleton from "@/components/TableSkeleton";

export default function ByDecadeRanking() {
    const [amountLoaded, setLoadedAmount] = useState(10);

    const alltimeEachDecadeQuery = useAlltimeEachDecade();
    const alltimeEachDecade = alltimeEachDecadeQuery.data?.sort((a, b) => b.decade - a.decade);

    const alltimeRankingQuery = useAlltimeRanking();
    const alltimeRanking = alltimeRankingQuery.data;

    return (
        <div className="ranking-each-decade-container" id="stoerste-per-aarti">
            <h3>Største ryttere hvert årti <SectionLinkButton link={baseUrl + "/#stoerste-per-aarti"} sectionName={"Største ryttere hvert årti"} /></h3>
            <div className="table-wrapper">
                <div className="table-overflow-container">
                    <div className="table">
                        <div className="table-header">
                            <p>Årti</p>
                            {[...Array(amountLoaded)].map((i, index) => {
                                return (
                                    <p key={index}>{index + 1}.</p>
                                )
                            })}
                        </div>

                        <div className="table-content">
                            {alltimeEachDecade && alltimeRanking ? alltimeEachDecade.map(decade => {
                                return (
                                    <div key={decade.id} className="table-row">
                                        <p>{decade.decade}&#39;erne</p>
                                        {[...Array(amountLoaded)].map((i, index) => {
                                            const rider = alltimeRanking.find(j => j.fullName.toLowerCase() == decade[index + 1].toLowerCase());

                                            const nameArr = rider.fullName.split(/ (.*)/);

                                            return (
                                                <p className="table-name-reversed" key={index}>
                                                    <Link href={"/rytter/" + stringEncoder(rider.fullName)}>
                                                        <span className={"fi fi-" + rider.nationFlagCode}></span>
                                                        <span className='last-name'>{nameArr[1]} </span>
                                                        <span>{nameArr[0]}</span>
                                                    </Link>
                                                </p>
                                            )
                                        })}
                                    </div>
                                )
                            }) : <TableSkeleton />}
                            {amountLoaded < 80 && <button className="table-bottom-button vertical" onClick={() => setLoadedAmount(80)}>...</button>}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}