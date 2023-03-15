import gspread as gs
import pandas as pd

gc = gs.service_account(filename='service_account.json')
sh = gc.open_by_url('https://docs.google.com/spreadsheets/d/1wjAQxWnnvU-nNexoT7oUtMqDl2eIM7ogUth4QgbAaPQ/edit#gid=1348170666')

ws = sh.worksheet('Resultater')
df = pd.DataFrame(ws.get_all_records())
df.head()