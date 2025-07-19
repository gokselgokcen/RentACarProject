import React, { useState, useEffect } from "react";
import axios from "axios";

const AdminPanel = ({ onLogout }) => {
  const [carRefreshKey, setCarRefreshKey] = useState(0);
  const triggerCarRefresh = () => setCarRefreshKey((p) => p + 1);

  const [rentals, setRentals] = useState([]);
  const [rentalRefreshKey, setRentalRefreshKey] = useState(0);
  const triggerRentalRefresh = () => setRentalRefreshKey((p) => p + 1);

  // Aktif kiralamalar için yeni state
  const [activeRentals, setActiveRentals] = useState([]);
  const [isLoadingActiveRentals, setIsLoadingActiveRentals] = useState(true);

  const [brand, setBrand] = useState("");
  const [model, setModel] = useState("");
  const [pricePerDay, setPricePerDay] = useState("");
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const [editingCarId, setEditingCarId] = useState(null);
  const [editBrand, setEditBrand] = useState("");
  const [editModel, setEditModel] = useState("");
  const [editPrice, setEditPrice] = useState("");

  const [cars, setCars] = useState([]);
  const [isLoadingCars, setIsLoadingCars] = useState(true);
  const [isLoadingRentals, setIsLoadingRentals] = useState(true);

  useEffect(() => {
    setIsLoadingCars(true);
    axios.get("http://localhost:5087/api/car")
      .then(res => setCars(res.data))
      .catch(err => console.error("Araçlar alınamadı:", err))
      .finally(() => setIsLoadingCars(false));
  }, [carRefreshKey]);

  useEffect(() => {
    setIsLoadingRentals(true);
    axios.get("http://localhost:5087/api/rental")
      .then(res => setRentals(res.data))
      .catch(err => console.error("Kiralama verisi alınamadı:", err))
      .finally(() => setIsLoadingRentals(false));
  }, [rentalRefreshKey]);

  // Aktif kiralamaları çek
  useEffect(() => {
    setIsLoadingActiveRentals(true);
    const token = localStorage.getItem("token");
    
    // Admin için tüm kiralamaları çek, sonra aktif olanları filtrele
    axios.get("http://localhost:5087/api/rental", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
    .then(res => {
      // Aktif kiralamaları filtrele (Car.IsAvailable == false olanlar)
      const activeRentals = res.data.filter(rental => !rental.car.isAvailable);
      setActiveRentals(activeRentals);
    })
    .catch(err => {
      console.error("Aktif kiralama verisi alınamadı:", err);
    })
    .finally(() => setIsLoadingActiveRentals(false));
  }, [rentalRefreshKey]);

  const handleAddCar = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage("");
    
    try {
      await axios.post("http://localhost:5087/api/car", {
        brand,
        model,
        pricePerDay: parseFloat(pricePerDay),
        isAvailable: true,
      });
      setMessage("🎉 Yeni araç başarıyla eklendi!");
      setBrand(""); setModel(""); setPricePerDay("");
      triggerCarRefresh();
    } catch (err) {
      setMessage("❌ Araç eklenemedi: " + (err.response?.data || err.message));
    } finally {
      setIsLoading(false);
    }
  };

  const startEditing = (car) => {
    setEditingCarId(car.id);
    setEditBrand(car.brand);
    setEditModel(car.model);
    setEditPrice(car.pricePerDay);
  };

  const cancelEditing = () => {
    setEditingCarId(null);
  };

  const saveEdit = async (id) => {
    setIsLoading(true);
    try {
      const original = cars.find(c => c.id === id);
      await axios.put(`http://localhost:5087/api/car/${id}`, {
        id,
        brand: editBrand,
        model: editModel,
        pricePerDay: parseFloat(editPrice),
        isAvailable: original.isAvailable,
      });
      setMessage("🎉 Araç bilgisi başarıyla güncellendi!");
      setEditingCarId(null);
      triggerCarRefresh();
    } catch (err) {
      setMessage("❌ Güncelleme başarısız: " + (err.response?.data || err.message));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-vh-100 p-4">
      {/* Header Section */}
      <div className="modern-card mb-4 fade-in">
        <div className="d-flex justify-content-between align-items-center p-4">
          <div className="d-flex align-items-center">
            <div className="me-3">
              <div className="d-inline-block p-3 rounded-circle" style={{ 
                background: 'linear-gradient(135deg, var(--danger-color), #dc2626)',
                boxShadow: 'var(--shadow-md)'
              }}>
                <span style={{ fontSize: '2rem' }}>🛠️</span>
              </div>
            </div>
            <div>
              <h1 className="text-gradient fw-bold mb-1">Admin Panel</h1>
              <p className="text-muted mb-0">Sistem yönetimi ve araç kontrolü</p>
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

      {/* Message Display */}
      {message && (
        <div className={`alert-modern ${message.startsWith("🎉") ? 'alert-success' : 'alert-danger'} slide-in mb-4`}>
          <div className="d-flex align-items-center">
            <i className={`fas ${message.startsWith("🎉") ? 'fa-check-circle' : 'fa-exclamation-triangle'} me-2`}>
              {message.startsWith("🎉") ? '✅' : '⚠️'}
            </i>
            {message}
          </div>
        </div>
      )}

      {/* Main Content */}
      <div className="row g-4">
        {/* Car Management Section */}
        <div className="col-12">
          <div className="modern-card hover-lift scale-in">
            <div className="p-4">
              <div className="d-flex align-items-center mb-4">
                <div className="me-3">
                  <div className="d-inline-block p-2 rounded-circle" style={{ 
                    background: 'linear-gradient(135deg, var(--primary-color), var(--primary-dark))',
                    boxShadow: 'var(--shadow-sm)'
                  }}>
                    <span style={{ fontSize: '1.2rem' }}>🚗</span>
                  </div>
                </div>
                <h3 className="fw-bold mb-0">Araç Yönetimi</h3>
              </div>
              
              {isLoadingCars ? (
                <div className="text-center py-5">
                  <div className="loading-spinner mx-auto mb-3"></div>
                  <p className="text-muted">Araçlar yükleniyor...</p>
                </div>
              ) : (
                <div className="table-responsive">
                  <table className="table table-modern">
                    <thead>
                      <tr>
                        <th style={{ width: '60px' }}>#</th>
                        <th>Marka</th>
                        <th>Model</th>
                        <th>Günlük Fiyat</th>
                        <th>Durum</th>
                        <th style={{ width: '120px' }}>İşlem</th>
                      </tr>
                    </thead>
                    <tbody>
                      {cars.map((car, i) => (
                        <tr key={car.id} className="hover-lift">
                          <td className="fw-bold text-muted">{i + 1}</td>
                          {editingCarId === car.id ? (
                            <>
                              <td>
                                <input 
                                  className="form-control-modern" 
                                  value={editBrand} 
                                  onChange={e => setEditBrand(e.target.value)} 
                                />
                              </td>
                              <td>
                                <input 
                                  className="form-control-modern" 
                                  value={editModel} 
                                  onChange={e => setEditModel(e.target.value)} 
                                />
                              </td>
                              <td>
                                <input 
                                  type="number" 
                                  className="form-control-modern" 
                                  value={editPrice} 
                                  onChange={e => setEditPrice(e.target.value)} 
                                />
                              </td>
                              <td>
                                <span className={`badge-modern ${car.isAvailable ? 'badge-success' : 'badge-danger'}`}>
                                  {car.isAvailable ? '✅ Uygun' : '❌ Kirada'}
                                </span>
                              </td>
                              <td>
                                <div className="d-flex gap-2">
                                  <button 
                                    className="btn-modern btn-success btn-sm" 
                                    onClick={() => saveEdit(car.id)}
                                    disabled={isLoading}
                                  >
                                    <i className="fas fa-save">💾</i>
                                  </button>
                                  <button 
                                    className="btn-modern btn-outline btn-sm" 
                                    onClick={cancelEditing}
                                    disabled={isLoading}
                                  >
                                    <i className="fas fa-times">❌</i>
                                  </button>
                                </div>
                              </td>
                            </>
                          ) : (
                            <>
                              <td className="fw-semibold">{car.brand}</td>
                              <td className="text-muted">{car.model}</td>
                              <td className="fw-bold text-success">₺{car.pricePerDay.toFixed(2)}</td>
                              <td>
                                <span className={`badge-modern ${car.isAvailable ? 'badge-success' : 'badge-danger'}`}>
                                  {car.isAvailable ? '✅ Uygun' : '❌ Kirada'}
                                </span>
                              </td>
                              <td>
                                <button 
                                  className="btn-modern btn-outline btn-sm" 
                                  onClick={() => startEditing(car)}
                                  disabled={isLoading}
                                >
                                  <i className="fas fa-edit me-1">✏️</i>
                                  Düzenle
                                </button>
                              </td>
                            </>
                          )}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Aktif Kiralamalar Section */}
        <div className="col-12">
          <div className="modern-card hover-lift scale-in">
            <div className="p-4">
              <div className="d-flex align-items-center mb-4">
                <div className="me-3">
                  <div className="d-inline-block p-2 rounded-circle" style={{ 
                    background: 'linear-gradient(135deg, #3b82f6, #1d4ed8)',
                    boxShadow: 'var(--shadow-sm)'
                  }}>
                    <span style={{ fontSize: '1.2rem' }}>🔑</span>
                  </div>
                </div>
                <h3 className="fw-bold mb-0">Aktif Kiralamalar</h3>
              </div>
              
              {isLoadingActiveRentals ? (
                <div className="text-center py-5">
                  <div className="loading-spinner mx-auto mb-3"></div>
                  <p className="text-muted">Aktif kiralamalar yükleniyor...</p>
                </div>
              ) : (
                <div className="table-responsive">
                  <table className="table table-modern">
                    <thead>
                      <tr>
                        <th style={{ width: '60px' }}>#</th>
                        <th>Kullanıcı</th>
                        <th>Araç</th>
                        <th>Kiralama Tarihi</th>
                        <th>Bitiş Tarihi</th>
                        <th>Kalan Gün</th>
                        <th>Toplam Ücret</th>
                        <th>Durum</th>
                      </tr>
                    </thead>
                    <tbody>
                      {activeRentals.length === 0 ? (
                        <tr>
                          <td colSpan="8" className="text-center py-5">
                            <div className="text-muted">
                              <i className="fas fa-key" style={{ fontSize: '3rem', opacity: 0.3 }}>🔑</i>
                              <p className="mt-3 mb-0">Şu anda aktif kiralama bulunmuyor</p>
                            </div>
                          </td>
                        </tr>
                      ) : (
                        activeRentals.map((rental, i) => {
                          const startDate = new Date(rental.startDate);
                          const endDate = new Date(rental.endDate);
                          const today = new Date();
                          const remainingDays = Math.ceil((endDate - today) / (1000 * 60 * 60 * 24));
                          const isOverdue = remainingDays < 0;
                          const isExpiringSoon = remainingDays <= 3 && remainingDays >= 0;
                          
                          return (
                            <tr key={rental.id} className="hover-lift">
                              <td className="fw-bold text-muted">{i + 1}</td>
                              <td className="fw-semibold">
                                <div className="d-flex align-items-center">
                                  <div className="me-2">
                                    <i className="fas fa-user-circle" style={{ fontSize: '1.2rem', color: 'var(--primary-color)' }}>👤</i>
                                  </div>
                                  <div>
                                    <div>{rental.user?.username || "Bilinmiyor"}</div>
                                    <small className="text-muted">ID: {rental.user?.id || "N/A"}</small>
                                  </div>
                                </div>
                              </td>
                              <td className="text-muted">
                                <div className="fw-semibold">{rental.car.brand} {rental.car.model}</div>
                                <small className="text-muted">Araç ID: {rental.car.id}</small>
                              </td>
                              <td>{startDate.toLocaleDateString('tr-TR')}</td>
                              <td>{endDate.toLocaleDateString('tr-TR')}</td>
                              <td>
                                <span className={`badge-modern ${
                                  isOverdue ? 'badge-danger' : 
                                  isExpiringSoon ? 'badge-warning' : 'badge-success'
                                }`}>
                                  {isOverdue ? (
                                    <>
                                      <i className="fas fa-exclamation-triangle me-1">⚠️</i>
                                      {Math.abs(remainingDays)} gün gecikmiş
                                    </>
                                  ) : (
                                    <>
                                      <i className="fas fa-clock me-1">⏰</i>
                                      {remainingDays} gün kaldı
                                    </>
                                  )}
                                </span>
                              </td>
                              <td className="fw-bold text-success">₺{rental.totalPrice.toFixed(2)}</td>
                              <td>
                                <span className={`badge-modern ${
                                  isOverdue ? 'badge-danger' : 
                                  isExpiringSoon ? 'badge-warning' : 'badge-success'
                                }`}>
                                  {isOverdue ? '❌ Gecikmiş' : 
                                   isExpiringSoon ? '⚠️ Yakında Bitecek' : '✅ Aktif'}
                                </span>
                              </td>
                            </tr>
                          );
                        })
                      )}
                    </tbody>
                  </table>
                </div>
              )}
              
              {activeRentals.length > 0 && (
                <div className="text-center mt-3">
                  <div className="glass-card d-inline-block px-3 py-2">
                    <small className="text-muted">
                      <i className="fas fa-info-circle me-1">ℹ️</i>
                      Toplam {activeRentals.length} aktif kiralama
                    </small>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Add New Car Section */}
        <div className="col-lg-6">
          <div className="modern-card hover-lift scale-in">
            <div className="p-4">
              <div className="d-flex align-items-center mb-4">
                <div className="me-3">
                  <div className="d-inline-block p-2 rounded-circle" style={{ 
                    background: 'linear-gradient(135deg, var(--accent-color), #059669)',
                    boxShadow: 'var(--shadow-sm)'
                  }}>
                    <span style={{ fontSize: '1.2rem' }}>➕</span>
                  </div>
                </div>
                <h3 className="fw-bold mb-0">Yeni Araç Ekle</h3>
              </div>
              
              <form onSubmit={handleAddCar}>
                <div className="mb-4">
                  <label className="form-label-modern d-block">
                    <i className="fas fa-car me-2">🚗</i>
                    Marka
                  </label>
                  <input 
                    type="text" 
                    className="form-control-modern w-100" 
                    value={brand} 
                    onChange={e => setBrand(e.target.value)} 
                    required 
                    disabled={isLoading}
                  />
                </div>
                <div className="mb-4">
                  <label className="form-label-modern d-block">
                    <i className="fas fa-tag me-2">🏷️</i>
                    Model
                  </label>
                  <input 
                    type="text" 
                    className="form-control-modern w-100" 
                    value={model} 
                    onChange={e => setModel(e.target.value)} 
                    required 
                    disabled={isLoading}
                  />
                </div>
                <div className="mb-4">
                  <label className="form-label-modern d-block">
                    <i className="fas fa-money-bill-wave me-2">💰</i>
                    Günlük Fiyat (₺)
                  </label>
                  <input 
                    type="number" 
                    className="form-control-modern w-100" 
                    value={pricePerDay} 
                    onChange={e => setPricePerDay(e.target.value)} 
                    required 
                    disabled={isLoading}
                  />
                </div>
                <button 
                  type="submit" 
                  className="btn-modern btn-success w-100"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <div className="d-flex align-items-center justify-content-center">
                      <div className="loading-spinner me-2"></div>
                      Ekleniyor...
                    </div>
                  ) : (
                    <>
                      <i className="fas fa-plus me-2">➕</i>
                      Araç Ekle
                    </>
                  )}
                </button>
              </form>
            </div>
          </div>
        </div>

        {/* Rental History Section */}
        <div className="col-lg-6">
          <div className="modern-card hover-lift scale-in">
            <div className="p-4">
              <div className="d-flex align-items-center mb-4">
                <div className="me-3">
                  <div className="d-inline-block p-2 rounded-circle" style={{ 
                    background: 'linear-gradient(135deg, var(--warning-color), #d97706)',
                    boxShadow: 'var(--shadow-sm)'
                  }}>
                    <span style={{ fontSize: '1.2rem' }}>📊</span>
                  </div>
                </div>
                <h3 className="fw-bold mb-0">Kiralama Geçmişi</h3>
              </div>
              
              {isLoadingRentals ? (
                <div className="text-center py-5">
                  <div className="loading-spinner mx-auto mb-3"></div>
                  <p className="text-muted">Kiralama verileri yükleniyor...</p>
                </div>
              ) : (
                <div className="table-responsive">
                  <table className="table table-modern">
                    <thead>
                      <tr>
                        <th style={{ width: '60px' }}>#</th>
                        <th>Kullanıcı</th>
                        <th>Araç</th>
                        <th>Başlangıç</th>
                        <th>Bitiş</th>
                        <th>Ücret</th>
                      </tr>
                    </thead>
                    <tbody>
                      {rentals.length === 0 ? (
                        <tr>
                          <td colSpan="6" className="text-center py-5">
                            <div className="text-muted">
                              <i className="fas fa-history" style={{ fontSize: '3rem', opacity: 0.3 }}>📊</i>
                              <p className="mt-3 mb-0">Henüz kiralama geçmişi bulunmuyor</p>
                            </div>
                          </td>
                        </tr>
                      ) : (
                        rentals.map((r, i) => (
                          <tr key={r.id} className="hover-lift">
                            <td className="fw-bold text-muted">{i + 1}</td>
                            <td className="fw-semibold">{r.user?.username || "Bilinmiyor"}</td>
                            <td className="text-muted">{r.car.brand} {r.car.model}</td>
                            <td>{new Date(r.startDate).toLocaleDateString('tr-TR')}</td>
                            <td>{r.endDate ? new Date(r.endDate).toLocaleDateString('tr-TR') : '-'}</td>
                            <td className="fw-bold text-success">₺{r.totalPrice.toFixed(2)}</td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              )}
              
              {rentals.length > 0 && (
                <div className="text-center mt-3">
                  <div className="glass-card d-inline-block px-3 py-2">
                    <small className="text-muted">
                      <i className="fas fa-info-circle me-1">ℹ️</i>
                      Toplam {rentals.length} kiralama kaydı
                    </small>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminPanel;
