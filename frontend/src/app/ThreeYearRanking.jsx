"use client";

import { stringEncoder } from "@/components/stringHandler";
import useStore from "@/utils/store";
import { supabase } from "@/utils/supabase";
import Link from "next/link";
import { useEffect, useState } from "react";

async function getData() {
    let { data: threeYearRanking } = await supabase
        .from('greatestPast3Years')
        .select('*');

    return threeYearRanking.sort((a, b) => b.year - a.year);
}

export default function ThreeYearRanking() {
    const rankingAlltime = useStore((state) => state.rankingAlltime)
    const [threeYearRanking, setThreeYearRanking] = useState([]);
    const [loadedAmount, setLoadedAmount] = useState(10);

    useEffect(() => {
        getData().then(data => setThreeYearRanking(data));
    }, [])

    return (
        <div className="three-year-ranking-container">
            <h3>3-årig rullende rangliste</h3>
            <div className="table">
                <div className="table-header">
                    <p>År</p>
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
                    {threeYearRanking.slice(0, loadedAmount).map(year => {
                        return (
                            <div className="table-row">
                                <p>{year.year}<span className="table-previous-span">{year.year - 3}</span></p>
                                {[...Array(10)].map((i, index) => {
                                    const rider = rankingAlltime.find(j => j.fullName.toLowerCase() == year[index + 1].toLowerCase());
                                    let firstName;
                                    let lastName;
                                    let nationFlagCode;

                                    if (rider) {
                                        firstName = rider.firstName;
                                        lastName = rider.lastName;
                                        nationFlagCode = rider.nationFlagCode
                                    }
                                    if (rider) {
                                        return (
                                            <p className="table-name-reversed"><Link href={"/rytter/" + stringEncoder(firstName + " " + lastName)}><span className={"fi fi-" + nationFlagCode}></span><span className='last-name'>{lastName} </span> <span>{firstName}</span></Link></p>
                                        )
                                    }

                                })}
                            </div>
                        )
                    })}
                    {loadedAmount < 200 && <button className="table-bottom-button" onClick={() => setLoadedAmount(200)}>Indlæs alle...</button>}
                </div>
            </div>
        </div>
    );
}