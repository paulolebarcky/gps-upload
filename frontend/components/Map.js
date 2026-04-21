import React, { useEffect, useRef } from 'react';
import L from 'leaflet';

const Map = ({ data }) => {
  const containerRef = useRef(null);
  const mapRef = useRef(null);

  useEffect(() => {
    if (!containerRef.current) return;

    if (!mapRef.current) {
      mapRef.current = L.map(containerRef.current).setView([-25.4296, -49.2719], 13);

      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors'
      }).addTo(mapRef.current);
    }

    if (data && data.length > 0) {
      const points = data.map(item => [item.latitude, item.longitude]);

      data.forEach(item => {
        L.marker([item.latitude, item.longitude]).addTo(mapRef.current);
      });

      const polyline = L.polyline(points, { color: 'blue', dashArray: '10, 10', weight: 3, opacity: 0.7 }).addTo(mapRef.current);
      mapRef.current.fitBounds(polyline.getBounds());
    }

    return () => {
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
      }
    };
  }, [data]);

  return <div ref={containerRef} style={{ width: '100%', height: '500px' }} />;
};

export default Map;
