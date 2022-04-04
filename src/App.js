import "./App.css";
import Table from "./Table";
import { useState, useEffect } from "react";
import axios from "axios";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

function App() {
  const startD = new Date("2022-01-26");
  const endD = new Date("2022-01-26");

  const [data, setData] = useState([]); // all data
  const [startDateValue, setStartDateValue] = useState(startD);
  const [endDateValue, setEndDateValue] = useState(endD);

  const startDText =
    startDateValue.getFullYear() +
    "-" +
    (startDateValue.getMonth() + 1) +
    "-" +
    startDateValue.getDate();
  const endDText =
    endDateValue.getFullYear() +
    "-" +
    (endDateValue.getMonth() + 1) +
    "-" +
    endDateValue.getDate();

  // Get request
  useEffect(() => {
    axios
      .get(
        `https://seffaflik.epias.com.tr/transparency/service/market/intra-day-trade-history?endDate=${endDText}&startDate=${startDText}`
      )
      .then((res) => setData(res.data.body.intraDayTradeHistoryList))
      .catch((error) => console.log(error));
  });

  // filtered data (PH-PB)
  const filteredData = data.filter(
    (data) => data.conract.substring(0, 2) === "PH"
  );

  // tabloda listelenecek olan tarihi key, bilgileri ise value olarak tutan dictionary
  const PH_VALUES = {};

  for (let i = 0; i < filteredData.length; i++) {
    var toplamIslemMiktari = filteredData[i].quantity / 10;
    var toplamIslemTutari = filteredData[i].price * toplamIslemMiktari;
    var agirlikliOrtFiyat = toplamIslemTutari / toplamIslemMiktari;

    // çekilen verideki "date" değerini kullanarak yeni bir date değişkeni oluşturup bu date'in formatını değiştirme
    const date = new Date(filteredData[i].date);
    const fDate =
      date.getDate() +
      "." +
      (date.getMonth() + 1) +
      "." +
      date.getFullYear() +
      " " +
      date.getHours() +
      ":00";

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
      // eğer bu date sözlükte key olarak bulunuyorsa value'leri arttır
      PH_VALUES[fDate][0] += toplamIslemMiktari;
      PH_VALUES[fDate][1] += toplamIslemTutari;
      PH_VALUES[fDate][2] += agirlikliOrtFiyat;
    } else {
      PH_VALUES[fDate] = [
        // bulunmuyorsa yeni bir key-value oluştur.
        toplamIslemMiktari,
        toplamIslemTutari,
        agirlikliOrtFiyat,
      ];
    }
  }

  return (
    <div className="App">
      <h1 style={{color: "#4D5858"}}>smart<span style={{color:"#AEE03F",}}>Pulse</span> - Coding Task</h1>

      <h3 style={{ border: "1px solid black", marginBottom: "20px" }}>
        Tarihleri parse ederken direkt gelen data içerisindeki "date"
        özelliğinden yararlandım. Çünkü PH22012722 isimli bir conract kurallara
        göre 27 Ocak tarihli olması gerekirken date özelliği 26 Ocak olarak
        gözükmekte. Gönderilen pdf dosyasındaki örnekte taşma olmadan tam bir
        günün verileri olduğu için bu yolu izledim. Diğer date parse yöntemimi
        ise yorum satırlarıyla kodda bulabilirsiniz.
      </h3>

      <div className="temp">
        <h4>Start Date:</h4>
        <DatePicker
          selected={startDateValue}
          onChange={(date) => setStartDateValue(date)}
          dateFormat="yyyy/MM/dd"
        />

        <h4>End Date:</h4>
        <DatePicker
          selected={endDateValue}
          onChange={(date) => setEndDateValue(date)}
          dateFormat="yyyy/MM/dd"
        />
      </div>

      <h3>Veri sayısı çok fazla olduğundan 2-3 günden uzun aralıklar seçmemeniz tavsiye edilir.</h3>

      {/* Table componentini ayrı dosyada oluşturup props yardımıyla sözlüğü componente ilettim. */}
      <Table data={PH_VALUES} />

      {/*       {filteredData.map((data) => {
        // PH ile başlayan tüm veriler. İncelemek, üzerinde düşünmek için bastırıldı. İsteğe göre yorum satırına alınabilir.
        return (
          <div key={data.id} style={{ border: "1px solid grey" }}>
            <h2>Conract = {data.conract}</h2>
            <h2>price = {data.price}</h2>
            <h2>quantity = {data.quantity}</h2>
            <h2>date = {data.date}</h2>
          </div>
        );
      })} */}
    </div>
  );
}

export default App;
