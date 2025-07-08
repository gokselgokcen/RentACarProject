import React, { useState, useEffect } from "react";
import axios from "axios";

const AdminPanel = ({ onLogout }) => {
  const [carRefreshKey, setCarRefreshKey] = useState(0);
  const triggerCarRefresh = () => setCarRefreshKey((p) => p + 1);

  const [rentals, setRentals] = useState([]);
  const [rentalRefreshKey, setRentalRefreshKey] = useState(0);
  const triggerRentalRefresh = () => setRentalRefreshKey((p) => p + 1);

  const [brand, setBrand] = useState("");
  const [model, setModel] = useState("");
  const [pricePerDay, setPricePerDay] = useState("");
  const [message, setMessage] = useState("");

  const [editingCarId, setEditingCarId] = useState(null);
  const [editBrand, setEditBrand] = useState("");
  const [editModel, setEditModel] = useState("");
  const [editPrice, setEditPrice] = useState("");

  const [cars, setCars] = useState([]);

  useEffect(() => {
    axios.get("http://localhost:5087/api/car")
      .then(res => setCars(res.data))
      .catch(err => console.error("Araçlar alınamadı:", err));
  }, [carRefreshKey]);

  useEffect(() => {
    axios.get("http://localhost:5087/api/rental")
      .then(res => setRentals(res.data))
      .catch(err => console.error("Kiralama verisi alınamadı:", err));
  }, [rentalRefreshKey]);

  const handleAddCar = async (e) => {
    e.preventDefault();
    try {
      await axios.post("http://localhost:5087/api/car", {
        brand,
        model,
        pricePerDay: parseFloat(pricePerDay),
        isAvailable: true,
      });
      setMessage("✅ Yeni araç eklendi.");
      setBrand(""); setModel(""); setPricePerDay("");
      triggerCarRefresh();
    } catch (err) {
      setMessage("❌ Araç eklenemedi: " + (err.response?.data || err.message));
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
    try {
      const original = cars.find(c => c.id === id);
      await axios.put(`http://localhost:5087/api/car/${id}`, {
        id,
        brand: editBrand,
        model: editModel,
        pricePerDay: parseFloat(editPrice),
        isAvailable: original.isAvailable,
      });
      setMessage("✅ Araç bilgisi güncellendi.");
      setEditingCarId(null);
      triggerCarRefresh();
    } catch (err) {
      setMessage("❌ Güncelleme başarısız: " + (err.response?.data || err.message));
    }
  };

  return (
    <div className="container my-5">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2 className="text-center text-danger">🛠️ Admin Panel</h2>
        <button className="btn btn-outline-secondary" onClick={onLogout}>
          Çıkış Yap
        </button>
      </div>

      {/* Araç Listesi ve Düzenleme */}
      <div className="card shadow-sm p-4 mb-5">
        <h3 className="mb-3">Mevcut Araçlar</h3>
        <table className="table table-striped">
          <thead>
            <tr>
              <th>#</th>
              <th>Marka</th>
              <th>Model</th>
              <th>Günlük Fiyat (₺)</th>
              <th>Durum</th>
              <th>İşlem</th>
            </tr>
          </thead>
          <tbody>
            {cars.map((car, i) => (
              <tr key={car.id}>
                <td>{i + 1}</td>
                {editingCarId === car.id ? (
                  <>
                    <td><input className="form-control" value={editBrand} onChange={e => setEditBrand(e.target.value)} /></td>
                    <td><input className="form-control" value={editModel} onChange={e => setEditModel(e.target.value)} /></td>
                    <td><input type="number" className="form-control" value={editPrice} onChange={e => setEditPrice(e.target.value)} /></td>
                    <td><span className={`badge ${car.isAvailable ? 'bg-success' : 'bg-danger'}`}>{car.isAvailable ? 'Uygun' : 'Kirada'}</span></td>
                    <td>
                      <button className="btn btn-sm btn-success me-2" onClick={() => saveEdit(car.id)}>Kaydet</button>
                      <button className="btn btn-sm btn-secondary" onClick={cancelEditing}>İptal</button>
                    </td>
                  </>
                ) : (
                  <>
                    <td>{car.brand}</td>
                    <td>{car.model}</td>
                    <td>{car.pricePerDay.toFixed(2)}</td>
                    <td><span className={`badge ${car.isAvailable ? 'bg-success' : 'bg-danger'}`}>{car.isAvailable ? 'Uygun' : 'Kirada'}</span></td>
                    <td><button className="btn btn-sm btn-primary" onClick={() => startEditing(car)}>Düzenle</button></td>
                  </>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Yeni Araç Ekle */}
      <div className="card shadow-sm p-4 mb-5">
        <h3 className="mb-3">Yeni Araç Ekle</h3>
        <form onSubmit={handleAddCar}>
          <div className="mb-3">
            <label className="form-label">Marka:</label>
            <input type="text" className="form-control" value={brand} onChange={e => setBrand(e.target.value)} required />
          </div>
          <div className="mb-3">
            <label className="form-label">Model:</label>
            <input type="text" className="form-control" value={model} onChange={e => setModel(e.target.value)} required />
          </div>
          <div className="mb-3">
            <label className="form-label">Günlük Fiyat (₺):</label>
            <input type="number" className="form-control" value={pricePerDay} onChange={e => setPricePerDay(e.target.value)} required />
          </div>
          <button type="submit" className="btn btn-danger">Araç Ekle</button>
        </form>
        {message && <div className="alert alert-info mt-3">{message}</div>}
      </div>

      {/* Kiralama Geçmişi */}
      <div className="card shadow-sm p-4">
        <h3 className="mb-3">Kiralama Geçmişi</h3>
        <table className="table table-striped">
          <thead>
            <tr>
              <th>#</th>
              <th>Kullanıcı</th>
              <th>Araç</th>
              <th>Başlangıç</th>
              <th>Bitiş</th>
              <th>Ücret (₺)</th>
            </tr>
          </thead>
          <tbody>
            {rentals.map((r, i) => (
              <tr key={r.id}>
                <td>{i + 1}</td>
                <td>{r.user?.username || "Bilinmiyor"}</td>
                <td>{r.car.brand} {r.car.model}</td>
                <td>{new Date(r.startDate).toLocaleDateString()}</td>
                <td>{r.endDate ? new Date(r.endDate).toLocaleDateString() : '-'}</td>
                <td>{r.totalPrice.toFixed(2)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminPanel;
