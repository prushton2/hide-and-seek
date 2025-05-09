import "./map.css";
import 'leaflet/dist/leaflet.css';
import { MapContainer, TileLayer, Marker, Popup, Polyline, CircleMarker} from 'react-leaflet';
// import { Icon } from 'leaflet';

function Map() {
  return (
    <MapContainer center={[42.36041830331139, -71.0580009624248]} zoom={13} className='map'>
      <TileLayer url="https://a.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}.png" />
    </MapContainer>
  );
}

// center={[42.36041830331139, -71.0580009624248]}
export default Map;