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

let subway = [
        [
            42.3733705,
            -71.1189433
        ],
        [
            42.3300185,
            -71.0571623
        ],
        [
            42.300732,
            -71.114109
        ],
        [
            42.233274,
            -71.0068894
        ],
        [
            42.3736234,
            -71.0697182
        ],
        [
            42.4265943,
            -71.0743731
        ],
        [
            42.3425292,
            -71.057125
        ],
        [
            42.3743325,
            -71.0302794
        ],
        [
            42.3868747,
            -71.0047749
        ],
        [
            42.3796991,
            -71.0228172
        ],
        [
            42.3312546,
            -71.0955776
        ],
        [
            42.39051,
            -70.9971875
        ],
        [
            42.3588043,
            -71.0577716
        ],
        [
            42.2758631,
            -71.0302411
        ],
        [
            42.2667647,
            -71.020485
        ],
        [
            42.3496554,
            -71.0638505
        ],
        [
            42.2519622,
            -71.0054942
        ],
        [
            42.437512,
            -71.0708872
        ],
        [
            42.3108218,
            -71.0535376
        ],
        [
            42.3522166,
            -71.0626074
        ],
        [
            42.3595655,
            -71.0519869
        ],
        [
            42.3973855,
            -70.9924965
        ],
        [
            42.3691041,
            -71.0395764
        ],
        [
            42.407816,
            -70.9925369
        ],
        [
            42.4134836,
            -70.991668
        ],
        [
            42.3624028,
            -71.0857205
        ],
        [
            42.2075707,
            -71.0016289
        ],
        [
            42.3612148,
            -71.0714527
        ],
        [
            42.3961502,
            -71.1406803
        ],
        [
            42.3968234,
            -71.1226481
        ],
        [
            42.3525085,
            -71.0549447
        ],
        [
            42.3554309,
            -71.0605001
        ],
        [
            42.3563732,
            -71.0624614
        ],
        [
            42.3883838,
            -71.1190344
        ],
        [
            42.3205425,
            -71.0523783
        ],
        [
            42.3613939,
            -71.0621197
        ],
        [
            42.2999988,
            -71.0618652
        ],
        [
            42.2931254,
            -71.0657999
        ],
        [
            42.2844329,
            -71.0637251
        ],
        [
            42.3621193,
            -71.0578172
        ],
        [
            42.3652821,
            -71.0601496
        ],
        [
            42.3926452,
            -71.0772595
        ],
        [
            42.322596,
            -71.1002569
        ],
        [
            42.3596262,
            -71.059488
        ],
        [
            42.3475422,
            -71.07499
        ],
        [
            42.3367191,
            -71.0893393
        ],
        [
            42.341035,
            -71.0839643
        ],
        [
            42.3653334,
            -71.1036028
        ],
        [
            42.3103718,
            -71.1076496
        ],
        [
            42.3172274,
            -71.1043073
        ],
        [
            42.4016297,
            -71.0771978
        ],
        [
            42.3842954,
            -71.0769775
        ]]

let hospital = [
  [
      42.3498066,
      -71.0639959
  ],
  [
      42.5118445,
      -70.9064467
  ],
  [
      42.336038,
      -71.0707256
  ],
  [
      42.3334252,
      -71.0755668
  ]
]

let raisingcanes = [
        [
            42.3517837,
            -71.1187216
        ],
        [
            42.3493137,
            -71.0810732
        ],
        [
            42.3549482,
            -71.0595221
        ]
]

function Map({center, zoom, shapes, hider, seeker, bbox, update}: {center: number[], zoom: number, shapes: Shapes | undefined, hider: number[], seeker: number[], bbox: Vector2[], update: (center: number[], zoom: number) => void}) {
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
      circles.push(turf.circle([circle.circles[i].center.Y, circle.circles[i].center.X], circle.circles[i].radius, {units: "meters", steps: 128}))
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

      <Pane name="excludedArea" style={{opacity: "0.25"}}>

        {shapes.circles == null ? <></> : shapes.circles.map((e, i) => {
          return renderCircle(e, `Circle ${i}`)
        })}

        {shapes.polygons == null ? <></> : shapes.polygons.map((e, i) => {
          return renderPolygon(e, `Polygon ${i}`)
        })}
        
      </Pane>
    </MapContainer>
  );
}

export default Map;