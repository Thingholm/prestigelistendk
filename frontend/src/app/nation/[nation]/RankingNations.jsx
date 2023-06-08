import RankingLinkHeader from "@/components/RankingLinkHeader";
import { supabase } from "@/utils/supabase";
import numerizeRanking from "@/utils/numerizeRanking";
import Link from "next/link";

export default async function RankingNationsNation(props) {
    const nationsRankings = props.rankingNations;
    const activeNationsRankings = props.activeRankingNations;

    return (
        <div className="nation-rankings-container nations-ranked light">
            <div className="table-wrapper">
                <RankingLinkHeader title="Største nationer" link={"/nationer"} />
                <div className="rounded-table-container">
                    <div className="table-shadow-container">
                        <div className="table">
                            <div className="table-header">
                                <p>Nr.</p>
                                <p>Nation</p>
                                <p>Antal ryttere</p>
                                <p>Point pr. rytter</p>
                                <p>Point</p>
                            </div>
                            <div className="table-content">
                                {nationsRankings.map((nation, index) => {
                                    return (
                                        <div key={index} className={props.currentNation == nation.nation ? "table-row highlighted-nation" : "table-row"}>
                                            <p>{nation.currentRank}</p>
                                            <p><Link href={"/nation/" + nation.nation.toLowerCase().replace("ø", "oe").replace("æ", "ae").replace("å", "aa").replace(" ", "-")}><span className={"fi fi-" + nation.nationFlagCode}></span>{nation.nation}</Link></p>
                                            <p>{nation.numberOfRiders}</p>
                                            <p>{Math.round(nation.points / nation.numberOfRiders * 10) / 10}</p>
                                            <p>{nation.points}</p>
                                        </div>
                                    )
                                })}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div className="table-wrapper">
                <RankingLinkHeader title="Største nationer (aktive ryttere)" link={"/nationer?filterBy=aktive"} />
                <div className="rounded-table-container">
                    <div className="table-shadow-container">
                        <div className="table">
                            <div className="table-header">
                                <p>Nr.</p>
                                <p>Nation</p>
                                <p>Antal ryttere</p>
                                <p>Point pr. rytter</p>
                                <p>Point</p>
                            </div>
                            <div className="table-content">
                                {activeNationsRankings.map((nation, index) => {
                                    return (
                                        <div key={index} className={props.currentNation == nation.nation ? "table-row highlighted-nation" : "table-row"}>
                                            <p>{nation.currentRank}</p>
                                            <p><Link href={"/nation/" + nation.nation.toLowerCase().replace("ø", "oe").replace("æ", "ae").replace("å", "aa").replace(" ", "-")}><span className={"fi fi-" + nation.nationFlagCode}></span>{nation.nation}</Link></p>
                                            <p>{nation.numberOfRiders}</p>
                                            <p>{Math.round(nation.points / nation.numberOfRiders * 10) / 10}</p>
                                            <p>{nation.points}</p>
                                        </div>
                                    )
                                })}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}