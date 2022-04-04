import React from "react";

const Table = (props) => {

  // sayıların virgülden sonraki kısımlarını düzenleyen fonksiyon
  const roundNumber = (number) => {
    return Math.round(number * 100) / 100;
  };

  return (
    <div>
      <table
        style={{
          border: "solid 1px red",
          marginLeft: "auto",
          marginRight: "auto",
          fontSize: "20px",
          background: "#AEE03F",
        }}
      >
        <tr style={{ background: "green"}}>
          <th>Tarih</th>
          <th>Toplam İşlem Miktarı (MWh)</th>
          <th>Toplam İşlem Tutarı (TL)</th>
          <th>Ağırlık Ortalama Fiyat (TL/MWh)</th>
        </tr>
        {Object.keys(props.data).map((key, index) => {
          // sözlüğün map ile dönülüp değerlerin tabloya yerleştirilmesi
          return (
            <tr key={index}>
              <td>{key}</td>
              <td>{roundNumber(props.data[key][0])}</td>
              <td>{roundNumber(props.data[key][1])}</td>
              <td>{roundNumber(props.data[key][2])}</td>
            </tr>
          );
        })}
      </table>
    </div>
  );
};

export default Table;
