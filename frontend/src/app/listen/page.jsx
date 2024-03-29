"use client"

import { useEffect, useRef, useState } from "react"
import numerizeRanking from "@/utils/numerizeRanking";
import Link from "next/link";
import "../../../node_modules/flag-icons/css/flag-icons.min.css"
import { nationEncoder, stringDecoder, stringEncoder } from "@/components/stringHandler";
import useStore, { initialFilterState } from "@/utils/store";
import { IoRefreshOutline, IoRemoveCircleOutline, IoSearch } from "react-icons/io5"
import { AiOutlineVerticalAlignTop } from "react-icons/ai"
import TableSkeleton from "@/components/TableSkeleton";
import SectionLinkButton from "@/components/SectionLinkButton";
import { baseUrl } from "@/utils/baseUrl";
import { useSearchParams } from "next/navigation";
import { useAlltimeRanking } from "@/utils/queryHooks";

export default function Page() {
    const searchParams = Object.fromEntries(useSearchParams().entries());
    const [nationsList, setNationsList] = useState([]);
    const [birthYearList, setBirthYearList] = useState([]);
    const [selectedNation, setSelectedNation] = useState(["none"]);
    const [alltimeRanking, setalltimeRanking] = useState([]);
    const [filteredRanking, setFilteredRanking] = useState([]);
    const [amountLoaded, setAmountLoaded] = useState(100);
    const [isLoading, setIsLoading] = useState(true);
    const [search, setSearch] = useState("");
    const [searchVisible, setSearchVisible] = useState(true);
    const [targetedRiderId, setTargetedRiderId] = useState();
    const rankingFilter = useStore((state) => state.rankingFilter);
    const setRankingFilter = useStore((state) => state.setRankingFilter);

    const alltimeRankingQuery = useAlltimeRanking();
    useEffect(() => {
        if (alltimeRankingQuery.isSuccess) {
            setalltimeRanking(numerizeRanking(alltimeRankingQuery.data))
            setFilteredRanking(numerizeRanking(alltimeRankingQuery.data));

            setSearch("");

            if (searchParams) {
                if (searchParams.nation) {
                    setRankingFilter({ ...initialFilterState, ...searchParams, nation: [searchParams.nation] });
                } else {
                    setRankingFilter({ ...initialFilterState, ...searchParams });
                }
            }

            setNationsList(alltimeRankingQuery.data.reduce((acc, curr) => {
                if (!acc.find((item) => item.nation === curr.nation)) {
                    acc.push(curr);
                }

                return acc;
            }, []).sort((a, b) => {
                if (a.nation < b.nation) {
                    return -1;
                }

                if (a.nation > b.nation) {
                    return 1;
                }
                return 0;
            }));

            const latestBirthYear = alltimeRankingQuery.data.reduce((acc, curr) => {
                if (!acc.find((item) => item.birthYear == curr.birthYear)) {
                    acc.push(curr);
                }

                return acc;
            }, []).sort((a, b) => b.birthYear - a.birthYear)[0].birthYear;

            setBirthYearList(Array.from({ length: (latestBirthYear - 1852) + 1 }, (_, i) => 1852 + i))
        }
    }, [alltimeRankingQuery.isSuccess])

    const containerRef = useRef(null);

    useEffect(() => {
        function handleOutsideClick(event) {
            if (containerRef.current && !containerRef.current.contains(event.target)) {
                setSearchVisible(false);
            } else {
                setSearchVisible(true);
            }
        }

        document.addEventListener("mousedown", handleOutsideClick, true);
        return () => {
            document.removeEventListener("mousedown", handleOutsideClick, true);
        }
    }, [containerRef])

    useEffect(() => {
        setSearch("");
        setTargetedRiderId();
        setIsLoading(true);
        let newFilteredRanking = alltimeRanking;

        if (rankingFilter.activeStatus == "active") {
            newFilteredRanking = newFilteredRanking.filter(i => i.active == true);
        } else if (rankingFilter.activeStatus == "inactive") {
            newFilteredRanking = newFilteredRanking.filter(i => i.active !== true)
        }

        if (rankingFilter.nation && !rankingFilter.nation.every(i => i == "none")) {
            newFilteredRanking = newFilteredRanking.filter(i => rankingFilter.nation.map(j => stringDecoder(j)).includes(i.nation));
        }

        if (rankingFilter.yearFilterRange == "range") {
            newFilteredRanking = newFilteredRanking.filter(i => i.birthYear <= rankingFilter.bornBefore && i.birthYear >= rankingFilter.bornAfter)
        } else if (rankingFilter.yearFilterRange == "single") {
            newFilteredRanking = newFilteredRanking.filter(i => i.birthYear == rankingFilter.bornBefore)
        }

        setSelectedNation(rankingFilter.nation.map(j => stringDecoder(j)));
        setAmountLoaded(100);
        setFilteredRanking(numerizeRanking(newFilteredRanking));
        setIsLoading(false);
    }, [rankingFilter, birthYearList])

    return (
        <div className="ranking-page-container">
            <h2>Prestigelisten <SectionLinkButton link={baseUrl + "/listen"} sectionName={"Prestigelisten"} /></h2>

            <div className="ranking-filter-options-container">
                <div className="ranking-filter-birth-year-container">
                    <div className="ranking-filter-birth-year-radio-container">
                        <div className="ranking-filter-birth-year-radio">
                            <label htmlFor="birth-year-radio-range">Rækkevidde</label>
                            <input type="radio" name="birth-year-radio" id="birth-year-radio-range" value={"range"} checked={rankingFilter.yearFilterRange == "range"} onChange={e => setRankingFilter({ ...rankingFilter, yearFilterRange: e.currentTarget.value })} />
                        </div>
                        <div className="ranking-filter-birth-year-radio">
                            <label htmlFor="birth-year-radio-single">Enkel årgang</label>
                            <input type="radio" name="birth-year-radio" id="birth-year-radio-single" value={"single"} checked={rankingFilter.yearFilterRange == "single"} onChange={e => setRankingFilter({ ...rankingFilter, yearFilterRange: e.currentTarget.value })} />
                        </div>
                    </div>

                    <div className="ranking-filter-born-before-container ranking-filter-born">
                        <label htmlFor="select-born-before-filter">Født i <span className={(rankingFilter.yearFilterRange == "single" && "inactive") + " greyed-out-filter"}>eller før</span></label>
                        <select name="select-born-before-filter" id="select-born-before-filter" value={rankingFilter.bornBefore} onChange={e => setRankingFilter({ ...rankingFilter, bornBefore: e.target.value })}>
                            {birthYearList.sort((a, b) => { return b - a }).map(year => {
                                return (
                                    <option key={year} value={year}>{year}</option>
                                )
                            })}
                        </select>
                    </div>

                    <div className={(rankingFilter.yearFilterRange == "single" && "inactive") + " greyed-out-filter ranking-filter-born-after-container  ranking-filter-born"}>
                        <label htmlFor="select-born-after-filter">Født i eller efter</label>
                        <select disabled={rankingFilter.yearFilterRange == "single" && true} name="select-born-after-filter" id="select-born-after-filter" value={rankingFilter.bornAfter} onChange={e => setRankingFilter({ ...rankingFilter, bornAfter: e.target.value })}>
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
                    {[...Array(rankingFilter.nation.length)].map((i, index) => {
                        return (
                            <div key={index} className="select-container">
                                <select
                                    name="select-nation-filter"
                                    id="select-nation-filter"
                                    value={selectedNation[index]}
                                    onChange={e => {
                                        const curFilter = rankingFilter;
                                        curFilter.nation[index] = e.target.value;
                                        setRankingFilter({ ...curFilter });
                                    }}
                                >
                                    <option value="none">Alle nationer</option>
                                    {nationsList.map(nation => {
                                        return (
                                            <option key={nation.id} value={nation.nation}>{nation.nation}</option>
                                        )
                                    })}
                                </select>
                                {index > 0 && <button onClick={() => {
                                    let nationsArr = rankingFilter.nation;
                                    nationsArr.splice(index, 1);
                                    setRankingFilter({ ...rankingFilter, nation: nationsArr });
                                }
                                }><IoRemoveCircleOutline /></button>}
                            </div>
                        )
                    })}
                    {rankingFilter.nation.length < 5 && <button onClick={() => {
                        if (rankingFilter.nation.length < 5) {
                            setRankingFilter({ ...rankingFilter, nation: [...rankingFilter.nation, "none"] });
                        }
                    }}>
                        + Tilføj nation...
                    </button>}

                </div>

                <div className="ranking-filter-active-container">
                    <div className="ranking-filter-active-radio-container">
                        <input
                            type="radio"
                            name="filter-active-status-radio"
                            id="filter-active-all-radio" value={"all"}
                            checked={rankingFilter.activeStatus == "all"}
                            onChange={e => setRankingFilter({ ...rankingFilter, activeStatus: e.currentTarget.value })}
                        />
                        <label htmlFor="filter-active-all-radio">Alle</label>
                    </div>
                    <div className="ranking-filter-active-radio-container">
                        <input type="radio" name="filter-active-status-radio" id="filter-active-active-radio" value={"active"} checked={rankingFilter.activeStatus == "active"} onChange={e => setRankingFilter({ ...rankingFilter, activeStatus: e.currentTarget.value })} />
                        <label htmlFor="filter-active-active-radio">Aktive ryttere</label>
                    </div>
                    <div className="ranking-filter-active-radio-container">
                        <input type="radio" name="filter-active-status-radio" id="filter-active-inactive-radio" value={"inactive"} checked={rankingFilter.activeStatus == "inactive"} onChange={e => setRankingFilter({ ...rankingFilter, activeStatus: e.currentTarget.value })} />
                        <label htmlFor="filter-active-inactive-radio">Inaktive ryttere</label>
                    </div>
                </div>

                <div className="btn-container">
                    <button className="reset-filter-btn" onClick={() => { setRankingFilter({ ...initialFilterState, nation: ["none"] }); setAmountLoaded(100) }}><IoRefreshOutline size={20} /> <span>Nulstil filtre</span></button>
                </div>
            </div>

            <div ref={containerRef} className="search-container">
                <div className="search-input-container">
                    <input type="text" name="search-for-rider" placeholder="Søg efter rytter..." id="search-for-rider" autoComplete="false" value={search} onChange={e => setSearch(e.target.value)} />
                    <div>
                        <IoSearch />
                    </div>
                </div>
                {search.length > 2 &&
                    <ul className={"visible-" + String(searchVisible)}>
                        {filteredRanking.filter(i => i.fullName.toLowerCase().includes(search.toLowerCase())).map(i => {
                            return (
                                <li key={i.id}>
                                    <a
                                        href={"/listen#" + i.id}
                                        onClick={() => {
                                            if (i.points > 14) {
                                                setAmountLoaded(i.currentRank + 100)
                                            } else {
                                                setAmountLoaded(i.currentRank + 1000)
                                            }
                                            setSearchVisible(false);
                                            setTargetedRiderId(i.id);
                                        }}
                                    >
                                        {i.fullName}
                                    </a>
                                </li>
                            )
                        })}
                    </ul>
                }
            </div>

            <div className="ranking-page-table-container">
                <div className="table">
                    <div className="table-header">
                        <p>Nr.</p>
                        <p>All time</p>
                        <p>Point</p>
                        <p>Rytter</p>
                        <p>Nation</p>
                        <p>Årgang</p>
                    </div>
                    {isLoading ? <TableSkeleton /> :
                        <div className="table-content">
                            {filteredRanking.slice(0, amountLoaded).map(rider => {
                                const rankAlltime = alltimeRanking.find(i => i.fullName == rider.fullName).currentRank;
                                const nameArr = rider.fullName.split(/ (.*)/);

                                return (
                                    <div key={rider.id} className={targetedRiderId == rider.id ? "table-row highlighted" : "table-row"} id={rider.id}>
                                        <p><span>{rider.currentRank}</span><span className="media">{rankAlltime.toLocaleString("de-DE")}</span></p>
                                        <p><span className="table-previous-span">{rankAlltime.toLocaleString("de-DE")}</span> </p>
                                        <p>{rider.points.toLocaleString("de-DE")}</p>
                                        <p className='table-name-reversed'><Link href={"/rytter/" + stringEncoder(rider.fullName)}><span className={"media fi fi-" + rider.nationFlagCode}></span><span className='last-name'>{nameArr[1]} </span><span className="first-name">{nameArr[0]}</span></Link></p>
                                        <p><Link href={"/nation/" + nationEncoder(rider.nation)}><span className={'fi fi-' + rider.nationFlagCode}></span><span className="nation-full-name">{rider.nation}</span> <span className="media">{rider.nation.replace("Nederlandene", "Holland").replace("Storbritannien", "UK")}</span></Link></p>
                                        <p onClick={() => setRankingFilter({ ...rankingFilter, bornBefore: rider.birthYear, yearFilterRange: "single", radioCheck: false })}>{rider.birthYear}</p>
                                    </div>
                                )
                            })}
                        </div>
                    }
                </div>
            </div>

            {filteredRanking.length > amountLoaded && <button className="load-more-results-button" onClick={() => setAmountLoaded(amountLoaded + 100)}>Indlæs flere...</button>}

            <button className="scroll-to-top-button" onClick={() => window.scrollTo(0, 0)}><AiOutlineVerticalAlignTop size={20} /></button>
        </div>
    )
}