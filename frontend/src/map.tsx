import "./map.css";
import 'leaflet/dist/leaflet.css';
import { MapContainer, TileLayer, Polygon, Popup, Polyline, CircleMarker} from 'react-leaflet';

function Map() {

  const purpleOptions = { color: 'purple' };

  const polygon = [
    [42.203745, -70.983822], [42.203745, -71.269668], [42.526848, -71.269668], [42.526848, -71.151812]
  ];

  return (
    <MapContainer center={[42.36041830331139, -71.0580009624248]} zoom={13} className='map'>
      <TileLayer url="https://a.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}.png" />
      <Polygon pathOptions={purpleOptions} positions={polygon} />
    </MapContainer>
  );
}

export default Map;