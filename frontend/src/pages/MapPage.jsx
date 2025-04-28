import { useState, useRef, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMapEvents } from 'react-leaflet';
import L from 'leaflet';
import axios from 'axios';
import Swal from 'sweetalert2';
import 'leaflet/dist/leaflet.css';
import './MapPage.css';

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.3/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.3/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.3/dist/images/marker-shadow.png',
});

const MapPage = () => {
  const [markers, setMarkers] = useState([]);
  const [previewMarker, setPreviewMarker] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [selectedMarker, setSelectedMarker] = useState(null);
  const nameRef = useRef(null);
  const descRef = useRef(null);

  const MarkerClickHandler = () => {
    useMapEvents({
      click(e) {
        if (selectedMarker) {
          // Jika sedang mengedit, geser titik marker ke lokasi baru
          setPreviewMarker(e.latlng);
        } else {
          // Jika bukan edit, buat marker baru
          setPreviewMarker(e.latlng);
          setShowForm(false);
          setSelectedMarker(null);
          if (nameRef.current) nameRef.current.value = '';
          if (descRef.current) descRef.current.value = '';
        }
      }
    });
    return null;
  };

  useEffect(() => {
    axios.get(`/api/markers`)
      .then(res => {
        const loaded = res.data.map(m => ({
          ...m,
          desc: m.description,
          position: { lat: parseFloat(m.latitude), lng: parseFloat(m.longitude) }
        }));
        setMarkers(loaded);
      })
      .catch(err => console.error('Error loading markers:', err));
  }, []);

  const handleSaveMarker = async () => {
    const name = nameRef.current.value.trim();
    const desc = descRef.current.value.trim();
    if (name && desc && previewMarker) {
      try {
        const res = await axios.post(`/api/markers`, {
          name,
          latitude: previewMarker.lat,
          longitude: previewMarker.lng,
          description: desc
        });

        const newMarker = {
          id: res.data.id,
          name,
          desc,
          position: previewMarker
        };

        setMarkers(prev => [...prev, newMarker]);

        setShowForm(false);
        Swal.fire('Saved!', 'Marker has been added.', 'success');
        nameRef.current.value = '';
        descRef.current.value = '';
        setPreviewMarker(null);
        setSelectedMarker(null);
      } catch (err) {
        console.error('Failed to save marker:', err);
      }
    }
  };

  const handleEdit = (marker) => {
    setSelectedMarker({ ...marker });
    setPreviewMarker(marker.position);
    setShowForm(true);
    setTimeout(() => {
      if (nameRef.current) nameRef.current.value = marker.name;
      if (descRef.current) descRef.current.value = marker.desc;
    }, 100);
  };

  const handleUpdate = async () => {
    if (!selectedMarker || !previewMarker) return;
    try {
      const name = nameRef.current.value.trim();
      const desc = descRef.current.value.trim();

      const updatedMarker = {
        name,
        latitude: previewMarker.lat,
        longitude: previewMarker.lng,
        description: desc
      };

      await axios.put(`/api/markers/${selectedMarker.id}`, updatedMarker);

      setMarkers(markers => markers.map(m =>
        m.id === selectedMarker.id
          ? { ...m, name, desc, position: previewMarker }
          : m
      ));

      setShowForm(false);
      setPreviewMarker(null);
      setSelectedMarker(null);
      Swal.fire('Updated!', 'Marker has been updated.', 'success');
    } catch (err) {
      console.error('Failed to update marker:', err);
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`/api/markers/${id}`);
      setMarkers(markers => markers.filter(m => m.id !== id));
      setShowForm(false);
      setPreviewMarker(null);
      setSelectedMarker(null);
      Swal.fire('Deleted!', 'Marker has been removed.', 'success');
    } catch (err) {
      console.error('Failed to delete marker:', err);
    }
  };

  return (
    <div className="map-page">
      <h1>Interactive Map</h1>

      {previewMarker && !showForm && (
        <button className="floating-add-btn" onClick={() => setShowForm(true)}>
          + Add Marker
        </button>
      )}

      <MapContainer center={[-8.65, 115.2]} zoom={13} className="map-container">
        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
        <MarkerClickHandler />

        {previewMarker && (
          <Marker position={previewMarker} />
        )}

        {markers.map(marker => (
          <Marker key={marker.id} position={marker.position}>
            <Popup>
              <strong>{marker.name}</strong><br />
              {marker.desc}<br />
              <button onClick={() => handleEdit(marker)}>Edit</button>
              <button onClick={() => handleDelete(marker.id)}>Delete</button>
            </Popup>
          </Marker>
        ))}
      </MapContainer>

      {showForm && (
        <div className="form-popup">
          <input ref={nameRef} placeholder="Marker Name" className="popup-input" />
          <textarea ref={descRef} placeholder="Description" className="popup-textarea" />
          <div className="form-buttons">
            {selectedMarker ? (
              <button className="save" onClick={handleUpdate}>Update</button>
            ) : (
              <button className="save" onClick={handleSaveMarker}>Save</button>
            )}
            <button className="cancel" onClick={() => {
              setShowForm(false);
              setSelectedMarker(null);
              setPreviewMarker(null);
              nameRef.current.value = '';
              descRef.current.value = '';
            }}>Cancel</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default MapPage;
