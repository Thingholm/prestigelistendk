from __future__ import print_function

import os.path

from google.auth.transport.requests import Request
from google.oauth2.credentials import Credentials
from google_auth_oauthlib.flow import InstalledAppFlow
from googleapiclient.discovery import build
from googleapiclient.errors import HttpError

import datetime
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
SAMPLE_SPREADSHEET_ID = '1sqGrGYQHGQQ1FH4t96ufA66koLnVLuk2PbW2vqTF2h4'
# SAMPLE_RANGE_NAME = 'All time!A1:E4108'
SAMPLE_RANGE_NAME = 'Resultater!A1:ACD2'


def main():
    """nationFlagCodes = json.load(open("backend/scraper/nations.json"))

    alltimeRanking = supabase.table("alltimeRanking").select("fullName", "points").execute()
    alltimeRankingFullNames = []
    alltimeRankingDict = {}
    for index, x in enumerate(alltimeRanking):
        if index == 0:
            for y in x[1]:
                alltimeRankingFullNames.append(y["fullName"])
                alltimeRankingDict[y["fullName"]] = y["points"]
    
    rankingPerYear = supabase.table("alltimeRankingPerYear").select("rider", "2023Points", "2023Rank").execute()
    rankingPerYearFullNames = []
    rankingPerYearDict = {}
    rankingPerYearRankDict = {}
    for index, x in enumerate(rankingPerYear):
        if index == 0:
            for y in x[1]:
                rankingPerYearFullNames.append(y["rider"])
                rankingPerYearDict[y["rider"]] = y["2023Points"]
                rankingPerYearRankDict[y["rider"]] = y["2023Rank"]"""
    
    resultsCurYear = supabase.table("results").select("*").eq("year", 2023).execute()
    resultsCurYearRaceList = []
    resultsCurYearDict = {}
    for index, x in enumerate(resultsCurYear):
        if index == 0:
            for y in x[1]:
                resultsCurYearRaceList.append(y["race"])
                resultsCurYearDict[y["race"]] = y["raceDate"]

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
        
        for riderIndex, rider in enumerate(values[1]):
            if rider and values[0][riderIndex] not in resultsCurYearRaceList:
                # print(rider.replace("'", "&#39;") + values[0][riderIndex].replace("'", "&#39;").replace(",", "comma"))
                insertData = supabase.table("results").insert({"year": 2023, "race": values[0][riderIndex].replace("'", "&#39;").replace(",", "comma"), "rider": rider.replace("'", "&#39;"), "raceDate": datetime.date.today().strftime("%Y" + "-" + "%m" + "-" + "%d")}).execute()
                print({"year": 2023, "race": values[0][riderIndex].replace("'", "&#39;").replace(",", "comma"), "rider": rider.replace("'", "&#39;"), "raceDate": datetime.date.today().strftime("%Y" + "-" + "%m" + "-" + "%d")})

        """for row in values:
            if not row[1] == "Rytter":
                if not row[1].replace("'", "&#39;") in alltimeRankingFullNames:
                    nameArr = row[1].split(" ")
                    firstName = nameArr[0]
                    lastName = " ".join(nameArr[1:])

                    if row[3] in nationFlagCodes:
                        flagCode = nationFlagCodes[row[3]]
                    else:
                        flagCode = row[3][:2].lower()
                    
                    insertData = supabase.table("alltimeRanking").insert({"fullName": row[1].replace("'", "&#39;"), "lastName": lastName, "firstName": firstName, "nation": row[3], "nationFlagCode": flagCode, "birthYear": row[4], "points": row[2], "active": True}).execute()
                else:
                    if str(alltimeRankingDict[row[1].replace("'", "&#39;")]) != str(row[2]):
                        updateData = supabase.table("alltimeRanking").update({"points": row[2]}).eq("fullName", row[1].replace("'", "&#39;")).execute()
                if not row[1].replace("'", "&#39;") in rankingPerYearFullNames:
                    insertData = supabase.table("alltimeRankingPerYear").insert({"rider": row[1].replace("'", "&#39;"), "2023Points": row[2], "2023Rank": row[0]}).execute()
                    print({"rider": row[1].replace("'", "&#39;"), "2023Points": row[2], "2023Rank": row[0]})
                else:
                    if str(rankingPerYearDict[row[1].replace("'", "&#39;")]) != str(row[2]) or str(rankingPerYearRankDict[row[1].replace("'", "&#39;")]) != str(row[0]):
                        updateData = supabase.table("alltimeRankingPerYear").update({"2023Points": row[2], "2023Rank": row[0]}).eq("rider", row[1].replace("'", "&#39;")).execute()"""


    except HttpError as err:
        print(err)

if __name__ == '__main__':
    main()