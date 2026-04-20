// frontend/components/Map.js
import React, { useEffect, useRef } from 'react';
import L from 'leaflet';

const Map = ({ data }) => {
  const mapRef = useRef(null);

  useEffect(() => {
    if (!mapRef.current) {
      mapRef.current = L.map('mapid').setView([-25.4296, -49.2719], 13);

      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors'
      }).addTo(mapRef.current);
    }

    if (data && data.length > 0) {
      const points = data.map(item => [item.latitude, item.longitude]);

      // Add markers
      data.forEach(item => {
        L.marker([item.latitude, item.longitude]).addTo(mapRef.current);
      });

      // Connect points with a dashed line
      const polyline = L.polyline(points, { color: 'blue', dashArray: '10, 10', weight: 3, opacity: 0.7 }).addTo(mapRef.current);

      // Adjust zoom to fit all points
      const bounds = polyline.getBounds();
      mapRef.current.fitBounds(bounds);
    }

    return () => {
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
      }
    };
  }, [data]);

  return <div id="mapid" style={{ width: '100%', height: '500px' }}></div>;
};

export default Map;
