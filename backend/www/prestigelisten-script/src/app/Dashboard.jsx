"use client"

import Script from "next/script";
import { useState } from "react";

const nationFlagCodes = {
  "Spanien": "es",
  "Nederlandene": "nl",
  "Schweiz": "ch",
  "Tyskland": "de",
  "Storbritannien": "gb",
  "Irland": "ie",
  "Danmark": "dk",
  "Slovenien": "si",
  "Slovakiet": "sk",
  "Portugal": "pt",
  "Polen": "pl",
  "Kasakhstan": "kz",
  "Sverige": "se",
  "Ukraine": "ua",
  "Østrig": "at",
  "Tjekkiet": "cz",
  "Letland": "lv",
  "Sovjetunionen": "xx",
  "Usbekistan": "uz",
  "Litauen": "lt",
  "Sydafrika": "za",
  "Mexico": "mx",
  "Estland": "ee",
  "Belarus": "by",
  "Østtyskland": "xx",
  "Moldova": "md",
  "New Zealand": "nz",
  "Costa Rica": "cr",
  "Ungarn": "hu",
  "Kroatien": "hr",
  "Japan": "jp",
  "Bulgarien": "bg",
  "Algeriet": "dz"
}

function convertToObject(range) {
  const data = range.values.slice(1)
  const header = range.values[0]
  return data.map(row => {
    return row.map((cell, index) => {
      return { [header[index]]: cell }
    }).reduce((acc, obj) => {
      return { ...acc, ...obj }
    }, {})
  })
}

async function fetchData(supabase) {
  const { data: alltimeRanking } = await supabase.from('alltimeRanking').select('*');
  const { data: calendar } = await supabase.from('calendar').select('*');
  const { data: rankingPerYear } = await supabase.from('alltimeRankingPerYear').select('2023Points, 2023Rank, rider');
  const { data: pointSystem } = await supabase.from('pointSystem').select('*');
  const { data: resultsCurYear } = await supabase.from('results').select('*').eq('year', 2023);
  const { data: nationsList } = await supabase.from('nationsRanking').select('*');

  return {
    alltimeRanking: alltimeRanking,
    calendar: calendar,
    rankingPerYear: rankingPerYear,
    pointSystem: pointSystem,
    resultsCurYear: resultsCurYear,
    nationsList: nationsList,
  };
}

async function postNewRider(payload, supabase) {
  const { data } = await supabase
    .from('alltimeRanking')
    .insert(payload)
    .select()
}

async function updateAlltimeRanking(payload, rider, supabase) {
  const { data } = await supabase
    .from('alltimeRanking')
    .update({ "points": payload })
    .eq("fullName", rider)
    .select()
}

async function updateAlltimeRankingPerYear(points, rank, rider, supabase) {
  const { data, error } = await supabase
    .from('alltimeRankingPerYear')
    .update({ "2023Points": points, "2023Rank": rank })
    .eq("rider", rider)
    .select()
}

async function postRankingPerYear(points, rank, rider, supabase) {
  const { data } = await supabase
    .from('alltimeRankingPerYear')
    .insert({ "rider": rider, "2023Points": points, "2023Rank": rank })
    .select()
}

async function updateNationResultCount(count, nation, supabase) {
  const { data, error } = await supabase
    .from('nationResultCount')
    .update({ "2023": count })
    .eq("nation", nation)
    .select()
}

async function postResult(race, rider, date, supabase, index) {
  if (index) {
    var { data } = await supabase
      .from('results')
      .insert({ "year": 2023, "race": race, "rider": rider, "raceDate": date, "index": index })
      .select()
  } else {
    var { data } = await supabase
      .from('results')
      .insert({ "year": 2023, "race": race, "rider": rider, "raceDate": date })
      .select()
  }
}

async function updateNationsRanking(payload, nation, supabase) {
  const { data } = await supabase
    .from('nationsRanking')
    .update(payload)
    .eq("nation", nation)
    .select()
}

