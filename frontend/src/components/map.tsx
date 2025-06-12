import "./map.css";
import 'leaflet/dist/leaflet.css';
import type { JSX } from "react";
import { Pane, MapContainer, TileLayer, Marker, useMap, useMapEvent, GeoJSON, CircleMarker } from 'react-leaflet';
import { Icon, type PathOptions } from 'leaflet';
import * as turf from '@turf/turf';
import type { Position, Feature } from "geojson";

import type { Polygon, Shapes, Circle, Vector2 } from "../lib/interface";
import hidericon from "../assets/H.png"
import seekericon from "../assets/S.png"

function Map({markers, center, circleRes, zoom, shapes, hider, seeker, bbox, update}: {markers: {center: [number, number], radius: number, color: string}[], center: number[], circleRes: number, zoom: number, shapes: Shapes | undefined, hider: number[], seeker: number[], bbox: Vector2[], update: (center: number[], zoom: number) => void}) {
  const shaded = { 
    color: "blue",
    stroke: false,
    fillOpacity: 1,
    fillRule: "nonzero"
  } as PathOptions;

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

  function renderPolygon(polygon: Polygon, key: string = "0"): JSX.Element {
    // leaflet is stupid and reads geojson data backwards
    let positions: Position[] = polygon.outer.map((e) => {return [e.Y, e.X] as Position})
    positions.push(positions[0])

    let poly = turf.polygon([positions])
    
    for(let i = 0; i < polygon.holes.length; i++) {
      let hole: Position[] = polygon.holes[i].map((e) => {return [e.Y, e.X] as Position})
      hole.push(hole[0])

      let cutpoly = turf.polygon([hole])
      let diff = turf.difference(turf.featureCollection([poly, cutpoly]))

      let coordinates = diff?.geometry.coordinates

      if(coordinates != null) {
        poly = turf.polygon(coordinates as Position[][])
      }

    }

    return <GeoJSON key={key} data={poly} style={shaded}/>
  }

  function renderCircle(circle: Circle, key: string = "0"): JSX.Element {
    let circles: Feature[] = []

    for(let i = 0; i < circle.circles.length; i++) {
      circles.push(turf.circle([circle.circles[i].center.Y, circle.circles[i].center.X], circle.circles[i].radius, {units: "meters", steps: circleRes < 4 ? 4 : circleRes}))
    }

    if(circle.shaded) {
      return <GeoJSON key={key} data={turf.featureCollection(circles)} style={shaded}/>
    }

    let bounds: Position[] = bbox.map((e) => {return [e.Y, e.X] as Position})
    bounds.push(bounds[0])

    let poly = turf.polygon([bounds])

    for(let i = 0; i < circles.length; i++) {
      // @ts-ignore
      let geo: Positon[] = circles[i].geometry["coordinates"][0] as Position[]

      let cutpoly = turf.polygon([geo])
      let diff = turf.difference(turf.featureCollection([poly, cutpoly]))

      let coordinates = diff?.geometry.coordinates

      if(coordinates != null) {
        poly = turf.polygon(coordinates as Position[][])
      }
    }

    return <GeoJSON key={key} data={poly} style={shaded} />
  }

  function StateComponent() {
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
        <StateComponent />
        <Marker icon={hiderIcon} position={hider as any} />
        <Marker icon={seekerIcon} position={seeker as any} />
      </MapContainer>
    )
  }

  return (
    <MapContainer center={center as any} zoom={zoom} className='map'>
      <TileLayer url="https://a.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}.png"/>
      <StateComponent />
      <Marker icon={hiderIcon} position={hider as any} />
      <Marker icon={seekerIcon} position={seeker as any} />

      {markers == null ? <></> : markers.map((e, i) => {
        return <CircleMarker center={e.center} radius={e.radius} pathOptions={{color: e.color}}/>
      })}

      <Pane name="excludedArea" style={{opacity: "0.25"}}>

        {shapes.circles == null ? <></> : shapes.circles.map((e, i) => {
          return renderCircle(e, `Circle ${i}`)
        })}

        {shapes.polygons == null ? <></> : shapes.polygons.map((e, i) => {
          return renderPolygon(e, `Polygon ${i}`)
        })}
        
      </Pane>
    </MapContainer>
  )
}

export default Map;