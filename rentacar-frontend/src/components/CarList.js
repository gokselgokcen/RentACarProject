// src/components/CarList.js
import React, { useEffect, useState } from "react";
import axios from "axios";

const CarList = ({ refreshSignal }) => {
  const [cars, setCars] = useState([]);

  useEffect(() => {
    const fetchCars = async () => {
      try {
        const res = await axios.get("http://localhost:5087/api/car");
        setCars(res.data);
      } catch (err) {
        console.error("Araçlar alınamadı:", err);
      }
    };
    fetchCars();
  }, [refreshSignal]);

  return (
    <div>
      <h2 className="text-center mb-3">Mevcut Araçlar</h2>
      <table className="table table-striped table-hover">
        <thead>
          <tr>
            <th>#</th>
            <th>Marka</th>
            <th>Model</th>
            <th>Günlük Fiyat (₺)</th>
            <th>Durum</th>
          </tr>
        </thead>
        <tbody>
          {cars.map((car, idx) => (
            <tr key={car.id}>
              <td>{idx + 1}</td>
              <td>{car.brand}</td>
              <td>{car.model}</td>
              <td>{car.pricePerDay.toFixed(2)}</td>
              <td>
                <span className={`badge ${car.isAvailable ? "bg-success" : "bg-danger"}`}>
                  {car.isAvailable ? "Uygun" : "Kirada"}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default CarList;
