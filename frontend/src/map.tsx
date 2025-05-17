import "./map.css";
import 'leaflet/dist/leaflet.css';
import { Pane, MapContainer, TileLayer, Polygon, Marker} from 'react-leaflet';
import { Icon } from 'leaflet';
import hidericon from "./assets/H.png"
import seekericon from "./assets/S.png"

function Map({shapes, hider, seeker}: {shapes: number[][][], hider: number[], seeker: number[]}) {
  const shadedOptions = { 
    color: "blue",
    stroke: false,
    fillOpacity: 1,
  };

  let hiderIcon: Icon = new Icon({
    iconUrl: hidericon,
    iconSize: [25, 25],
    iconAnchor: [12.5, 12.5],
    popupAnchor: [0, -12.5]
  });

  let seekerIcon: Icon = new Icon({
    iconUrl: seekericon,
    iconSize: [25, 25],
    iconAnchor: [12.5, 12.5],
    popupAnchor: [0, -12.5]
  });

  return (
    <MapContainer center={[42.36041830331139, -71.0580009624248]} zoom={13} className='map' >
      <TileLayer url="https://a.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}.png"/>
      <Marker icon={hiderIcon} position={hider as any} />
      <Marker icon={seekerIcon} position={seeker as any} />
      <Pane name="excludedArea" style={{opacity: "0.25"}}>
        {shapes.map((e, i) => {
          return <Polygon
            key={i}
            positions={e as any}
            pathOptions={shadedOptions}
          />
        })}
      </Pane>
    </MapContainer >
  );
}

export default Map;