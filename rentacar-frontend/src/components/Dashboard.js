// src/components/Dashboard.js
import React from "react";
import CarList from "./CarList";
import RentForm from "./RentForm";
import ReturnForm from "./ReturnForm";

const Dashboard = ({ onLogout }) => {
  const [refreshKey, setRefreshKey] = React.useState(0);
  const triggerRefresh = () => setRefreshKey((p) => p + 1);

  return (
    <div className="container my-5">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h1 className="text-primary">🚗 Rent a Car Sistemi</h1>
        <button className="btn btn-outline-secondary" onClick={onLogout}>
          Çıkış Yap
        </button>
      </div>
      <div className="row g-4">
        <div className="col-12">
          <div className="card shadow-sm p-3 mb-4">
            <CarList refreshSignal={refreshKey} />
          </div>
        </div>
        <div className="col-md-6">
          <div className="card shadow-sm p-3">
            <RentForm refreshSignal={refreshKey} onSuccess={triggerRefresh} />
          </div>
        </div>
        <div className="col-md-6">
          <div className="card shadow-sm p-3">
            <ReturnForm
              refreshSignal={refreshKey}
              onSuccess={triggerRefresh}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
