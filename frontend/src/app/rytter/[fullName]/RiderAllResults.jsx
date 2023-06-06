"use client"

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

        responsive: [
            {
                breakpoint: 1100,
                settings: {
                    slidesToShow: 2,
                    slidesToScroll: 2,
                    adaptiveHeight: true,
                }
            },
            {
                breakpoint: 700,
                settings: {
                    slidesToShow: 1,
                    slidesToScroll: 1,
                    adaptiveHeight: true,
                }
            },
        ],
    }

    return (
        <div className="rider-all-results-container">
            <h3>Alle pointgivende resultater</h3>
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
                        <div key={key} className="rider-result-year-container">
                            <h4>{key}</h4>
                            <ul>
                                {filteredResults && filteredResults.map((result, index) =>
                                    <li key={index}>
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