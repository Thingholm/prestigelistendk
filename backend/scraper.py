from bs4 import BeautifulSoup
import csv
import requests

html = requests.get('https://docs.google.com/spreadsheets/d/14JS3ioc3jaFTDX2wuHRniE3g3S2yyg1QkfJ7FiNgAE8/edit#gid=1878861879').text
soup = BeautifulSoup(html, "lxml")

tables = soup.find_all("table")

print(tables)