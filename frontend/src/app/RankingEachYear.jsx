"use client";

import SectionLinkButton from "@/components/SectionLinkButton";
import { stringEncoder } from "@/components/stringHandler";
import { baseUrl } from "@/utils/baseUrl";
import { supabase } from "@/utils/supabase"
import Link from "next/link";
import { useEffect, useState } from "react";
import { IoCaretDownOutline, IoCaretUpOutline } from "react-icons/io5";

async function fetchData() {
    let { data: alltimePerYear } = await supabase
        .from('alltimeTop10PerYear')
        .select('*');
    return alltimePerYear;
}

async function fetchRiderData(riders) {
    let { data: riderData } = await supabase
        .from('alltimeRanking')
        .select('*')
        .in('fullName', riders);
    return riderData;
}

export default function RankingEachYear() {
    const [alltimePerYear, setAlltimePerYear] = useState();
    const [riderData, setRiderData] = useState();
    const [unique, setUnique] = useState([]);
    const [amountLoaded, setLoadedAmount] = useState(10);

    fetchData().then(data => setAlltimePerYear(data));

    useEffect(() => {
        if (alltimePerYear) {
            alltimePerYear.map(i => {
                [...Array(10)].map((j, index) => {
                    if (!unique.includes(i[index + 1])) {
                        setUnique([...unique, i[index + 1]]);
                    }
                })
            })
        }

        if (unique.length > 79) {
            fetchRiderData(unique).then(data => setRiderData(data));
        }
    }, [alltimePerYear])

    return (
        <div className="ranking-each-year-container" id="all-time-hvert-aar">
            <h3>All time hvert år <SectionLinkButton link={baseUrl + "/#all-time-hvert-aar"} sectionName={"All time hvert år"} /></h3>
            <p>En årlig opdateret oversigt over den aktuelle top 10 på evighedslisten - dog er årene før 1900 på et meget begrænset resultatgrundlag.</p>
            <div className="overflow-container">
                <div className="wrapper">
                    <div className="header">
                        <p>.</p>
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
                    <div className="content">
                        {alltimePerYear && riderData ? alltimePerYear.slice(0, amountLoaded).map((year, yIndex) => {
                            // if (yIndex < alltimePerYear.length - 1) {
                            //     const cur = [...Array(10)].map((i, index) => year[index + 1]);
                            //     const pre = [...Array(10)].map((i, index) => alltimePerYear[yIndex + 1][index + 1]);
                            //     if (String(cur) !== String(pre)) {
                            return (
                                <div key={year.id} className="row">
                                    <p>{year.year}</p>
                                    {[...Array(10)].map((i, index) => {
                                        let prevRank = yIndex < alltimePerYear.length - 1 && Object.keys(alltimePerYear[yIndex + 1]).find(key => alltimePerYear[yIndex + 1][key] == year[index + 1]);
                                        let movement = "no-movement";
                                        const rider = riderData.find(j => j.fullName == year[index + 1])

                                        if (prevRank == undefined) {
                                            prevRank = 11;
                                        }

                                        if (prevRank > index + 1) {
                                            movement = "rank-up"
                                        } else if (prevRank < index + 1) {
                                            movement = "rank-down"
                                        }

                                        if (year.year == 1886) {
                                            movement = "no-movement";
                                        }

                                        return (
                                            <p key={index} className={movement + " table-name-reversed"}>
                                                <Link href={"/rytter/" + stringEncoder(rider.fullName)}>
                                                    <span className={"fi fi-" + rider.nationFlagCode}></span>
                                                    <span className='last-name'>{rider.lastName} </span>
                                                    <span>{rider.firstName}</span>
                                                    {movement == "rank-up" && <div className="icon-container"><IoCaretUpOutline /></div>} {movement == "rank-down" && <div className="icon-container"><IoCaretDownOutline /></div>}
                                                </Link>
                                            </p>
                                        )
                                    })}
                                </div>
                            )
                            //     }
                            // }
                        }) :
                            <div className="skeleton">
                                <div className="row">
                                    <p>.</p>
                                    {[...Array(10)].map((a, index) => {
                                        return (
                                            <p key={index}>.</p>
                                        )
                                    })}
                                </div>
                            </div>
                        }
                        {riderData && amountLoaded < 200 && <button className="table-bottom-button vertical" onClick={() => setLoadedAmount(200)}>...</button>}
                    </div>
                </div>
            </div>
        </div>
    )
}