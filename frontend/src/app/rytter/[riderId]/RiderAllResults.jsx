"use client"

import RankingLinkHeader from "@/components/RankingLinkHeader";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { IoChevronForward, IoChevronBack } from "react-icons/io5";

export default function RiderAllResults(props) {
    const allRiderResults = props.resultData.reduce((allResults, result) => {
        const key = result.year;
        const curResultGroup = allResults[key] ?? [];

        return { ...allResults, [key]: [...curResultGroup, result] };
    }, {});

    function arrowSvg() {
        return (
            <svg viewBox="0 -4.5 20 20" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink">
                <g id="Page-1" stroke="none" stroke-width="1" fill="none" fill-rule="evenodd">
                    <g id="Dribbble-Light-Preview" transform="translate(-300.000000, -6643.000000)" fill="#000000">
                        <g id="icons" transform="translate(56.000000, 160.000000)">
                            <polygon id="arrow_right-[#346]" points="264 6488.26683 258.343 6483 256.929 6484.21678 260.172 6487.2264 244 6487.2264 244 6489.18481 260.172 6489.18481 256.929 6492.53046 258.343 6494"></polygon>
                        </g>
                    </g>
                </g>
            </svg>
        );
    }

    function SliderArrow(props) {
        const { clName, to, onClick, className } = props;
        return (
            <button onClick={onClick} className={clName + " " + className}>
                {to}
            </button>
        )

    }

    var settings = {
        dots: true,
        infinite: false,
        speed: 500,
        slidesToShow: 3,
        slidesToScroll: 2,
        arrows: true,
        nextArrow: <SliderArrow clName="next" to={<IoChevronForward color="black" size={32} />} />,
        prevArrow: <SliderArrow clName="prev" to={<IoChevronBack color="black" size={32} />} />,
    }

    return (
        <div className="rider-all-results-container">
            <RankingLinkHeader title="Alle pointgivende resultater" link="#" />
            <Slider {...settings}>
                {Object.keys(allRiderResults).map(key => {
                    const resultList = allRiderResults[key].sort(function (a, b) { return b.points - a.points });


                    const resultUniques = resultList.reduce((list, result) => {
                        const currCount = list[result.raceName] ?? 0;
                        return {
                            ...list,
                            [result.raceName]: currCount + 1,
                        }
                    }, {})

                    const seen = new Set();

                    const filteredResults = resultList.filter(e => {
                        const duplicate = seen.has(e.raceName);
                        seen.add(e.raceName)

                        return !duplicate;
                    })

                    return (
                        <div className="rider-result-year-container">
                            <h4>{key}</h4>
                            <ul>
                                {filteredResults && filteredResults.map(result =>
                                    <li>
                                        <span className="result-number-of-span">{resultUniques[result.raceName] > 1 && resultUniques[result.raceName] + "x "}</span>
                                        <span className="result-race-name">{result.raceName && result.raceName.includes(" (") ? result.raceName.split(" (")[0] : result.raceName}</span>
                                        <span className="result-points-sum"> {resultUniques[result.raceName] > 1 ? (result.points * resultUniques[result.raceName]) + "p" : result.points + "p"}</span>
                                    </li>
                                )}
                            </ul>
                        </div>
                    )
                })}
            </Slider>
        </div>
    )
}