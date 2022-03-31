import './App.css';
import { useState, useEffect } from "react";
import axios from "axios";

function App() {

  const [conracts, setConracts] = useState([]);

  useEffect(() => {
    axios
      .get("https://seffaflik.epias.com.tr/transparency/service/market/intra-day-trade-history?endDate=2022-01-26&startDate=2022-01-26")
      .then((res) => setConracts(res.data.body.intraDayTradeHistoryList))
      .catch((error) => console.log(error));
  });

  

  return (
    <div className="App">
      smartPulse - Coding Task
      <p>Conract Sayısı = {conracts.length}</p>
      <div>
        {conracts.map((conract) => {
          return (
            <div key={conract.id}>
              <h2>Conract ID: {conract.id}</h2>
              <h2>Conract Date: {conract.date}</h2>
              <h2>Conract Name: {conract.conract}</h2>
              <h2>Price: {conract.price}</h2>
              <h2>Quantity: {conract.quantity}</h2>
              <h2>Conract Type: {conract.conract.substring(0,2)}</h2>
              <h2>----------------------------------------</h2>
            </div>
          )
        })}
      </div>
    </div>
  );
}

export default App;
