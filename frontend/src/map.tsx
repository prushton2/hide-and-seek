import "./map.css";
import 'leaflet/dist/leaflet.css';
import { MapContainer, TileLayer, Polygon, Popup, Polyline, CircleMarker} from 'react-leaflet';

function Map() {

  const shadedOptions = { 
    color: 'purple',
    stroke: false,
    fillOpacity: 0.1,
  };

  const polygons =
  [
    [
      [
        42.526848,
        -70.62171
      ],
      [
        42.203745,
        -70.62171
      ],
      [
        42.203745,
        -70.99776049098358
      ],
      [
        42.526848,
        -71.16523268702092
      ]
    ],
    [
      [
        42.526848,
        -70.62171
      ],
      [
        42.203745,
        -70.62171
      ],
      [
        42.203745,
        -71.0460206340407
      ],
      [
        42.526848,
        -71.10908787464525
      ]
    ],
    [
      [
        42.526848,
        -70.62171
      ],
      [
        42.203745,
        -70.62171
      ],
      [
        42.203745,
        -71.05182046561914
      ],
      [
        42.526848,
        -71.10829933724447
      ]
    ],
    [
      [
        42.526848,
        -70.62171
      ],
      [
        42.203745,
        -70.62171
      ],
      [
        42.203745,
        -71.06728072724634
      ],
      [
        42.526848,
        -71.08264066084467
      ]
    ],
    [
      [
        42.526848,
        -70.62171
      ],
      [
        42.203745,
        -70.62171
      ],
      [
        42.203745,
        -71.06775680849869
      ],
      [
        42.526848,
        -71.08097117880095
      ]
    ],
    [
      [
        42.2942082866448,
        -71.269668
      ],
      [
        42.526848,
        -71.269668
      ],
      [
        42.526848,
        -70.63538330038648
      ]
    ]
  ]

  return (
    <MapContainer center={[42.36041830331139, -71.0580009624248]} zoom={13} className='map'>
      <TileLayer url="https://a.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}.png" />
      <Polygon pathOptions={shadedOptions} positions={polygons[0]} />
      <Polygon pathOptions={shadedOptions} positions={polygons[1]} />
      <Polygon pathOptions={shadedOptions} positions={polygons[2]} />
      <Polygon pathOptions={shadedOptions} positions={polygons[3]} />
      <Polygon pathOptions={shadedOptions} positions={polygons[4]} />
      <Polygon pathOptions={shadedOptions} positions={polygons[5]} />
    </MapContainer>
  );
}

export default Map;