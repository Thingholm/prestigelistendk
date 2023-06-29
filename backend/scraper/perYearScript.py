"""for index, x in enumerate(alltimeRanking):
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

    nM = "Colombiansk mesterEcuadoriansk mester (>2020)Australsk mester (1984-1994 + 1996 + >1997)Tysk mester (<1942 + 1947-1956 + 1959-1975 + >1978)Dansk mester (1968 + 1970-1973 + 1981-1985 + >1986)Norsk mester (1990 + >2007)Amerikansk mester (>1998)Portugisisk mester (1975-1979 + 1984 + 2010-2016 + >2019)Schweizisk mester (1904 + 1912-1970 + >1975)Slovensk mester (>2003)Tjekkisk mester (2001-2005 + >2012)Østrigsk mester (1988-1989 + 2006 + 2008 >2017)Britisk mester (1965-1967 + 1970-1976 + 1987-1998 + 2000 + 2002 + >2003)Canadisk mester (2012-2013)Irsk mester (2010-2013 + 2017-2021)Belarusisk mester (2009-2016)Kasakhisk mester (1998-2012)Litauisk mester (2012-2016)Russisk mester (<2022)Svensk mester (1980-1985 + 1999-2003 + 2007-2009 + 2012-2013)Polsk mester (1995-1997 + 1999-2004 + 2012-2022)Ukrainsk mester (1996-2009)Luxembourgsk mester (1936-1940 + 1948 + 1950-1961 + 2005-2010 + 2016)Fransk mesterSpansk mesterBelgisk mesterNederlandsk mesterItaliensk mesterSpansk mester i enkeltstartFransk mester i enkeltstartBelgisk mester i enkeltstartItaliensk mester i enkeltstartNederlandsk mester i enkeltstartColombiansk mester i enkeltstartEcuadoriansk mester i enkeltstart (>2020)Norsk mester i enkeltstart (1990 + >2007)Australsk mester i enkeltstartSchweizisk mester i enkeltstartTjekkisk mester i enkeltstart (2001-2005 + >2012)Tysk mester i enkeltstartDansk mester i enkeltstart (<1974 + 1981-1985 + >1986)Slovensk mester i enkeltstart (>2003)Portugisisk mester i enkeltstart (1975 + 2010-2016 + >2019)Østrigsk mester i enkeltstart (2006 + 2008 + >2017)Amerikansk mester i enkeltstart (1984-1996 + >1998)Britisk mester i enkeltstart (<1999 + 2000 + 2002 + >2003)Litauisk mester i enkeltstart (2012-2016)Polsk mester i enkeltstart (1996-1997 + 1999-2004 + 2012-2022)Russisk mester i enkeltstart (<2022)Ukrainsk mester i enkeltstart (<2010)Belarusisk mester i enkeltstart (2009-2016)Luxembourgsk mester i enkeltstart (1951 + 2005-2010 + 2016)Canadisk mester i enkeltstart (2012-2013)Irsk mester i enkeltstart (2010-2013 + 2017-2021)Kasakhisk mester i enkeltstart (<2013)Svensk mester i enkeltstart (1980-1985 + 1999-2003 + 2007-2009 + 2012-2013)"

    nationSwaps = {
        "Andrei Tchmil": {
            1994: "Moldova",
            1997: "Ukraine",
            2023: "Belgien"
        },
        "Pavel Sivakov": {
            2022: "Rusland",
            2023: "Frankrig"
        },
        "Steffen Wesemann": {
            2005: "Tyskland",
            2023: "Schweiz"
        },
        "Jan Svorada": {
            1994: "Slovakiet",
            2023: "Tjekkiet"
        },
        "Maximilian Sciandri": {
            1994: "Italien",
            2023: "Storbritannien"
        },
        "Pierre Polo": {
            1957: "Italien",
            2023: "Frankrig"
        },
        "Pino Cerami": {
            1956: "Italien",
            2023: "Belgien"
        },
        "Pierre Brambilla": {
            1949: "Italien",
            2023: "Frankrig"
        },
        "Fermo Camellini": {
            1948: "Italien",
            2023: "Frankring"
        },
        "Adolphe Deledda": {
            1948: "Italien",
            2023: "Frankring"
        },
        "Maurice Garin": {
            1901: "Italien",
            2023: "Frankrig"
        },
        "Olaf Ludwig": {
            1990: "Østtyskland",
            2023: "Tyskland"
        },
        "Uwe Raab": {
            1990: "Østtyskland",
            2023: "Tyskland"
        },
        "Uwe Ampler": {
            1990: "Østtyskland",
            2023: "Tyskland"
        },
        "Djamolidine Abduzhaparov": {
            1991: "Sovjetunionen",
            2023: "Usbekistan"
        },
        "Viatcheslav Ekimov": {
            1991: "Sovjetunionen",
            2023: "Rusland"
        },
        "Dmitri Konychev": {
            1991: "Sovjetunionen",
            2023: "Rusland"
        },
        "Asiat Saitov": {
            1991: "Sovjetunionen",
            2023: "Rusland"
        },
        "Vladimir Pulnikov": {
            1991: "Sovjetunionen",
            2023: "Ukraine"
        },
    }

    for year in range(1876, 2023):
        resultsCurYear = supabase.table("results").select("*").eq("year", year).order("rider").execute()
        resultsCurYearRaceList = []
        resultsCurYearDict = {}
        for index, x in enumerate(resultsCurYear):
            if index == 0:
                for y in x[1]:
                    resultsCurYearRaceList.append(y["race"])
                    resultsCurYearDict[y["race"]] = y["raceDate"]

        newResList = []
        for x in json.loads(resultsCurYear.json())["data"]:
            if x["rider"] in alltimeRankingFullNames:
                x["nation"] = riderDict[x["rider"]]["nation"]
                if x["rider"] in nationSwaps:
                    for nY in nationSwaps[x["rider"]]:
                        if nY >= year:
                            x["nation"] = nationSwaps[x["rider"]][nY]
                            break
                race = x["race"]
                if "etape" in race:
                    race = race.split(". ")[1]
                x["points"] = pointSystem[race]

                if not race in nM:
                    newResList.append(x)
        sortedList = sorted(newResList, key=lambda x: x["nation"])

        for k, g in itertools.groupby(sortedList, lambda x: x["nation"]):
            points = sum(x["points"] for x in list(g))
            print(k, points)
            updateData = supabase.table("nationsRankByYear").update({str(year) + "Points": points}).eq("nation", k).execute()"""