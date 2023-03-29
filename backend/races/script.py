import csv

txtFile = open("races/sql.txt","w", encoding='utf8')

txtFile.write('INSERT INTO "results" ("year","race","rider") VALUES \n')

with open("races/results.CSV", encoding='utf8') as file:
    reader = csv.reader(file)

    count = 0

    for row in reader:
        if count == 0:
            raceList = row[0].split(";")
        else:
            for index, race in enumerate(raceList):
                if row[0].split(";")[index] and len(race) > 1:
                    txtFile.write("(" + row[0].split(";")[0] + "," + "'" + race.replace("'", "&#39;") + "'" + "," + "'" + row[0].split(";")[index].replace("'", "&#39;") + "'), \n")
        
        count += 1

file.close