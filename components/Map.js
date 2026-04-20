import React, { useEffect, useRef } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

const Map = ({ csvData }) => {
  const mapRef = useRef(null);

  useEffect(() => {
    if (!mapRef.current) {
      mapRef.current = L.map('map', {
        center: [-25.4296, -49.2719],
        zoom: 13,
        layers: [
          L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          }),
        ]
      });
    }

    if (csvData && csvData.length > 0) {
      const points = csvData.map(item => [item.latitude, item.longitude]);

      // Add markers
      points.forEach(point => {
        L.marker(point).addTo(mapRef.current);
      });

      // Connect points with a dashed line
      const polyline = L.polyline(points, {
        color: 'blue',
        dashArray: '10, 10',
        weight: 3,
        opacity: 0.7
      }).addTo(mapRef.current);

      // Adjust zoom to fit all points
      mapRef.current.fitBounds(polyline.getBounds());
    }

    return () => {
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
      }
    };
  }, [csvData]);

  return <div id="map" style={{ width: '100%', height: '500px' }}></div>;
};

export default Map;
