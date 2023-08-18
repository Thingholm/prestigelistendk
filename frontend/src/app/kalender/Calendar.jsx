"use client";

import { useCalendar, usePointSystem, usePointSystemGrouped } from "@/utils/queryHooks";
import { calendarDates } from "./calendarDates";
import { raceColors } from "./raceColors";
import { racesWithDarkTextArr } from "./raceColors";
import { useEffect, useRef } from "react";

function formatDates(prevMonth, prevDate) {
    let year = "2023";
    let month;
    let date;

    if (prevMonth.length == 1) {
        month = "0" + prevMonth;
    } else {
        month = prevMonth
    }

    if (prevDate.length == 1) {
        date = "0" + prevDate;
    } else {
        date = prevDate
    }

    return year + "-" + month + "-" + date
}

export default function Calendar() {
    const currentDateRef = useRef(null);
    const calendarQuery = useCalendar();
    const pointSystemQuery = usePointSystem();
    const pointSystemGroupedQuery = usePointSystemGrouped();
    const date = new Date()

    const datesArr = []
    Object.keys(calendarDates).map((i, index) => calendarDates[i].map((j, jIndex) => datesArr.push((index + 1).toString() + ((jIndex + 1).toString().length == 1 ? "0" + (jIndex + 1).toString() : (jIndex + 1).toString()))))

    const currentDate = (datesArr.indexOf(parseInt(date.getMonth() + 1).toString() + date.getDate().toString()))
    const currentHour = date.getHours()

    function handleScrollClick() {
        if (currentDateRef.current) {
            currentDateRef.current.scrollLeft = currentDate * 100
        }
    }

    useEffect(() => {
        handleScrollClick()
    }, [calendarQuery.isSuccess, pointSystemGroupedQuery.isSuccess, pointSystemQuery.isSuccess])

    return (
        <div className="calendar-container">
            <h3>Løbskalender</h3>
            <button className="scroll-to-view-btn" onClick={() => handleScrollClick()}>Scroll til i dag</button>
            <div className="calendar-shadow-container">
                <div className="calendar" ref={currentDateRef}>
                    {calendarQuery.isSuccess && pointSystemGroupedQuery.isSuccess && pointSystemQuery.isSuccess &&
                        <div>
                            <div className="months">
                                {Object.keys(calendarDates).map((month, monthIndex) => {
                                    return (
                                        <div key={monthIndex} className="month">
                                            <p>{month}</p>
                                            <ul className="date">
                                                {calendarDates[month].map((date, index) => {
                                                    const formattedDate = formatDates((monthIndex + 1).toString(), (index + 1).toString())
                                                    return (
                                                        <li style={{ width: "100px" }}>{index + 1}</li>
                                                    )
                                                })}
                                            </ul>
                                        </div>
                                    )
                                })}
                            </div>

                            {currentDate && <div className="current-date-line" style={{ left: currentDate * 100 + 10 + currentHour * 4 + "px" }}></div>}

                            <ul className="races">
                                {calendarQuery.data.map(race => {
                                    const startDate = datesArr.indexOf((race["start"]).toString());
                                    const length = (datesArr.indexOf((race["end"]).toString()) + 1) - startDate;
                                    const color = raceColors[race.race]
                                    const textColor = racesWithDarkTextArr.includes(race.race) ? "#1c1c1c" : "#ffffff"


                                    const pointsObject = pointSystemGroupedQuery.data.filter(i => i.category == race.category)

                                    if (race.yIndex < 3) {
                                        return (
                                            <li style={{ left: startDate * 100 + "px", width: length * 100 - 15 + "px", top: race.yIndex * 80 + "px", backgroundColor: color, color: textColor }}>
                                                {race.race.split(" (")[0]}

                                                <div className={race.yIndex < 2 ? "tooltip" : "tooltip top"}>
                                                    <div>
                                                        <h4>{race.race.split(" (")[0]}</h4>
                                                        <h5>{race.category}</h5>
                                                        <ul>
                                                            {pointsObject.map(p => {
                                                                return (
                                                                    <li><span>{p.result}</span><span>{p.points}p</span></li>
                                                                )
                                                            })}
                                                        </ul>
                                                    </div>
                                                </div>
                                            </li>
                                        )
                                    } else if (race.yIndex == 3) {
                                        return (
                                            <li style={{ left: startDate * 100 + "px", width: length * 100 - 15 + "px", top: race.yIndex * 80 + "px", backgroundColor: "#2c2c2c", color: "#ffffff" }}>...</li>
                                        )
                                    }

                                })}
                            </ul>
                        </div>}
                </div>
            </div>
        </div>
    )
}