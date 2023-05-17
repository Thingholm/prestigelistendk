"use client"

import Link from "next/link";
import useStore from "@/utils/store";
import { IoArrowForward } from "react-icons/io5";

export default function RankingLinkHeader(props) {
    const setRankingFilter = useStore((state) => state.setRankingFilter);
    const rankingFilter = useStore((state) => state.rankingFilter);

    return (
        <h3 className={"ranking-link-header no-underline " + props.mode} onClick={() => { props.filterHandler && setRankingFilter(props.filterHandler) }}>
            <Link href={props.link}>
                {props.title}
                <IoArrowForward />
            </Link>
            {props.sectionLink}
        </h3>
    )
}