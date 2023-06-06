import { nationEncoder } from "@/components/stringHandler";
import { nationFlagCodes } from "@/utils/nationFlagCodes";
import { supabase } from "@/utils/supabase"
import Link from "next/link";
import "flag-icons/css/flag-icons.min.css";




async function fetchData() {
    let { data: pointSystem } = await supabase
        .from('pointSystem')
        .select('*');

    let { data: pointSystemGrouped } = await supabase
        .from('pointSystemByCategory')
        .select('*');

    return {
        pointSystem: pointSystem.sort((a, b) => b.points - a.points),
        pointSystemGrouped: pointSystemGrouped,
    };
}

function generateTableRows(r) {
    return (
        <div key={r.id} className={!r.active && "inactive-race"}>
            <p><span className={"fi fi-" + nationFlagCodes.find(i => i.nation == r.raceNation).nationFlagCode}></span>{r.raceName}</p>
        </div>
    )
}

export default async function Page() {
    const data = await fetchData();
    const pointSystem = data.pointSystem;
    const pointSystemGrouped = data.pointSystemGrouped.reduce((acc, obj) => {
        const key = obj["category"];
        const curGroup = acc[key] ?? [];

        return { ...acc, [key]: [...curGroup, obj] }
    }, {});

    return (
        <div className="table-content">
            {["Tour de France", "Grand Tour", "Monument", "WTT A", "WTC A", "WTT B", "WTC B", "WTT C", "WTC C", "WTT D", "WTC D", "VM", "VM ITT", "EM", "EM ITT", "National A", "National ITT A", "National B", "National ITT B", "OL", "OL ITT", "OL (amatør)", "OL ITT (amatør)", "Andre"].map((category, index) => {
                return (
                    <div key={index}>
                        <div className="table-row category-row">
                            <h4>{category}</h4>
                        </div>

                        <div className="race-points-list">
                            {pointSystemGrouped[category].sort((a, b) => a.id - b.id).map(r => {
                                return (
                                    <p key={r.id} className="result-and-points-container"><span>{r.result}</span><span>{r.points}p</span></p>
                                )
                            })}
                        </div>

                        <div className="category-content">
                            <div className="race-name-list">
                                {pointSystem.filter(i => i.category == category).filter(i => !i.raceName.includes("plads") && !i.raceName.includes("etape") && !i.raceName.includes("trøje")).sort((a, b) => b.active - a.active).map(r => {
                                    return generateTableRows(r)
                                })}
                            </div>

                        </div>
                    </div>
                )
            })}
        </div>
    )
}