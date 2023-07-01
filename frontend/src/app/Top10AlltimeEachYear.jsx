"use client";

import useStore from "@/utils/store";
import { supabase } from "@/utils/supabase";
import { useEffect, useState } from "react";
import Link from "next/link";
import { stringEncoder } from "@/components/stringHandler";
import { baseUrl } from "@/utils/baseUrl";
import SectionLinkButton from "@/components/SectionLinkButton";
import { IoCaretDownOutline, IoCaretUpOutline } from "react-icons/io5";

async function fetchData() {
    let { data: alltimeTop10PerYear } = await supabase
        .from('alltimeTop10PerYear')
        .select('*');

    return alltimeTop10PerYear;
}

export default function Top10AlltimeEachYear() {
    const [alltimeTop10PerYear, setAlltimeTop10PerYear] = useState([]);
    const [amountLoaded, setLoadedAmount] = useState(10);
    const rankingAlltime = useStore((state) => state.rankingAlltime);

    useEffect(() => {
        fetchData().then(data => setAlltimeTop10PerYear(data.sort((a, b) => b.year - a.year)));
    }, [])

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
                        {alltimeTop10PerYear.slice(0, amountLoaded).map(year => {
                            return (
                                <div key={year.id} className="table-row">
                                    <p>{year.year}</p>
                                    {[...Array(10)].map((i, index) => {
                                        const rider = rankingAlltime.find(j => j.fullName.toLowerCase() == year[index + 1].toLowerCase().replace("<", "").replace(">", ""));
                                        let firstName;
                                        let lastName;
                                        let nationFlagCode;
                                        let movement = "none";

                                        if (year[index + 1].includes("<")) {
                                            movement = "up";
                                        } else if (year[index + 1].includes(">")) {
                                            movement = "down";
                                        }

                                        if (rider) {
                                            firstName = rider.firstName;
                                            lastName = rider.lastName;
                                            nationFlagCode = rider.nationFlagCode
                                        }

                                        return (
                                            <p className="table-name-reversed" key={index}>
                                                <Link href={"/rytter/" + stringEncoder(firstName + " " + lastName)}>
                                                    <span className={"fi fi-" + nationFlagCode}></span>
                                                    <span className='last-name'>{lastName && lastName.replace("&#39;", "'")} </span>
                                                    <span>{firstName}</span>
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
                        })}
                        {amountLoaded < 80 && <button className="table-bottom-button vertical" onClick={() => setLoadedAmount(137)}>...</button>}

                    </div>
                </div>
            </div>
        </div>
    )
}