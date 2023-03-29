import csv

txtFile = open("riders/sql.txt","w")

txtFile.write('INSERT INTO "alltimeRanking" ("firstName","lastName","nation","birthYear",points,"active", "currentTeam", "fullName") VALUES')

activeRiders = []

with open("riders/prestigelisten.CSV") as file:
    reader = csv.reader(file)

    with open("riders/active.CSV") as activeFile:
        activeReader = csv.reader(activeFile)
        for aRow in activeReader:
            activeRiders.append([aRow[0].split(";")[2], aRow[0].split(";")[5]])

        for row in reader:
            activeCheck = False
            currentTeam = "Null"
            currentRider = row[0]

            if str(row[0].split(";")[1]) in str(activeRiders):
                activeCheck = True
                for activeRider in activeRiders:
                    if str(row[0].split(";")[1]) in str(activeRider):
                        currentTeam = "'" + activeRider[1] + "'"

            if row[0].split(";")[4] == "-":
                txtFile.write("(" + str("'" + row[0].split(";")[1].split(" ")[0] + "'" + "," + "'" + " ".join(row[0].split(";")[1].split(" ")[1:]).replace("'","&#39;") + "'" + "," + "'" + row[0].split(";")[3] + "'" + "," + "Null" + "," + row[0].split(";")[2] + "," + str(activeCheck) + "," +  currentTeam + "," + "'" + row[0].split(";")[1].replace("'","&#39;") + "'") + "), \n")
            else:
                txtFile.write("(" + str("'" + row[0].split(";")[1].split(" ")[0] + "'" + "," + "'" + " ".join(row[0].split(";")[1].split(" ")[1:]).replace("'","&#39;") + "'" + "," + "'" + row[0].split(";")[3] + "'" + "," + row[0].split(";")[4] + "," + row[0].split(";")[2] + "," + str(activeCheck) + "," + currentTeam+ "," + "'" + row[0].split(";")[1].replace("'","&#39;") + "'") + "), \n")

file.close()