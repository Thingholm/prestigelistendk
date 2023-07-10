"use client";

import useStore from "@/utils/store";
import { supabase } from "@/utils/supabase";
import { useEffect, useState } from "react";
import Link from "next/link";
import { stringEncoder } from "@/components/stringHandler";
import { baseUrl } from "@/utils/baseUrl";
import SectionLinkButton from "@/components/SectionLinkButton";
import { IoCaretDownOutline, IoCaretUpOutline } from "react-icons/io5";
import { useAlltimeEachYear, useAlltimeRanking } from "@/utils/queryHooks";
import TableSkeleton from "@/components/TableSkeleton";

export default function Top10AlltimeEachYear() {
    const [amountLoaded, setLoadedAmount] = useState(10);

    const alltimeTop10PerYearQuery = useAlltimeEachYear();
    const alltimeTop10PerYear = alltimeTop10PerYearQuery.data?.sort((a, b) => b.year - a.year);

    const alltimeRankingQuery = useAlltimeRanking();
    const alltimeRanking = alltimeRankingQuery.data;

    return (
        <div className=" alltime-each-year" id="stoerste-alltime-hvert-aar">
            <h3>Største all time hvert år <SectionLinkButton link={baseUrl + "/#stoerste-alltime-hvert-aar"} sectionName={"Største all time hvert år"} /></h3>
            <div className="table-wrapper">
                <div className="table">
                    <div className="table-header">
                        <p>År</p>
                        {[...Array(10)].map((i, index) => {
                            return (
                                <p key={index}>{index + 1}.</p>
                            )
                        })}
                    </div>

                    <div className="table-content">
                        {alltimeTop10PerYearQuery.isSuccess && alltimeRankingQuery.isSuccess ? alltimeTop10PerYear.slice(0, amountLoaded).map(year => {
                            return (
                                <div key={year.id} className="table-row">
                                    <p>{year.year}</p>
                                    {[...Array(10)].map((i, index) => {
                                        const rider = alltimeRanking.find(j => j.fullName.toLowerCase() == year[index + 1].toLowerCase().replace("<", "").replace(">", ""));
                                        let movement = "none";

                                        if (year[index + 1].includes("<")) {
                                            movement = "up";
                                        } else if (year[index + 1].includes(">")) {
                                            movement = "down";
                                        }

                                        const nameArr = rider.fullName.split(/ (.*)/);

                                        return (
                                            <p className="table-name-reversed" key={index}>
                                                <Link href={"/rytter/" + stringEncoder(rider.fullName)}>
                                                    <span className={"fi fi-" + rider.nationFlagCode}></span>
                                                    <span className='last-name'>{nameArr[1]} </span>
                                                    <span>{nameArr[0]}</span>
                                                    {movement !== "none" &&
                                                        (movement == "up" ?
                                                            <span className="up"><IoCaretUpOutline /></span> :
                                                            <span className="down"><IoCaretDownOutline /></span>
                                                        )
                                                    }
                                                </Link>
                                            </p>
                                        )
                                    })}
                                </div>
                            )
                        }) : <TableSkeleton />}
                        {amountLoaded < 80 && <button className="table-bottom-button vertical" onClick={() => setLoadedAmount(137)}>...</button>}

                    </div>
                </div>
            </div>
        </div>
    )
}