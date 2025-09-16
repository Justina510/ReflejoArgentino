import { MapContainer, TileLayer, CircleMarker, Tooltip } from 'react-leaflet';
import provinciasCoords from '../../Data/provinciasCoords.js';
import 'leaflet/dist/leaflet.css';

function MapChart({ puntos }) {
  const hasData = Array.isArray(puntos) && puntos.length > 0;


  const maxCount = hasData ? Math.max(...puntos.map(p => p.count)) || 1 : 1;
  const minRadius = 5;
  const maxRadius = 40;

  const getRadius = (count) => minRadius + (count / maxCount) * (maxRadius - minRadius);

  return (
    <MapContainer center={[-38, -63]} zoom={4} className="mapa-leaflet">
      <TileLayer
        attribution='&copy; OpenStreetMap contributors'
        url='https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png'
      />

      {hasData
        ? puntos.map((p, i) => {
            const coords = provinciasCoords[p.PROVINCIA?.trim()];
            if (!coords) return null;

            const radius = getRadius(p.count);

            const pathOptions = {
              color: p.color,
              fillColor: p.color,
              fillOpacity: 0.6,
            };

            return (
              <CircleMarker key={i} center={coords} radius={radius} pathOptions={pathOptions}>
                <Tooltip direction="top" offset={[0, -2]}>
                  {p.count.toLocaleString()} personas
                </Tooltip>
              </CircleMarker>
            );
          })
        : null}
    </MapContainer>
  );
}

export default MapChart;
