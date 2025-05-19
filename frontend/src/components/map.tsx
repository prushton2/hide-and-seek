import "./map.css";
import 'leaflet/dist/leaflet.css';
import { Pane, MapContainer, TileLayer, Polygon, Marker, Circle, useMap, useMapEvent } from 'react-leaflet';
import { Icon } from 'leaflet';
import hidericon from "../assets/H.png"
import seekericon from "../assets/S.png"
import type { Shapes } from "../lib/interface";

import { Donut } from '../Donut/Donut.tsx'


function Map({center, zoom, shapes, hider, seeker, update}: {center: number[], zoom: number, shapes: Shapes | undefined, hider: number[], seeker: number[], update: (center: number[], zoom: number) => void}) {
  const shaded = { 
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

  function MyComponent() {
    const map = useMap()
    const zoomListener = useMapEvent('zoom', () => {
      update(map.getCenter() as any, map.getZoom())
    })
    
    const panListener = useMapEvent('move', () => {
      update(map.getCenter() as any, map.getZoom())
    })
    return null
  }

  if(shapes == undefined) {
    return (
      <MapContainer center={center as any} zoom={zoom} className='map'>
        <TileLayer url="https://a.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}.png"/>
        <MyComponent />
        <Marker icon={hiderIcon} position={hider as any} />
        <Marker icon={seekerIcon} position={seeker as any} />
      </MapContainer>
    )
  }

  return (
    <MapContainer center={center as any} zoom={zoom} className='map'>
      <TileLayer url="https://a.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}.png"/>
      <MyComponent />
      <Marker icon={hiderIcon} position={hider as any} />
      <Marker icon={seekerIcon} position={seeker as any} />
      <Pane name="excludedArea" style={{opacity: "0.25"}}>

        {shapes.circles == null ? <></> : shapes.circles.map((e, i) => {
          return e.shaded ? <Circle 
            key={`circle ${i}`}
            radius={e.radius}
            center={[e.center.X, e.center.Y]}
            pathOptions={shaded}
          /> : 
          <Donut
            key={`donut ${i}`}
            radius={1000000000} 
            innerRadius={e.radius}
            center={[e.center.X, e.center.Y] as any}
            pathOptions={shaded}
          />
        })}

        {shapes.polygons == null ? <></> : shapes.polygons.map((e, i) => {
          return <Polygon
            key={`polygon ${i}`}
            positions={e.map((e) => { return [e.X, e.Y] })}
            pathOptions={shaded}
          />
        })}
        
      </Pane>
    </MapContainer>
  );
}

export default Map;