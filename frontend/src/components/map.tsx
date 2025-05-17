import "./map.css";
import 'leaflet/dist/leaflet.css';
import { Pane, MapContainer, TileLayer, Polygon, Marker, Circle, CircleMarker, Rectangle, LayerGroup} from 'react-leaflet';
import { Icon } from 'leaflet';
import hidericon from "./assets/H.png"
import seekericon from "./assets/S.png"
import type { Shapes } from "../lib/interface";


function Map({shapes, hider, seeker}: {shapes: Shapes | undefined, hider: number[], seeker: number[]}) {
  const shaded = { 
    color: "blue",
    stroke: false,
    fillOpacity: 1,
  };

  const unshaded = { 
    color: "black",
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

  if(shapes == undefined) {
    return (
      <MapContainer center={[42.36041830331139, -71.0580009624248]} zoom={13} className='map'>
        <TileLayer url="https://a.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}.png"/>
        <Marker icon={hiderIcon} position={hider as any} />
        <Marker icon={seekerIcon} position={seeker as any} />
      </MapContainer>
    )
  }

  return (
    <MapContainer center={[42.36041830331139, -71.0580009624248]} zoom={13} className='map'>
      <TileLayer url="https://a.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}.png"/>
      <Marker icon={hiderIcon} position={hider as any} />
      <Marker icon={seekerIcon} position={seeker as any} />
      <Pane name="excludedArea" style={{opacity: "0.25"}}>
        {shapes.fullHighlight ? 
          <Rectangle key={"rect"} bounds={[[42.203745, -71.269668], [42.526848, -70.621710]]} pathOptions={shaded}/> : <></>
        }

        {shapes.circles == null ? <></> : shapes.circles.map((e, i) => {
          return <Circle 
            key={`circle ${i}`}
            radius={e.radius}
            center={[e.center.X, e.center.Y]}
            pathOptions={e.shaded ? shaded : unshaded}
          />
        })}
        
        {shapes.polygons == null ? <></> : shapes.polygons.map((e, i) => {
          return <Polygon
            key={`polygon ${i}`}
            positions={e as any}
            pathOptions={shaded}
          />
        })}
      </Pane>
    </MapContainer>
  );
}

export default Map;