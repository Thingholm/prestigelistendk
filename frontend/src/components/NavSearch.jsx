"use client";

import useStore from "@/utils/store";
import Link from "next/link";
import { useRef, useState, useEffect } from "react";
import { IoCloseOutline, IoSearchOutline } from "react-icons/io5";
import { nationEncoder, stringEncoder } from "./stringHandler";
import colorDict from "@/utils/nationsColors";
import { useAlltimeRanking } from "@/utils/queryHooks";

export default function NavSearch() {
    const [searchBarActive, setSearchBarActive] = useState(false);
    const nationsList = Object.keys(colorDict);

    const [searchInput, setSearchInput] = useState("");
    const containerRef = useRef(null);

    const alltimeRankingQuery = useAlltimeRanking();
    const alltimeRanking = alltimeRankingQuery.data;

    useEffect(() => {
        function handleOutsideClick(event) {
            if (containerRef.current && !containerRef.current.contains(event.target)) {
                setSearchBarActive(false);
            }
        }

        document.addEventListener("mousedown", handleOutsideClick, true);
        return () => {
            document.removeEventListener("mousedown", handleOutsideClick, true);
        }
    }, [containerRef])

    return (
        <div className="nav-search-container" ref={containerRef}>
            <div className="nav-search-icon-container" onClick={() => { if (searchBarActive) { setSearchBarActive(false) } else { setSearchBarActive(true) } }}>
                <IoSearchOutline size={22} />
            </div>
            <div onClick={() => setSearchInput("")} className={searchInput.length > 0 && searchBarActive ? "nav-search-input-delete-container visible" : "nav-search-input-delete-container"} id={searchInput.length > 1 && "search-close-container"}>
                <IoCloseOutline size={22} />
            </div>
            <input
                className={searchBarActive && "visible"}
                type="text"
                name="nav-search-bar-input"
                id="nav-search-bar-input"
                placeholder="Søg efter ryttere, nationer..."
                value={searchInput}
                onChange={e => setSearchInput(e.currentTarget.value)}
            />
            {searchInput.length > 1 &&
                <div className={searchBarActive ? "search-results-container visible" : "search-results-container"}>
                    {alltimeRankingQuery.isSuccess && alltimeRanking.filter(i => i.fullName.toLowerCase().includes(searchInput.toLowerCase())).length > 0 &&
                        <div>
                            <h4>Ryttere</h4>
                            <ul>
                                {alltimeRanking.filter(i => i.fullName.toLowerCase().includes(searchInput.toLowerCase())).slice(0, 10).map(r => {
                                    return (
                                        <li key={r.id} ><Link onClick={() => { setSearchBarActive(false); setSearchInput(""); }} href={"/rytter/" + stringEncoder(r.fullName)}>{r.fullName}</Link></li>
                                    )
                                })}
                            </ul>
                        </div>
                    }
                    {nationsList.filter(i => i.toLowerCase().includes(searchInput.toLowerCase())).length > 0 &&
                        <div>
                            <h4>Nationer</h4>
                            <ul>
                                {nationsList.filter(i => i.toLowerCase().includes(searchInput.toLowerCase())).map(n => {
                                    return (
                                        <li key={n} ><Link onClick={() => { setSearchBarActive(false); setSearchInput(""); }} href={"/nation/" + nationEncoder(n)}>{n}</Link></li>
                                    )
                                })}
                            </ul>
                        </div>
                    }
                </div>
            }
        </div>
    )
}