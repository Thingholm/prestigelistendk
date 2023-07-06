from __future__ import print_function

import os.path

from google.auth.transport.requests import Request
from google.oauth2.credentials import Credentials
from google_auth_oauthlib.flow import InstalledAppFlow
from googleapiclient.discovery import build
from googleapiclient.errors import HttpError

import datetime

import itertools

import json

from dotenv import load_dotenv
from supabase import create_client, Client

load_dotenv()

SUPABASE_URL = os.getenv('SUPABASE_URL')
SUPABASE_API_KEY = os.getenv('SUPABASE_API_KEY')
supabase: Client = create_client(SUPABASE_URL, SUPABASE_API_KEY)

# If modifying these scopes, delete the file token.json.
SCOPES = ['https://www.googleapis.com/auth/spreadsheets.readonly']

# The ID and range of a sample spreadsheet.
SAMPLE_SPREADSHEET_ID = '14JS3ioc3jaFTDX2wuHRniE3g3S2yyg1QkfJ7FiNgAE8'
SAMPLE_RANGE_NAME = 'All time!A1:E'
SAMPLE_RANGE_RESULTS = 'Resultater!A1:ACD2'
SAMPLE_RANGE_NATIONS = "Største nationer!A1:E"
SAMPLE_RANGE_ACTIVE = "Største aktive!A:G"
SAMPLE = "Resultater!PI:QQ"

