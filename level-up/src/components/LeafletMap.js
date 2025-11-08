import React from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: require('leaflet/dist/images/marker-icon-2x.png'),
  iconUrl: require('leaflet/dist/images/marker-icon.png'),
  shadowUrl: require('leaflet/dist/images/marker-shadow.png'),
});

/**
 * LeafletMap - Mapa gratuito usando OpenStreetMap
 * @param {number} lat - Latitud (default: Santiago, Chile)
 * @param {number} lng - Longitud
 * @param {number} zoom - Nivel de zoom (1-18)
 * @param {number} height - Altura del mapa en píxeles
 * @param {string} markerText - Texto del popup del marcador
 */
export default function LeafletMap({ 
  lat = -33.451765,
  lng = -70.665924, 
  zoom = 13, 
  height = 400,
  markerText = 'Level-up Gamer'
}) {
  const position = [lat, lng];

  return (
    <div className="card bg-dark border-secondary p-2">
      <div className="card-body p-0" style={{ borderRadius: '8px', overflow: 'hidden' }}>
        <MapContainer 
          center={position} 
          zoom={zoom} 
          style={{ height: `${height}px`, width: '100%' }}
          scrollWheelZoom={false}
          zoomControl={true}
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
            url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
            subdomains="abcd"
            maxZoom={20}
          />
          <Marker position={position}>
            <Popup>
              <strong>{markerText}</strong>
              <br />
              Coordenadas: {lat.toFixed(4)}, {lng.toFixed(4)}
            </Popup>
          </Marker>
        </MapContainer>
      </div>
    </div>
  );
}
