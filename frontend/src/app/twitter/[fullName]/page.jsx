"use client"

import { stringDecoder } from "@/components/stringHandler";
import numerizeRanking from "@/utils/numerizeRanking";
import "../../../../node_modules/flag-icons/css/flag-icons.min.css"
import { useAlltimeRanking, useLatestResults, usePointSystem, useResultsByRider, useRiderRankingPerYear } from "@/utils/queryHooks";
import { useEffect, useRef, useState } from "react";
import { IoCaretUpOutline, IoChevronDownOutline, IoChevronUpOutline } from "react-icons/io5";
import { TiEquals } from "react-icons/ti";
import RiderResults from "@/app/rytter/[fullName]/RiderResults";
// import "./flag-icons.min.css"
import { toPng } from "html-to-image"
import { supabase } from "@/utils/supabase";
import { useSearchParams } from "next/navigation";
import { Link } from "next"

async function upload(dataUrl, props) {
    const base64 = await fetch(dataUrl);
    const blob = await base64.blob();

    const { error: uploadError } = await supabase
        .storage
        .from('twitterPics')
        .upload(props.fullName + ".png", blob, { cacheControl: 10, upsert: true });
    console.log(uploadError)
    return uploadError ? "Fejl" : "Upload lykkedes";
}

export default function Page(props) {
    const [fontSize, setFontSize] = useState(40)
    const [color, setColor] = useState("#c5c5c5")
    const [colorInput, setColorInput] = useState("c5c5c5")
    const [fontColor, setFontColor] = useState("dark")
    const [alltimeRanking, setAlltimeRanking] = useState();
    const [uploadState, setUploadState] = useState("");
    const searchParams = useSearchParams().toString();
    const ref = useRef(null);

    async function handleSnapshot() {
        setUploadState("Uploader...")
        if (ref.current === null) {
            return
        }

        toPng(ref.current, {
            quality: 1,
            backgroundColor: "#ffffff",
            width: 764,
            height: 400,
            pixelRatio: 1
        })
            .then((dataUrl) => {
                // console.log(dataUrl)
                setUploadState(upload(dataUrl, props));
                // const link = document.createElement('a')
                // link.download = 'my-image-name.png'
                // link.href = dataUrl
                // link.click()
            })
            .catch((err) => {
                console.log(err)
            })
    }

    const name = stringDecoder(props.fullName);

    const alltimeRankingQuery = useAlltimeRanking();
    useEffect(() => {
        if (alltimeRankingQuery.isSuccess && !alltimeRanking) {
            setAlltimeRanking(numerizeRanking(alltimeRankingQuery.data))
        }
    }, [alltimeRankingQuery])

    const pointSystemQuery = usePointSystem();
    const pointSystem = pointSystemQuery.data

    const rankingByYearsQuery = useRiderRankingPerYear(name);
    const rankingByYears = rankingByYearsQuery.data;

    const riderResultsQuery = useResultsByRider(name);

    let riderResults;
    let resultRace = "";
    let riderData;
    let alltimeRankByNation;
    let alltimeRankByYear;
    let rider;

    if (alltimeRanking && pointSystem && riderResultsQuery.isSuccess) {
        riderResults = riderResultsQuery.data.filter(i => (name == "Emilio Rodriguez" ? i.rider == "Emilio Rodriguez" : true))?.map(result => {

            if (result.race.includes("etape")) {
                resultRace = result.race.split(". ")[1]
            } else {
                resultRace = result.race
            }
            const racePointSystem = pointSystem.find(p => p.raceName == resultRace);

            const mergedLists = {
                ...result,
                ...racePointSystem,
            }

            return (mergedLists)
        });

        riderData = numerizeRanking(alltimeRanking).find(i => i.fullName.toLowerCase() == name.toLowerCase());
        alltimeRankByNation = numerizeRanking(alltimeRanking.filter(i => i.nation == riderData.nation)).find(i => i.fullName.toLowerCase() == name.toLowerCase())
        alltimeRankByYear = numerizeRanking(alltimeRanking.filter(i => i.birthYear == riderData.birthYear)).find(i => i.fullName.toLowerCase() == riderData.fullName.toLowerCase())

        if (riderData.active) {
            riderData = { ...riderData, activeRank: numerizeRanking(alltimeRanking.filter(i => i.active == true)).find(i => i.fullName.toLowerCase() == name.toLowerCase()).currentRank }
        }
    }

    const [latestResults, setLatestResults] = useState();

    const latestResultsQuery = useLatestResults()
    const latestResultsData = latestResultsQuery.data

    useEffect(() => {
        if (latestResultsData?.find(i => i.rider.toLowerCase() == name.toLowerCase())) {
            if (alltimeRanking && latestResultsData && pointSystem) {
                const filteredResults = latestResultsData.filter(i => alltimeRanking.map(j => j.fullName).includes(i.rider));
                const resultsGroupedByDateWithPoints = filteredResults.reduce((acc, obj) => {
                    const key = obj["raceDate"];
                    const curGroup = acc[key] ?? [];
                    const curResult = ((obj.race.includes("etape") ? obj.race.split(". ")[1] : obj.race))
                    const curPoints = (pointSystem.find(i => i.raceName == curResult) ? pointSystem.find(i => i.raceName == curResult).points : 0)
                    let counter = 1;
                    if (curGroup.find(i => i.rider == obj.rider)) {
                        const index = curGroup.findIndex(i => i.rider == obj.rider);
                        acc[key][index].points += curPoints;
                        acc[key][index].race = [acc[key][index].race, obj.race];
                        acc[key][index].count++;
                        return { ...acc, [key]: curGroup.sort((a, b) => b.points - a.points) }
                    } else {
                        return { ...acc, [key]: [...curGroup, { ...obj, points: curPoints, count: counter }].sort((a, b) => b.points - a.points) }
                    }
                }, {})

                let resultsGroupedArray = [];

                Object.keys(resultsGroupedByDateWithPoints).map(i => {
                    resultsGroupedArray.push({ date: i, data: resultsGroupedByDateWithPoints[i] })
                })

                resultsGroupedArray = resultsGroupedArray.sort((a, b) => b.date.localeCompare(a.date))

                let finalMovementsList = [];

                let prevRanking = numerizeRanking(alltimeRanking);

                resultsGroupedArray = resultsGroupedArray.map(i => {
                    let newPrevRanking = prevRanking.map(j => {
                        return {
                            currentRank: j.currentRank,
                            fullName: j.fullName,
                            points: j.points,
                            nationFlagCode: j.nationFlagCode,
                        }
                    });

                    i.data.map(j => {
                        const rankingIndex = newPrevRanking.findIndex(k => k.fullName == j.rider)
                        newPrevRanking[rankingIndex].points = newPrevRanking[rankingIndex].points - j.points;

                    })

                    newPrevRanking = numerizeRanking(newPrevRanking)

                    i.data.map(j => {
                        const rankingIndex = newPrevRanking.findIndex(k => k.fullName == j.rider);
                        const newRankIndex = prevRanking.findIndex(k => k.fullName == j.rider);
                        finalMovementsList.push(
                            {
                                ...j,
                                ...prevRanking[newRankIndex],
                                oldRank: newPrevRanking[rankingIndex].currentRank,
                                oldPoints: newPrevRanking[rankingIndex].points,
                                newRank: prevRanking[newRankIndex].currentRank,
                                newPoints: prevRanking[newRankIndex].points,
                                raceDate: i.date,
                                racePoints: j.points,
                            }
                        )
                    })

                    prevRanking = newPrevRanking;
                })

                setLatestResults(finalMovementsList)
            }
        } else {
            console.log("INAKTIV")
        }
    }, [alltimeRanking, latestResultsData, pointSystem])

    const [imgSrc, setImgSrc] = useState("");
    useEffect(() => {
        if (riderData) {
            setImgSrc("https://fyoonxbvccocgqkxnjqs.supabase.co/storage/v1/object/public/riderPortraits/" + riderData.fullName.replace(/ /g, "").toLowerCase().replace(/ø/g, "oe").replace(/å/g, "aa").replace(/æ/g, "ae") + ".jpg")
        }
    }, [riderData])

    const highlightedResult = latestResults?.filter(i => i.rider.toLowerCase() == name.toLowerCase())[0];
    const activeRanking = alltimeRanking && numerizeRanking(alltimeRanking.filter(i => i.active == true))
    const riderActiveRankingIndex = activeRanking && activeRanking?.findIndex(i => i.fullName.toLowerCase() == name.toLowerCase())
    const riderRankingIndex = activeRanking && alltimeRanking?.findIndex(i => i.fullName.toLowerCase() == name.toLowerCase())
    const newNationsRanking = riderData && alltimeRanking && numerizeRanking(alltimeRanking.filter(i => i.nation == riderData.nation)).find(i => i.fullName.toLowerCase() == name.toLowerCase())
    let nationRanking = riderData && alltimeRanking && highlightedResult && JSON.parse(JSON.stringify(alltimeRanking)).filter(i => i.nation == riderData.nation)
    let oldNationsRanking;

    if (nationRanking) {
        nationRanking[nationRanking.findIndex(i => i.fullName.toLowerCase() == name.toLowerCase())].points = highlightedResult.oldPoints
        oldNationsRanking = numerizeRanking(nationRanking).find(i => i.fullName.toLowerCase() == name.toLowerCase())
    }
    let oldActiveRanking;
    if (activeRanking && highlightedResult) {
        JSON.parse(JSON.stringify(activeRanking))[activeRanking.findIndex(i => i.fullName.toLowerCase() == name.toLowerCase())].points = highlightedResult.oldPoints
        oldActiveRanking = numerizeRanking(activeRanking).find(i => i.fullName.toLowerCase() == name.toLowerCase())
    }

    let slicedActiveRanking;
    let slicedRanking;
    if (activeRanking && riderActiveRankingIndex) {
        if (riderActiveRankingIndex > 2) {
            slicedActiveRanking = activeRanking.slice(riderActiveRankingIndex - 2, riderActiveRankingIndex + 2)
        } else if (riderActiveRankingIndex == 1) {
            slicedActiveRanking = activeRanking.slice(riderActiveRankingIndex - 1, riderActiveRankingIndex + 3)
        } else if (riderActiveRankingIndex == 0) {
            slicedActiveRanking = activeRanking.slice(riderActiveRankingIndex, riderActiveRankingIndex + 4)
        }
    }
    if (alltimeRanking && riderRankingIndex) {
        if (riderRankingIndex > 2) {
            slicedRanking = alltimeRanking.slice(riderRankingIndex - 2, riderRankingIndex + 3)
        } else if (riderRankingIndex == 1) {
            slicedRanking = alltimeRanking.slice(riderRankingIndex - 1, riderRankingIndex + 4)
        } else if (riderRankingIndex == 0) {
            slicedRanking = alltimeRanking.slice(riderRankingIndex, riderRankingIndex + 5)
        }
    }

    return (
        <div className="twitter-meta-container">
            {riderData && highlightedResult && riderActiveRankingIndex && oldNationsRanking && oldActiveRanking && !searchParams &&
                <div className={"twitter-snapshot-container " + fontColor} id="snapshot" ref={ref}>
                    <div className="left" style={{ backgroundColor: color }}>
                        <img
                            src={imgSrc}
                            onError={() => setImgSrc("https://fyoonxbvccocgqkxnjqs.supabase.co/storage/v1/object/public/riderPortraits/nopicture.png")}
                            height={200}
                            width={200}
                            quality={100}
                            alt={"Billede af " + riderData?.fullName.replace(" ", "").toLowerCase()}
                            className="img"
                            crossOrigin="anonymous"
                        />
                        <div>
                            <div className="">
                                <p>
                                    <span className={'fi fi-' + riderData.nationFlagCode}></span>
                                    {riderData.nation}</p>
                                <p>{riderData.birthYear}</p>
                            </div>
                            <p className="name" style={{ fontSize: fontSize, lineHeight: 1 }}>{riderData.fullName}</p>
                            <p>{riderData.currentTeam}</p>
                        </div>
                    </div>
                    <div className="right">
                        <div className="result-title-container">
                            <h4>
                                {!Array.isArray(highlightedResult.race) ?
                                    highlightedResult.race.split(" (")[0] :
                                    highlightedResult.race.map((i, index) => {
                                        return (index == highlightedResult.race.length - 1 ? "og " + i.split(" (")[0] : (index == 0 ? i.split(" (")[0] : ", " + i.split(" (")[0]))
                                    }).join("")
                                }</h4>
                            <p>{highlightedResult.racePoints} point</p>
                        </div>
                        <div className="changes-wrapper">
                            <div className="change-container">
                                <p className="label">All time</p>
                                <div className="content">
                                    <p>{highlightedResult.newRank}</p>
                                    <div className="">
                                        <p>{highlightedResult.oldRank - highlightedResult.newRank == 0 ? <TiEquals /> : <IoCaretUpOutline className="up-icon" />}{highlightedResult.oldRank - highlightedResult.newRank}</p>
                                        <p>{highlightedResult.oldRank}</p>
                                    </div>
                                </div>
                            </div>
                            {/* <div className="change-container">
                            <p className="label">All time</p>
                                <div className="content">
                                <p>{highlightedResult.newPoints}</p>
                                <div className="">
                                    <p>{highlightedResult.newPoints - highlightedResult.oldPoints}</p>
                                    <p>{highlightedResult.oldPoints}</p>
                                </div>
                            </div> */}
                            <div className="change-container">
                                <p className="label">Aktive</p>
                                <div className="content">
                                    <p>{activeRanking.find(i => i.fullName.toLowerCase() == name.toLowerCase()).currentRank}</p>
                                    <div className="">
                                        <p>{oldActiveRanking.currentRank - activeRanking.find(i => i.fullName.toLowerCase() == name.toLowerCase()).currentRank == 0 ? <TiEquals /> : <IoCaretUpOutline className="up-icon" />}{oldActiveRanking.currentRank - activeRanking.find(i => i.fullName.toLowerCase() == name.toLowerCase()).currentRank}</p>
                                        <p>{oldActiveRanking.currentRank}</p>
                                    </div>
                                </div>
                            </div>
                            <div className="change-container">
                                <p className="label">{riderData.nation}</p>
                                <div className="content">
                                    <p>{newNationsRanking.currentRank}</p>
                                    <div className="">
                                        <p>{oldNationsRanking.currentRank - newNationsRanking.currentRank == 0 ? <TiEquals /> : <IoCaretUpOutline className="up-icon" />}{oldNationsRanking.currentRank - newNationsRanking.currentRank}</p>
                                        <p>{oldNationsRanking.currentRank}</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="twitter-table-wrapper">
                            <h4>Placering blandt aktive ryttere:</h4>
                            <div className="table">
                                <div className="table-header">
                                    <p>Placering</p>
                                    <p>Rytter</p>
                                    <p>Årgang</p>
                                    <p>Point</p>
                                </div>
                                <div className="table-content">

                                    {slicedActiveRanking && slicedActiveRanking.map(rider => {
                                        const nameArr = rider.fullName.split(/ (.*)/);

                                        return (
                                            <div key={rider.id} className={rider.fullName.toLowerCase() == name.toLowerCase() ? "table-row highlight" : "table-row"} style={{ backgroundColor: rider.fullName.toLowerCase() == name.toLowerCase() && color }}>
                                                <p>{rider.currentRank.toLocaleString("de-DE")}</p>
                                                <p className="table-name-reversed"><span className={"fi fi-" + rider.nationFlagCode}></span><span className="last-name">{nameArr[1]} </span><span>{nameArr[0]}</span></p>
                                                <p>{rider.birthYear}</p>
                                                <p>{rider.points.toLocaleString("de-DE")}</p>
                                            </div>
                                        )
                                    })}
                                </div>
                            </div>
                        </div>

                        <div className="greatest-results">
                            <RiderResults resultData={riderResults} />
                        </div>
                    </div>
                </div>
            }
            {riderData && (!latestResults || searchParams) &&
                <div className={"twitter-snapshot-container " + fontColor} id="snapshot" ref={ref}>
                    <div className="left" style={{ backgroundColor: color }}>
                        <img
                            src={imgSrc}
                            onError={() => setImgSrc("https://fyoonxbvccocgqkxnjqs.supabase.co/storage/v1/object/public/riderPortraits/nopicture.png")}
                            height={200}
                            width={200}
                            quality={100}
                            alt={"Billede af " + riderData?.fullName.replace(" ", "").toLowerCase()}
                            className="img"
                            crossOrigin="anonymous"
                        />
                        <div>
                            <div className="">
                                <p>
                                    <span className={'fi fi-' + riderData.nationFlagCode}></span>
                                    {riderData.nation}</p>
                                <p>{riderData.birthYear}</p>
                            </div>
                            <p style={{ fontSize: fontSize, lineHeight: 1 }}>{riderData.fullName}</p>
                            <p>{riderData.active && riderData.currentTeam}</p>
                        </div>
                    </div>
                    <div className="right">
                        <div>
                            <h4 className="rank-label">Placeringer på Prestigelisten:</h4>
                            <div className="changes-wrapper">
                                <div className="change-container">
                                    <p className="label">All time</p>
                                    <div className="content">
                                        <p>{riderData.currentRank}</p>
                                    </div>
                                </div>
                                <div className="change-container">
                                    <p className="label">{riderData.nation}</p>
                                    <div className="content">
                                        <p>{alltimeRankByNation.currentRank}</p>
                                    </div>
                                </div>
                                <div className="change-container">
                                    <p className="label">Født i {riderData.birthYear}</p>
                                    <div className="content">
                                        <p>{alltimeRankByYear.currentRank}</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="twitter-table-wrapper">
                            <h4>All time placering:</h4>
                            <div className="table">
                                <div className="table-header">
                                    <p>Placering</p>
                                    <p>Rytter</p>
                                    <p>Årgang</p>
                                    <p>Point</p>
                                </div>
                                <div className="table-content">

                                    {slicedRanking && slicedRanking.map(rider => {
                                        const nameArr = rider.fullName.split(/ (.*)/);

                                        return (
                                            <div key={rider.id} className={rider.fullName.toLowerCase() == name.toLowerCase() ? "table-row highlight" : "table-row"} style={{ backgroundColor: rider.fullName.toLowerCase() == name.toLowerCase() && color }}>
                                                <p>{rider.currentRank.toLocaleString("de-DE")}</p>
                                                <p className="table-name-reversed"><span className={"fi fi-" + rider.nationFlagCode}></span><span className="last-name">{nameArr[1]} </span><span>{nameArr[0]}</span></p>
                                                <p>{rider.birthYear}</p>
                                                <p>{rider.points.toLocaleString("de-DE")}</p>
                                            </div>
                                        )
                                    })}
                                </div>
                            </div>
                        </div>
                        <div className="greatest-results">
                            <RiderResults resultData={riderResults} />
                        </div>
                    </div>
                </div>
            }
            <div className="twitter-controls">
                <Link href={"https://fyoonxbvccocgqkxnjqs.supabase.co/storage/v1/object/public/twitterPics/" + rider.fullName + ".png"}>Revalidér billede</Link>
                <div>
                    <button onClick={() => setFontSize(fontSize + 1)}><IoChevronUpOutline /></button>
                    <p>Tekststørrelse: {fontSize}</p>
                    <button onClick={() => setFontSize(fontSize - 1)}><IoChevronDownOutline /></button>
                </div>
                <label htmlFor="color">Farvekode (HEX): #</label>
                <input type="text" name="color" id="colorInp" value={colorInput} onChange={e => setColorInput(e.target.value)} />
                <button onClick={() => setColor("#" + colorInput)}>Sæt farve</button>
                <button onClick={() => setFontColor(fontColor == "dark" ? "light" : "dark")}>{fontColor !== "dark" ? "Lys tekst" : "Mørk tekst"}</button>
                <button onClick={() => handleSnapshot()}>Sæt billede</button>
                <p>{uploadState}</p>
            </div>
        </div>
    )
}