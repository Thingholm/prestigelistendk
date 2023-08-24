import { usePathname, useRouter, useSearchParams } from "next/navigation";

export default function SeasonSelect() {
    const pathname = usePathname();
    const router = useRouter();
    const searchParams = useSearchParams().toString().replace("=", "")

    const year = new Date().getFullYear()

    return (
        <div className="select-container">
            <label htmlFor="season-select">Vælg år:</label>
            <select name="season-select" id="season-select" onChange={e => router.push(pathname + "?" + e.target.value)}>
                {[...Array(year - 1875)].map((i, index) => {
                    const season = index + 1876
                    return (
                        <option key={index} value={season} selected={searchParams == season && "selected"}>{season}</option>
                    )
                })}
            </select>
        </div>
    )
}