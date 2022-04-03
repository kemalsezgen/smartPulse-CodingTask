import "./App.css";
import { useState, useEffect } from "react";
import axios from "axios";

function App() {
  const [data, setData] = useState([]); // all data

  // Get request
  useEffect(() => {
    axios
      .get(
        "https://seffaflik.epias.com.tr/transparency/service/market/intra-day-trade-history?endDate=2022-01-26&startDate=2022-01-26"
      )
      .then((res) => setData(res.data.body.intraDayTradeHistoryList))
      .catch((error) => console.log(error));
  });

  // filtered data (PH-PB)
  const filteredData = data.filter(
    (data) => data.conract.substring(0, 2) === "PH"
  );

  const roundNumber = (number) => {
    return Math.round(number * 100) / 100;
  }

  const PH_VALUES = {};

  for (let i = 0; i < filteredData.length; i++) {
    var toplamIslemMiktari = roundNumber(filteredData[i].quantity / 10);
    var toplamIslemTutari = roundNumber(filteredData[i].price * toplamIslemMiktari);
    var agirlikliOrtFiyat = roundNumber(toplamIslemTutari / toplamIslemMiktari);

    const date = new Date(filteredData[i].date);
    const fDate = date.getDate() + "." + (date.getMonth()+1) + "." + date.getFullYear() + " " + date.getHours() + ":00"  

/*     var tarih =
      filteredData[i].conract.substring(6, 8) +
      "." +
      filteredData[i].conract.substring(4, 6) +
      "." +
      "20" +
      filteredData[i].conract.substring(2, 4) +
      " " +
      filteredData[i].conract.substring(8, 10) +
      ":00"; */

    if (fDate in PH_VALUES) {
      PH_VALUES[fDate][0] += toplamIslemMiktari;
      PH_VALUES[fDate][1] += toplamIslemTutari;
      PH_VALUES[fDate][2] += agirlikliOrtFiyat;
    } else {
      PH_VALUES[fDate] = [
        toplamIslemMiktari,
        toplamIslemTutari,
        agirlikliOrtFiyat,
        "dasdsa"
      ];
    }
  }

  return (
    <div className="App">
      <h2>smartPulse - Coding Task</h2>
      <p>Number of Data = {filteredData.length}</p>

      <h3>Tarihleri parse ederken direkt gelen data içerisindeki "date" özelliğinden yararlandım.
      Çünkü PH22012722 isimli bir conract kurallara göre 27 Ocak tarihli olması gerekirken
      date özelliği 26 Ocak olarak gözükmekte. Gönderilen pdf dosyasındaki örnekte taşma olmadan
      tam bir günün verileri olduğu için bu yolu izledim. Diğer date parse yöntemimi ise yorum satırlarıyla kodda bulabilirsiniz.</h3>

      <table style={{border:"solid 1px red", marginLeft:"auto", marginRight:"auto", fontSize:"20px"}}>
        <tr>
          <th>Tarih</th>
          <th>Toplam İşlem Miktarı (MWh)</th>
          <th>Toplam İşlem Tutarı (TL)</th>
          <th>Ağırlık Ortalama Fiyat (TL/MWh)</th>
        </tr>
        {Object.keys(PH_VALUES).map((key, index) => {
          return (
            <tr key={index}>
              <td>{key}</td>
              <td>{PH_VALUES[key][0]}</td>
              <td>{PH_VALUES[key][1]}</td>
              <td>{PH_VALUES[key][2]}</td>
            </tr>
          );
        })}
      </table>
      {filteredData.map(data => {
          return (
            <div key={data.id} style={{border: "1px solid grey"}}>
              <h2>Conract = {data.conract}</h2>
              <h2>price = {data.price}</h2>
              <h2>quantity = {data.quantity}</h2>
              <h2>date = {data.date}</h2>
            </div>
          )
        })}
    </div>
  );
}

export default App;
