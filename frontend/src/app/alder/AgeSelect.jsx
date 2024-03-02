import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useEffect } from "react";

export default function AgeSelect() {
    const pathname = usePathname();
    const router = useRouter();
    const searchParams = useSearchParams().toString().replace("=", "");

    const startAge = 25;

    useEffect(() => {
        if (!searchParams) {
            router.push(pathname + "?" + startAge)
        }
    }, [])

    return (
        <div className="select-container">
            <label htmlFor="season-select">Vælg alder:</label>
            <select name="season-select" id="season-select" onChange={e => router.push(pathname + "?" + e.target.value)}>
                {[...Array(40)].map((i, index) => {
                    const age = index + 14
                    return (
                        <option key={index} value={age} selected={searchParams == age && "selected"}>{age}</option>
                    )
                })}
            </select>
        </div>
    )
}