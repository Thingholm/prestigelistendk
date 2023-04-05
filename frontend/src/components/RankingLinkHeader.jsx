import Link from "next/link";

export default function RankingLinkHeader(props) {
    return (
        <h2 className="ranking-link-header">
            <Link href={props.link}>
                {props.title}
                <svg viewBox="0 -4.5 20 20" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink">
                    <g id="Page-1" stroke="none" stroke-width="1" fill="none" fill-rule="evenodd">
                        <g id="Dribbble-Light-Preview" transform="translate(-300.000000, -6643.000000)" fill="#000000">
                            <g id="icons" transform="translate(56.000000, 160.000000)">
                                <polygon id="arrow_right-[#346]" points="264 6488.26683 258.343 6483 256.929 6484.21678 260.172 6487.2264 244 6487.2264 244 6489.18481 260.172 6489.18481 256.929 6492.53046 258.343 6494"></polygon>
                            </g>
                        </g>
                    </g>
                </svg>
            </Link>
        </h2>
    )
}