async function changeActiveStatus(status, rider, supabase) {
  const { data } = await supabase
    .from('alltimeRanking')
    .update({ "active": status, "currentTeam": null })
    .eq("fullName", rider)
    .select()
}

async function updateActiveTeam(newTeam, rider, supabase) {
  const { data } = await supabase
    .from('alltimeRanking')
    .update({ "currentTeam": newTeam })
    .eq("fullName", rider)
    .select()
}

export default function Dashboard(props) {
  const supabase = props.supabase
  const nM = "Colombiansk mesterEcuadoriansk mester (>2020)Australsk mester (1984-1994 + 1996 + >1997)Tysk mester (<1942 + 1947-1956 + 1959-1975 + >1978)Dansk mester (1968 + 1970-1973 + 1981-1985 + >1986)Norsk mester (1990 + >2007)Amerikansk mester (>1998)Portugisisk mester (1975-1979 + 1984 + 2010-2016 + >2019)Schweizisk mester (1904 + 1912-1970 + >1975)Slovensk mester (>2003)Tjekkisk mester (2001-2005 + >2012)Østrigsk mester (1988-1989 + 2006 + 2008 >2017)Britisk mester (1965-1967 + 1970-1976 + 1987-1998 + 2000 + 2002 + >2003)Canadisk mester (2012-2013)Irsk mester (2010-2013 + 2017-2021)Belarusisk mester (2009-2016)Kasakhisk mester (1998-2012)Litauisk mester (2012-2016)Russisk mester (<2022)Svensk mester (1980-1985 + 1999-2003 + 2007-2009 + 2012-2013)Polsk mester (1995-1997 + 1999-2004 + 2012-2022)Ukrainsk mester (1996-2009)Luxembourgsk mester (1936-1940 + 1948 + 1950-1961 + 2005-2010 + 2016)Fransk mesterSpansk mesterBelgisk mesterNederlandsk mesterItaliensk mesterSpansk mester i enkeltstartFransk mester i enkeltstartBelgisk mester i enkeltstartItaliensk mester i enkeltstartNederlandsk mester i enkeltstartColombiansk mester i enkeltstartEcuadoriansk mester i enkeltstart (>2020)Norsk mester i enkeltstart (1990 + >2007)Australsk mester i enkeltstartSchweizisk mester i enkeltstartTjekkisk mester i enkeltstart (2001-2005 + >2012)Tysk mester i enkeltstartDansk mester i enkeltstart (<1974 + 1981-1985 + >1986)Slovensk mester i enkeltstart (>2003)Portugisisk mester i enkeltstart (1975 + 2010-2016 + >2019)Østrigsk mester i enkeltstart (2006 + 2008 + >2017)Amerikansk mester i enkeltstart (1984-1996 + >1998)Britisk mester i enkeltstart (<1999 + 2000 + 2002 + >2003)Litauisk mester i enkeltstart (2012-2016)Polsk mester i enkeltstart (1996-1997 + 1999-2004 + 2012-2022)Russisk mester i enkeltstart (<2022)Ukrainsk mester i enkeltstart (<2010)Belarusisk mester i enkeltstart (2009-2016)Luxembourgsk mester i enkeltstart (1951 + 2005-2010 + 2016)Canadisk mester i enkeltstart (2012-2013)Irsk mester i enkeltstart (2010-2013 + 2017-2021)Kasakhisk mester i enkeltstart (<2013)Svensk mester i enkeltstart (1980-1985 + 1999-2003 + 2007-2009 + 2012-2013)"
  const [status, setStatus] = useState("");
  const date = new Date();
  const formattedDate = date.getFullYear() + "-" + (date.getMonth().toString().length == 2 ? date.getMonth() + 1 : "0" + (date.getMonth() + 1)) + "-" + (date.getDate().toString().length == 2 ? date.getDate() : "0" + date.getDate())

  const CLIENT_ID = '1008152836160-1fl7hhkb0fg29782ojh6ap9islv6839n.apps.googleusercontent.com';
  const API_KEY = 'AIzaSyDWYapUXymPyhDLqqRla2MkmIrvO0WTyZc';

  // Discovery doc URL for APIs used by the quickstart
  const DISCOVERY_DOC = 'https://sheets.googleapis.com/$discovery/rest?version=v4';

  // Authorization scopes required by the API; multiple scopes can be
  // included, separated by spaces.
  const SCOPES = 'https://www.googleapis.com/auth/spreadsheets.readonly';

  let tokenClient;
  let gapiInited = false;
  let gisInited = false;
  let alltimeRanking;
  let calendar;
  let rankingPerYear;
  let pointSystem;
  let resultsCurYear;
  let nationsList;

  fetchData(supabase).then(res => {
    alltimeRanking = res.alltimeRanking;
    calendar = res.calendar;
    rankingPerYear = res.rankingPerYear;
    pointSystem = res.pointSystem;
    resultsCurYear = res.resultsCurYear;
    nationsList = res.nationsList;
  })

  /**
   * Callback after api.js is loaded.
   */
  function gapiLoaded() {
    console.log("loaded")
    gapi.load('client', initializeGapiClient);
  }

  /**
   * Callback after the API client is loaded. Loads the
   * discovery doc to initialize the API.
   */
  async function initializeGapiClient() {
    await gapi.client.init({
      apiKey: API_KEY,
      discoveryDocs: [DISCOVERY_DOC],
    });
    gapiInited = true;
    maybeEnableButtons();
  }

  /**
   * Callback after Google Identity Services are loaded.
   */
  function gisLoaded() {
    tokenClient = google.accounts.oauth2.initTokenClient({
      client_id: CLIENT_ID,
      scope: SCOPES,
      callback: '', // defined later
    });
    gisInited = true;
    maybeEnableButtons();
  }

  /**
   * Enables user interaction after all libraries are loaded.
   */
  function maybeEnableButtons() {
    if (gapiInited && gisInited) {
    }
  }

  /**
   *  Sign in the user upon button click.
   */
  function handleAuthClick() {
    setStatus("Kører...")
    tokenClient.callback = async (resp) => {
      if (resp.error !== undefined) {
        throw (resp);
      }
      document.getElementById('authorize_button').innerText = 'Refresh';
      await postAlltimeRanking();
      await postResults();
      await postNations();
      await postActive();
      setStatus("Færdig")
    };

    if (gapi.client.getToken() === null) {
      // Prompt the user to select a Google Account and ask for consent to share their data
      // when establishing a new session.
      tokenClient.requestAccessToken({ prompt: 'consent' });
    } else {
      // Skip display of account chooser and consent dialog for an existing session.
      tokenClient.requestAccessToken({ prompt: '' });
    }
  }

  /**
   *  Sign out the user upon button click.
   */
  function handleSignoutClick() {
    const token = gapi.client.getToken();
    if (token !== null) {
      google.accounts.oauth2.revoke(token.access_token);
      gapi.client.setToken('');
      document.getElementById('content').innerText = '';
      document.getElementById('authorize_button').innerText = 'Authorize';
      document.getElementById('signout_button').style.visibility = 'hidden';
    }
  }

  /**
   * Print the names and majors of students in a sample spreadsheet:
   * https://docs.google.com/spreadsheets/d/1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs74OgvE2upms/edit
   */


  async function postAlltimeRanking() {
    let response;
    try {
      response = await gapi.client.sheets.spreadsheets.values.get({
        spreadsheetId: '14JS3ioc3jaFTDX2wuHRniE3g3S2yyg1QkfJ7FiNgAE8',
        range: 'All time!A:E',
      });
    } catch (err) {
      document.getElementById('content').innerText = err.message;
      return;
    }
    const range = response.result;
    if (!range || !range.values || range.values.length == 0) {
      document.getElementById('content').innerText = 'No values found.';
      return;
    }

    const data = convertToObject(range).filter(i => i.Rytter !== '' && i.Rytter);
    alltimeRanking.filter(i => data.find(j => i.fullName == j.Rytter).Point.toString() !== i.points.toString())
    data.map(row => {
      if (!alltimeRanking.map(i => i.fullName).includes(row.Rytter)) {
        let flagCode;
        if (Object.keys(nationFlagCodes).includes(row.Nationalitet)) {
          flagCode = nationFlagCodes[row.Nationalitet]
        } else {
          flagCode = row.Nationalitet.slice(0, 2).toLowerCase()
        }
        const payload = { "fullName": row.Rytter, "birthYear": row.Årgang, "points": row.Point, "active": true, "nation": row.Nationalitet, "nationFlagCode": flagCode }
        postNewRider(payload, supabase)
        console.log("Tilføjede til 'alltimeRanking':")
        console.log(payload)
      } else {
        if (!rankingPerYear.map(i => i.rider).includes(row.Rytter)) {
          postRankingPerYear(row.Point, row.Placering, row.Rytter, supabase)
          console.log("Tilføjede til 'alltimeRankingPerYear':")
          console.log(row.Rytter + " 2023 point: " + row.Point + " 2023 placering: " + row.Placering)
        } else {
          if (row.Point.toString() !== alltimeRanking.find(i => i.fullName == row.Rytter).points.toString() || row.Point !== rankingPerYear.find(i => i.rider == row.Rytter)["2023Points"]?.toString() || row.Placering !== rankingPerYear.find(i => i.rider == row.Rytter)["2023Rank"]?.toString()) {
            updateAlltimeRanking(row.Point, row.Rytter, supabase)
            console.log("Opdaterede til 'alltimeRanking':")
            console.log(row.Rytter + " Point: " + row.Point)

            updateAlltimeRankingPerYear(row.Point, row.Placering, row.Rytter, supabase)
            console.log("Opdaterede til 'alltimeRankingPerYear':")
            console.log(row.Rytter + " 2023 point: " + row.Point + " 2023 placering: " + row.Placering)
          }
        }
      }
    })
  }

  async function postResults() {
    let response;
    try {
      response = await gapi.client.sheets.spreadsheets.values.get({
        spreadsheetId: '14JS3ioc3jaFTDX2wuHRniE3g3S2yyg1QkfJ7FiNgAE8',
        range: 'Resultater!A1:ACD2',
      });
    } catch (err) {
      document.getElementById('content').innerText = err.message;
      return;
    }
    const range = response.result;
    if (!range || !range.values || range.values.length == 0) {
      document.getElementById('content').innerText = 'No values found.';
      return;
    }

    const resultRidersList = [];
    range.values[0].map((race, index) => {
      const rider = range.values[1][index]
      if (rider !== "" && !index == 0 && rider && !race.includes("i førertrøjen")) {
        if (!resultsCurYear.map(i => i.race).includes(race)) {
          postResult(race, rider, calendar.find(i => i.race == race).date, supabase)
          console.log("Tilføjede til 'results':")
          console.log(race + ": " + rider + ", date: " + calendar.find(i => i.race == race)?.date)
        }

        if (!nM.includes(race)) {
          resultRidersList.push(rider)
        }
      } else if (race.includes("i førertrøjen") && rider) {
        const indexArr = resultsCurYear.reduce((acc, obj) => {
          if (obj.index) {
            return [...acc, obj.index]
          } else {
            return acc
          }
        }, []);
        if (!indexArr.includes(index)) {
          postResult(race.replace("Øvrige dage", "Øvrig dag"), rider, formattedDate, supabase, index)
          console.log(race + ": " + rider + ", date: " + formattedDate)
        }
      }
    })

    const nationResultCount = resultRidersList.reduce((acc, obj) => {
      const rider = alltimeRanking.find(i => i.fullName == obj);
      if (rider) {
        const key = rider.nation;
        const currNation = acc[key] ?? 0;
        return { ...acc, [key]: currNation + 1 }
      } else {
        return { ...acc }
      }
    }, {});

    Object.keys(nationResultCount).map(i => {
      updateNationResultCount(nationResultCount[i], i, supabase)
      console.log("Opdaterede til 'nationResultCount':")
      console.log(i + ": " + "2023:" + nationResultCount[i])
    })
  }

  async function postNations() {
    let response;
    try {
      response = await gapi.client.sheets.spreadsheets.values.get({
        spreadsheetId: '14JS3ioc3jaFTDX2wuHRniE3g3S2yyg1QkfJ7FiNgAE8',
        range: 'Største nationer!A2:E',
      });
    } catch (err) {
      console.log(err.message);
      return;
    }
    const range = response.result;
    if (!range || !range.values || range.values.length == 0) {
      console.log('No values found.');
      return;
    }

    const sheetsNationsRanking = convertToObject(range);
    const activeNationPoints = alltimeRanking.filter(i => i.active == true).reduce((acc, obj) => {
      const key = obj.nation;
      const currNation = acc[key] ?? 0;

      return { ...acc, [key]: currNation + obj.points }
    }, {});

    const activeNumberOfRiders = alltimeRanking.filter(i => i.active == true).reduce((acc, obj) => {
      const key = obj.nation;
      const currNation = acc[key] ?? 0;

      return { ...acc, [key]: currNation + 1 }
    }, {});

    sheetsNationsRanking.map(nation => {
      const supabaseNation = nationsList.find(i => i.nation == nation.Nation)
      const curNationActivePoints = activeNationPoints[nation.Nation]
      const curNationActiveNumberOfRiders = activeNumberOfRiders[nation.Nation]
      const payload = { "points": nation["Point"], "numberOfRiders": nation["Antal ryttere"], "activePoints": curNationActivePoints, "activeNumberOfRiders": curNationActiveNumberOfRiders }

      updateNationsRanking(payload, nation.Nation, supabase)
      console.log("Opdaterede til 'nationsRanking':")
      console.log(nation, ": ", payload)
    })
  }

  async function postActive() {
    let response;
    try {
      response = await gapi.client.sheets.spreadsheets.values.get({
        spreadsheetId: '14JS3ioc3jaFTDX2wuHRniE3g3S2yyg1QkfJ7FiNgAE8',
        range: 'Største aktive!A:G',
      });
    } catch (err) {
      document.getElementById('content').innerText = err.message;
      return;
    }
    const range = response.result;
    if (!range || !range.values || range.values.length == 0) {
      document.getElementById('content').innerText = 'No values found.';
      return;
    }

    const activeRanking = convertToObject(range).filter(i => i.Rytter);
    const supabaseActiveRanking = alltimeRanking.filter(i => i.active == true)

    supabaseActiveRanking.map(rider => {
      if (!activeRanking.find(i => i.Rytter == rider.fullName)) {
        changeActiveStatus(false, rider.fullName)
        console.log("Fjernet fra aktive ryttere:")
        console.log(rider.fullName)
      }
    })

    activeRanking.map(rider => {
      console.log(rider)
      const supabaseRider = alltimeRanking.find(i => i.fullName == rider.Rytter);
      updateActiveTeam(rider.Hold, rider.Rytter, supabase)
      console.log("Opdaterede rytters hold:")
      console.log("Rytter: " + rider.Rytter + " Hold: " + rider.Hold)
    })

  }

  return (
    <div>
      <div>
        <button id="authorize_button" onClick={() => handleAuthClick()}>Authorize</button>
        <button id="signout_button" onClick={() => handleSignoutClick()}>Sign Out</button>
      </div>
      <div>
        <p>{status}</p>
      </div>
      <Script src="https://apis.google.com/js/api.js" onLoad={() => gapiLoaded()}></Script>
      <Script src="https://accounts.google.com/gsi/client" onLoad={() => gisLoaded()}></Script>
    </div>
  )
}