def main():
    nationFlagCodes = json.load(open("backend/scraper/nations.json"))

    calendar = supabase.table("calendar").select("*").execute()
    calendarDict = {x["race"]: x["date"] for x in json.loads(calendar.json())["data"]}

    nM = "Colombiansk mesterEcuadoriansk mester (>2020)Australsk mester (1984-1994 + 1996 + >1997)Tysk mester (<1942 + 1947-1956 + 1959-1975 + >1978)Dansk mester (1968 + 1970-1973 + 1981-1985 + >1986)Norsk mester (1990 + >2007)Amerikansk mester (>1998)Portugisisk mester (1975-1979 + 1984 + 2010-2016 + >2019)Schweizisk mester (1904 + 1912-1970 + >1975)Slovensk mester (>2003)Tjekkisk mester (2001-2005 + >2012)Østrigsk mester (1988-1989 + 2006 + 2008 >2017)Britisk mester (1965-1967 + 1970-1976 + 1987-1998 + 2000 + 2002 + >2003)Canadisk mester (2012-2013)Irsk mester (2010-2013 + 2017-2021)Belarusisk mester (2009-2016)Kasakhisk mester (1998-2012)Litauisk mester (2012-2016)Russisk mester (<2022)Svensk mester (1980-1985 + 1999-2003 + 2007-2009 + 2012-2013)Polsk mester (1995-1997 + 1999-2004 + 2012-2022)Ukrainsk mester (1996-2009)Luxembourgsk mester (1936-1940 + 1948 + 1950-1961 + 2005-2010 + 2016)Fransk mesterSpansk mesterBelgisk mesterNederlandsk mesterItaliensk mesterSpansk mester i enkeltstartFransk mester i enkeltstartBelgisk mester i enkeltstartItaliensk mester i enkeltstartNederlandsk mester i enkeltstartColombiansk mester i enkeltstartEcuadoriansk mester i enkeltstart (>2020)Norsk mester i enkeltstart (1990 + >2007)Australsk mester i enkeltstartSchweizisk mester i enkeltstartTjekkisk mester i enkeltstart (2001-2005 + >2012)Tysk mester i enkeltstartDansk mester i enkeltstart (<1974 + 1981-1985 + >1986)Slovensk mester i enkeltstart (>2003)Portugisisk mester i enkeltstart (1975 + 2010-2016 + >2019)Østrigsk mester i enkeltstart (2006 + 2008 + >2017)Amerikansk mester i enkeltstart (1984-1996 + >1998)Britisk mester i enkeltstart (<1999 + 2000 + 2002 + >2003)Litauisk mester i enkeltstart (2012-2016)Polsk mester i enkeltstart (1996-1997 + 1999-2004 + 2012-2022)Russisk mester i enkeltstart (<2022)Ukrainsk mester i enkeltstart (<2010)Belarusisk mester i enkeltstart (2009-2016)Luxembourgsk mester i enkeltstart (1951 + 2005-2010 + 2016)Canadisk mester i enkeltstart (2012-2013)Irsk mester i enkeltstart (2010-2013 + 2017-2021)Kasakhisk mester i enkeltstart (<2013)Svensk mester i enkeltstart (1980-1985 + 1999-2003 + 2007-2009 + 2012-2013)"

    alltimeRanking = supabase.table("alltimeRanking").select("fullName", "points", "currentTeam", "nation", "active").execute()
    alltimeRankingFullNames = []
    alltimeRankingDict = {}
    alltimeDict = {}
    for index, x in enumerate(alltimeRanking):
        if index == 0:
            for y in x[1]:
                alltimeRankingFullNames.append(y["fullName"])
                alltimeRankingDict[y["fullName"]] = y["points"]
                alltimeDict[y["fullName"]] = y

    rankingPerYear = supabase.table("alltimeRankingPerYear").select("rider", "2023Points", "2023Rank").execute()
    rankingPerYearFullNames = []
    rankingPerYearDict = {}
    rankingPerYearRankDict = {}
    for index, x in enumerate(rankingPerYear):
        if index == 0:
            for y in x[1]:
                rankingPerYearFullNames.append(y["rider"])
                rankingPerYearDict[y["rider"]] = y["2023Points"]
                rankingPerYearRankDict[y["rider"]] = y["2023Rank"]

    pointSystem = {x["raceName"]: x["points"] for x in json.loads(supabase.table("pointSystem").select("raceName", "points").execute().json())["data"]}

    resultsCurYear = supabase.table("results").select("*").eq("year", 2023).order("rider").execute()
    resultsCurYearRaceList = []
    resultsCurYearDict = {}
    for index, x in enumerate(resultsCurYear):
        if index == 0:
            for y in x[1]:
                resultsCurYearRaceList.append(y["race"])
                resultsCurYearDict[y["race"]] = y["raceDate"]

    nationsList = json.loads(supabase.table("nationsRanking").select("*").execute().json())["data"]
    nationNameList = [x["nation"] for x in nationsList]
    nationDict = {x["nation"]: x for x in nationsList}
    
    nationResultCount = {x["nation"]: x["2023"] for x in json.loads(supabase.table("nationResultCount").select("nation", "2023").execute().json())["data"]}

    print(nationResultCount)


    riderDict = {x["fullName"]: x for x in json.loads(alltimeRanking.json())["data"]}
    activeRiders = [x for x in json.loads(alltimeRanking.json())["data"] if x["active"] == True]

    sortedList = sorted(activeRiders, key=lambda x: x["nation"])

    for k, g in itertools.groupby(sortedList, lambda x: x["nation"]):
        points = sum(x["points"] for x in list(g))
        number = [x["nation"] for x in sortedList].count(k)
        updateData = supabase.table("nationsRanking").update({"activePoints": points, "activeNumberOfRiders": number}).eq("nation", k).execute()
    
    newRiders = {}

    # print(activeRiders)

    """Shows basic usage of the Sheets API.
    Prints values from a sample spreadsheet.
    """
    creds = None
    # The file token.json stores the user's access and refresh tokens, and is
    # created automatically when the authorization flow completes for the first
    # time.
    if os.path.exists('backend/scraper/token.json'):
        creds = Credentials.from_authorized_user_file('backend/scraper/token.json', SCOPES)
    # If there are no (valid) credentials available, let the user log in.
    if not creds or not creds.valid:
        if creds and creds.expired and creds.refresh_token:
            creds.refresh(Request())
        else:
            flow = InstalledAppFlow.from_client_secrets_file(
                'backend/scraper/credentials.json', SCOPES)
            creds = flow.run_local_server(port=0)
        # Save the credentials for the next run
        with open('backend/scraper/token.json', 'w') as token:
            token.write(creds.to_json())

    try:
        service = build('sheets', 'v4', credentials=creds)

        # Call the Sheets API
        sheet = service.spreadsheets()
        result = sheet.values().get(spreadsheetId=SAMPLE_SPREADSHEET_ID,
                                     range=SAMPLE_RANGE_NAME).execute()
        values = result.get('values', [])

        if not values:
             print('No data found.')
             return

        for row in values:
            if not row[1]:
                break
            if not row[1] == "Rytter":
                if not row[1] in alltimeRankingFullNames:
                    nameArr = row[1].split(" ")
                    firstName = nameArr[0]
                    lastName = " ".join(nameArr[1:])
                    if row[3] in nationFlagCodes:
                        flagCode = nationFlagCodes[row[3]]
                    else:
                        flagCode = row[3][:2].lower()
                    
                    newRiders[row[1]] = {"fullName": row[1], "nation": row[3]}

                    insertData = supabase.table("alltimeRanking").insert({"fullName": row[1], "lastName": lastName, "firstName": firstName, "nation": row[3], "nationFlagCode": flagCode, "birthYear": row[4], "points": row[2], "active": True}).execute()
                    print("INSERTED TO ALLTIMERANKING: ")
                    print({"fullName": row[1], "lastName": lastName, "firstName": firstName, "nation": row[3], "nationFlagCode": flagCode, "birthYear": row[4], "points": row[2], "active": True})
                else:
                    if str(alltimeRankingDict[row[1]]) != str(row[2]):
                        updateData = supabase.table("alltimeRanking").update({"points": row[2]}).eq("fullName", row[1]).execute()
                        print("UPDATED TO ALLTIMERANKING: ")
                        print({"points": row[2], "fullName": row[1]})
                if not row[1] in rankingPerYearFullNames:
                    insertData = supabase.table("alltimeRankingPerYear").insert({"rider": row[1], "2023Points": row[2], "2023Rank": row[0]}).execute()
                    print("INSERTED TO ALLTIMERANKINGPERYEAR: ")
                    print({"rider": row[1], "2023Points": row[2], "2023Rank": row[0]})
                else:
                    if str(rankingPerYearDict[row[1]]) != str(row[2]) or str(rankingPerYearRankDict[row[1]]) != str(row[0]):
                        updateData = supabase.table("alltimeRankingPerYear").update({"2023Points": row[2], "2023Rank": row[0]}).eq("rider", row[1]).execute()
                        print("UPDATED TO ALLTIMERANKINGPERYEAR: ")
                        print({"2023Points": row[2], "2023Rank": row[0], "rider: ": row[1]})
    except HttpError as err:
        print(err)

    try:
        service = build('sheets', 'v4', credentials=creds)

        # Call the Sheets API
        sheet = service.spreadsheets()
        result = sheet.values().get(spreadsheetId=SAMPLE_SPREADSHEET_ID,
                                     range=SAMPLE_RANGE_RESULTS).execute()
        values = result.get('values', [])

        if not values:
             print('No data found.')
             return

        for riderIndex, rider in enumerate(values[1]):

            if rider and values[0][riderIndex] not in resultsCurYearRaceList and values[0][riderIndex]:
                if "i førertrøjen" in values[0][riderIndex]:
                    raceDate = datetime.datetime.now().strftime("%Y" + "-" + "%m" + "-" + "%d")
                else:
                    raceDate = calendarDict[values[0][riderIndex]]
                
                    print("INSERTED TO RESULTS: ")
                    print({"year": 2023, "race": values[0][riderIndex], "rider": rider, "raceDate": raceDate})

                    insertData = supabase.table("results").insert({"year": 2023, "race": values[0][riderIndex], "rider": rider, "raceDate": raceDate}).execute()

        newResList = []
        for x in json.loads(resultsCurYear.json())["data"]:
            if x["rider"] in alltimeRankingFullNames:
                x["nation"] = riderDict[x["rider"]]["nation"]
                race = x["race"]
                if "etape" in race:
                    race = race.split(". ")[1]
                x["points"] = pointSystem[race]

                if not race in nM and not "dag i førertrøjen" in race:
                    newResList.append(x)
        sortedList = sorted(newResList, key=lambda x: x["nation"])

        for k, g in itertools.groupby(sortedList, lambda x: x["nation"]):
            resultCount = len(list(g))
            print(k, resultCount)
            updateData = supabase.table("nationResultCount").update({"2023": resultCount}).eq("nation", k).execute()

    except HttpError as err:
        print(err)

    try:
        service = build('sheets', 'v4', credentials=creds)

        # Call the Sheets API
        sheet = service.spreadsheets()
        result = sheet.values().get(spreadsheetId=SAMPLE_SPREADSHEET_ID,
                                     range=SAMPLE_RANGE_NATIONS).execute()
        values = result.get('values', [])

        if not values:
             print('No data found.')
             return

        for nation in values[2:]:
            if nation[1] in nationNameList:
                if int(nation[2]) != nationDict[nation[1]]["points"] or int(nation[3]) != nationDict[nation[1]]["numberOfRiders"]:
                    updateData = supabase.table("nationsRanking").update({"points": nation[2], "numberOfRiders": nation[3]}).eq("nation", nation[1]).execute()
                    print("UPDATED TO NATIONS: ")
                    print({"points": nation[2], "numberOfRiders": nation[3]})
            else:
                if nation[1] in nationFlagCodes:
                    flagCode = nationFlagCodes[nation[1]]
                else:
                    flagCode = nation[1][:2].lower()
                insertData = supabase.table("nationsRanking").insert({"nation": nation[1], "flagCode": flagCode, "points": nation[2], "numberOfRiders": nation[3]}).execute()
                print("INSERTED TO NATIONS: ")
                print({"nation": nation[1], "flagCode": flagCode, "points": nation[2], "numberOfRiders": nation[3]})
    except HttpError as err:
        print(err)

    try:
        service = build('sheets', 'v4', credentials=creds)

        # Call the Sheets API
        sheet = service.spreadsheets()
        result = sheet.values().get(spreadsheetId=SAMPLE_SPREADSHEET_ID,
                                     range=SAMPLE_RANGE_ACTIVE).execute()
        values = result.get('values', [])

        if not values:
             print('No data found.')
             return

        for rider in values[2:]:
            if len(rider) > 2 and rider[1] != '0':
                riderName = rider[2].replace("van Keirsbulck", "Van Keirsbulck")
                if riderName in alltimeDict:
                    dbList = alltimeDict[riderName]
                if dbList["currentTeam"] != rider[5]:
                    updateData = supabase.table("alltimeRanking").update({"currentTeam": rider[5]}).eq("fullName", riderName).execute()
                    print(rider)

    except HttpError as err:
        print(err)
if __name__ == '__main__':
    main()