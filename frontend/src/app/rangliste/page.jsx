"use client"

import { supabase } from "@/utils/supabase"
import { useEffect, useState } from "react"
import numerizeRanking from "@/utils/numerizeRanking";
import Link from "next/link";
import "../../../node_modules/flag-icons/css/flag-icons.min.css"

async function fetchData() {
    let { data: alltimeRanking } = await supabase
        .from('alltimeRanking')
        .select('*');

    return (alltimeRanking);
}

const initialFilterState = {
    active: false,
    nation: false,
    bornBefore: 2002,
    bornAfter: 1852,
    yearFilterRange: "range",
    radioCheck: true,
};

export default function Page() {
    const [nationsList, setNationsList] = useState([]);
    const [birthYearList, setBirthYearList] = useState([]);
    const [alltimeRanking, setalltimeRanking] = useState([]);
    const [filteredRanking, setFilteredRanking] = useState([]);
    const [rankingFilter, setRankingFilter] = useState(initialFilterState);
    const [amountLoaded, setAmountLoaded] = useState(100);

    useEffect(() => {
        fetchData().then(result => {
            setalltimeRanking(numerizeRanking(result))
            setFilteredRanking(numerizeRanking(result))

            setNationsList(result.reduce((acc, curr) => {
                if (!acc.find((item) => item.nation === curr.nation)) {
                    acc.push(curr)
                }

                return acc;
            }, []).sort((a, b) => {
                if (a.nation < b.nation) {
                    return -1;
                }

                if (a.nation > b.nation) {
                    return 1
                }
                return 0;
            }));

            const latestBirthYear = result.reduce((acc, curr) => {
                if (!acc.find((item) => item.birthYear == curr.birthYear)) {
                    acc.push(curr)
                }

                return acc;
            }, []).sort((a, b) => b.birthYear - a.birthYear)[0].birthYear;

            setBirthYearList(Array.from({ length: (latestBirthYear - 1852) + 1 }, (_, i) => 1852 + i))

        })
    }, [])

    useEffect(() => {
        let newFilteredRanking = alltimeRanking;

        if (rankingFilter.active) {
            newFilteredRanking = newFilteredRanking.filter(i => i.active);
        }

        if (rankingFilter.nation && rankingFilter.nation != "none") {
            newFilteredRanking = newFilteredRanking.filter(i => i.nation == rankingFilter.nation);
        }

        if (rankingFilter.yearFilterRange == "range") {
            newFilteredRanking = newFilteredRanking.filter(i => i.birthYear <= rankingFilter.bornBefore && i.birthYear >= rankingFilter.bornAfter)
        } else if (rankingFilter.yearFilterRange == "single") {
            newFilteredRanking = newFilteredRanking.filter(i => i.birthYear == rankingFilter.bornBefore)
        }


        console.log(rankingFilter.yearFilterRange)

        setAmountLoaded(100);
        setFilteredRanking(numerizeRanking(newFilteredRanking));
    }, [rankingFilter])

    return (
        <div className="ranking-page-container">
            <h2>Rangliste</h2>

            <div className="ranking-filter-options-container">
                <div className="ranking-filter-birth-year-container">
                    <div className="ranking-filter-birth-year-radio-container">
                        <div className="ranking-filter-birth-year-radio">
                            <label htmlFor="birth-year-radio-range">Rækkevidde</label>
                            <input type="radio" name="birth-year-radio" id="birth-year-radio-range" value={"range"} checked={rankingFilter.radioCheck} onChange={e => setRankingFilter({ ...rankingFilter, yearFilterRange: e.currentTarget.value, radioCheck: true })} />
                        </div>
                        <div className="ranking-filter-birth-year-radio">
                            <label htmlFor="birth-year-radio-single">Enkel årgang</label>
                            <input type="radio" name="birth-year-radio" id="birth-year-radio-single" value={"single"} onChange={e => setRankingFilter({ ...rankingFilter, yearFilterRange: e.currentTarget.value, radioCheck: false })} />
                        </div>
                    </div>

                    <div className="ranking-filter-born-before-container ranking-filter-born">
                        <label htmlFor="select-born-before-filter">Født i <span className={(!rankingFilter.radioCheck && "inactive") + " greyed-out-filter"}>eller før</span></label>
                        <select name="select-born-before-filter" id="select-born-before-filter" value={rankingFilter.bornBefore} onChange={e => setRankingFilter({ ...rankingFilter, bornBefore: e.target.value })}>
                            {birthYearList.sort((a, b) => { return b - a }).map(year => {
                                return (
                                    <option key={year} value={year}>{year}</option>
                                )
                            })}
                        </select>
                    </div>

                    <div className={(!rankingFilter.radioCheck && "inactive") + " greyed-out-filter ranking-filter-born-after-container  ranking-filter-born"}>
                        <label htmlFor="select-born-after-filter">Født i eller efter</label>
                        <select name="select-born-after-filter" id="select-born-after-filter" value={rankingFilter.bornAfter} onChange={e => setRankingFilter({ ...rankingFilter, bornAfter: e.target.value })}>
                            {birthYearList.sort((a, b) => { return a - b }).map(year => {
                                return (
                                    <option key={year} value={year}>{year}</option>
                                )
                            })}
                        </select>
                    </div>
                </div>

                <div className="ranking-filter-nation-container">
                    <label htmlFor="select-nation-filter">Nation:</label>
                    <select name="select-nation-filter" id="select-nation-filter" value={rankingFilter.nation} onChange={e => setRankingFilter({ ...rankingFilter, nation: e.target.value })}>
                        <option value="none">Ingen valgt</option>
                        {nationsList.map(nation => {
                            return (
                                <option key={nation.id} value={nation.nation}>{nation.nation}</option>
                            )
                        })}
                    </select>
                </div>

                <div className="ranking-filter-active-container">
                    <input type="checkbox" name="active-filter-checkbox" id="active-filter-checkbox" checked={rankingFilter.active} onChange={() => { if (rankingFilter.active) { setRankingFilter({ ...rankingFilter, active: false }) } else { setRankingFilter({ ...rankingFilter, active: true }) } }} />
                    <label htmlFor="active-filter-checkbox">Aktiv</label>
                </div>

                <button className="reset-filter-btn" onClick={() => { setRankingFilter(initialFilterState); setAmountLoaded(100) }}>Nulstil filtre</button>
            </div>

            <div className="ranking-page-table-container">
                <div className="table">
                    <div className="table-header">
                        <p>Placering</p>
                        <p>Point</p>
                        <p>Rytter</p>
                        <p>Nation</p>
                        <p>Årgang</p>
                    </div>
                    <div className="table-content">
                        {filteredRanking.slice(0, amountLoaded).map(rider => {
                            return (
                                <div key={rider.id} className="table-row">
                                    <p>{rider.currentRank}</p>
                                    <p>{rider.points}</p>
                                    <p className='table-name-reversed'><Link href={"/rytter/" + rider.riderId}><span className='last-name'>{rider.lastName} </span>{rider.firstName}</Link></p>
                                    <p><span className={'fi fi-' + rider.nationFlagCode}></span> {rider.nation}</p>
                                    <p>{rider.birthYear}</p>
                                </div>
                            )
                        })}
                    </div>
                </div>
            </div>

            {filteredRanking.length > amountLoaded && <button className="load-more-results-button" onClick={() => setAmountLoaded(amountLoaded + 100)}>Indlæs flere...</button>}
        </div>
    )
}