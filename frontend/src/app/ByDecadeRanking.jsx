"use client";

import useStore from "@/utils/store";
import { supabase } from "@/utils/supabase";
import { useEffect, useState } from "react";
import Link from "next/link";
import { stringEncoder } from "@/components/stringHandler";

async function fetchData() {
    let { data: greatestByDecade } = await supabase
        .from('greatestByDecade')
        .select('*');

    return greatestByDecade;
}

export default function ByDecadeRanking() {
    const [greatestByDecade, setGreatestByDecade] = useState([]);
    const [amountLoaded, setLoadedAmount] = useState(10);
    const rankingAlltime = useStore((state) => state.rankingAlltime);

    useEffect(() => {
        fetchData().then(data => setGreatestByDecade(data));
    }, [])

    return (
        <div className="ranking-each-decade-container">
            <h3 id="stoerste-per-aarti">Største ryttere hvert årti</h3>
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
                            {greatestByDecade.map(decade => {
                                return (
                                    <div key={decade.id} className="table-row">
                                        <p>{decade.decade}'erne</p>
                                        {[...Array(amountLoaded)].map((i, index) => {
                                            const rider = rankingAlltime.find(j => j.fullName.toLowerCase() == decade[index + 1].toLowerCase());
                                            let firstName;
                                            let lastName;
                                            let nationFlagCode;

                                            if (rider) {
                                                firstName = rider.firstName;
                                                lastName = rider.lastName;
                                                nationFlagCode = rider.nationFlagCode
                                            }

                                            return (
                                                <p className="table-name-reversed" key={index}>
                                                    <Link href={"/rytter/" + stringEncoder(firstName + " " + lastName)}>
                                                        <span className={"fi fi-" + nationFlagCode}></span>
                                                        <span className='last-name'>{lastName} </span>
                                                        <span>{firstName}</span>
                                                    </Link>
                                                </p>
                                            )
                                        })}
                                    </div>
                                )
                            })}
                            {amountLoaded < 80 && <button className="table-bottom-button vertical" onClick={() => setLoadedAmount(80)}>...</button>}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}