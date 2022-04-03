from datetime import datetime
from tabulate import tabulate
import requests

url = 'https://seffaflik.epias.com.tr/transparency/service/market/intra-day-trade-history?endDate=2022-01-26&startDate=2022-01-26'
res = requests.get(url)
datas = res.json()["body"]["intraDayTradeHistoryList"]

PHList = []  # data list that conract value is starting with "PH"
for data in datas:
    if data["conract"][:2] == "PH":
        PHList.append(data)

PH_VALUES = {}
for data in PHList:
    toplamIslemMiktari: float = data["quantity"] / 10
    toplamIslemTutari: float = data["price"] * toplamIslemMiktari
    agirlikliOrtFiyat = toplamIslemTutari / toplamIslemMiktari

    if data["conract"] not in PH_VALUES:
        PH_VALUES[data["conract"]] = [toplamIslemMiktari, toplamIslemTutari, agirlikliOrtFiyat]
    else:
        PH_VALUES[data["conract"]][0] += toplamIslemMiktari
        PH_VALUES[data["conract"]][1] += toplamIslemTutari
        PH_VALUES[data["conract"]][2] += agirlikliOrtFiyat

"""
now = datetime.now()
time_string = now.strftime("%d.%m.%Y %H:00")
print(time_string)"""

headers = ["Tarih", "Toplam İşlem Miktarı", "Toplam İşlem Tutarı", "Ağırlık Ortalama Fiyat"]
table = [headers]

for key, value in PH_VALUES.items():
    temp = [key, str(value[0])[:6], str(value[1])[:6], str(value[2])[:6]]
    table.append(temp)

print(tabulate(table, headers='firstrow'))