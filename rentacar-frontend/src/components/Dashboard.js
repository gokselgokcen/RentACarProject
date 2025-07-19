// src/components/Dashboard.js
import React from "react";
import CarList from "./CarList";
import RentForm from "./RentForm";
import ReturnForm from "./ReturnForm";

const Dashboard = ({ onLogout }) => {
  const [refreshKey, setRefreshKey] = React.useState(0);
  const triggerRefresh = () => setRefreshKey((p) => p + 1);

  return (
    <div className="min-vh-100 p-4">
      {/* Header Section */}
      <div className="modern-card mb-4 fade-in">
        <div className="d-flex justify-content-between align-items-center p-4">
          <div className="d-flex align-items-center">
            <div className="me-3">
              <div className="d-inline-block p-3 rounded-circle" style={{ 
                background: 'linear-gradient(135deg, var(--primary-color), var(--primary-dark))',
                boxShadow: 'var(--shadow-md)'
              }}>
                <span style={{ fontSize: '2rem' }}>🚗</span>
              </div>
            </div>
            <div>
              <h1 className="text-gradient fw-bold mb-1">Rent a Car Sistemi</h1>
              <p className="text-muted mb-0">Araç kiralama ve yönetim paneli</p>
            </div>
          </div>
          <button 
            className="btn-modern btn-outline" 
            onClick={onLogout}
          >
            <i className="fas fa-sign-out-alt me-2">🚪</i>
            Çıkış Yap
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="row g-4">
        {/* Car List Section */}
        <div className="col-12">
          <div className="modern-card hover-lift scale-in">
            <div className="p-4">
              <div className="d-flex align-items-center mb-3">
                <div className="me-3">
                  <div className="d-inline-block p-2 rounded-circle" style={{ 
                    background: 'linear-gradient(135deg, var(--accent-color), #059669)',
                    boxShadow: 'var(--shadow-sm)'
                  }}>
                    <span style={{ fontSize: '1.2rem' }}>📋</span>
                  </div>
                </div>
                <h3 className="fw-bold mb-0">Araç Listesi</h3>
              </div>
              <CarList refreshSignal={refreshKey} />
            </div>
          </div>
        </div>

        {/* Forms Section */}
        <div className="col-lg-6">
          <div className="modern-card hover-lift scale-in">
            <div className="p-4">
              <div className="d-flex align-items-center mb-3">
                <div className="me-3">
                  <div className="d-inline-block p-2 rounded-circle" style={{ 
                    background: 'linear-gradient(135deg, #3b82f6, #1d4ed8)',
                    boxShadow: 'var(--shadow-sm)'
                  }}>
                    <span style={{ fontSize: '1.2rem' }}>🔑</span>
                  </div>
                </div>
                <h3 className="fw-bold mb-0">Araç Kirala</h3>
              </div>
              <RentForm refreshSignal={refreshKey} onSuccess={triggerRefresh} />
            </div>
          </div>
        </div>

        <div className="col-lg-6">
          <div className="modern-card hover-lift scale-in">
            <div className="p-4">
              <div className="d-flex align-items-center mb-3">
                <div className="me-3">
                  <div className="d-inline-block p-2 rounded-circle" style={{ 
                    background: 'linear-gradient(135deg, var(--warning-color), #d97706)',
                    boxShadow: 'var(--shadow-sm)'
                  }}>
                    <span style={{ fontSize: '1.2rem' }}>🔄</span>
                  </div>
                </div>
                <h3 className="fw-bold mb-0">Araç İade Et</h3>
              </div>
              <ReturnForm
                refreshSignal={refreshKey}
                onSuccess={triggerRefresh}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="text-center mt-5 pt-4">
        <div className="glass-card p-3">
          <p className="text-muted mb-0">
            <i className="fas fa-heart me-1" style={{ color: '#ef4444' }}>❤️</i>
            Modern araç kiralama sistemi - Güvenli ve hızlı
          </p>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
