import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
});

const CATEGORY_COLORS = {
  "Gaming venue": "#FFAA7F",
  "Comics & cards": "#FFAA7F",
  "Kawaii shop": "#FFAA7F",
  "Boba & matcha": "#85C9A0",
  "Cute cafe": "#85C9A0",
  "Asian eats": "#85C9A0",
  "Izakaya & pocha": "#85C9A0",
};

function createCustomIcon(category) {
  const color = CATEGORY_COLORS[category] || "#FFAA7F";
  return L.divIcon({
    className: "",
    html: `
      <div style="
        width: 28px;
        height: 28px;
        border-radius: 50%;
        background: ${color};
        border: 2.5px solid #FFFCF7;
        box-shadow: 0 2px 6px rgba(44,24,16,0.2);
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 13px;
      "></div>
    `,
    iconSize: [28, 28],
    iconAnchor: [14, 14],
    popupAnchor: [0, -16],
  });
}

export default function MapView({ spawnPoints, onSelectSpawnPoint, singlePin = false, height = "420px" }) {
  const validPoints = spawnPoints.filter((s) => s.latitude && s.longitude);
  const center = validPoints.length > 0
    ? [validPoints[0].latitude, validPoints[0].longitude]
    : [33.749, -84.388];

  return (
    <div style={{ height, width: "100%", borderRadius: "24px", overflow: "hidden", border: "1.5px solid #EAD9C8", marginBottom: "1.5rem", position: "relative", zIndex: 1 }}>
      <MapContainer
        center={center}
        zoom={singlePin ? 15 : 11}
        style={{ height: "100%", width: "100%" }}
        scrollWheelZoom={false}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
          url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
        />
        {validPoints.map((spawn) => (
          <Marker
            key={spawn.id}
            position={[spawn.latitude, spawn.longitude]}
            icon={createCustomIcon(spawn.category)}
          >
            <Popup>
              <div style={{ fontFamily: "'M PLUS Rounded 1c', sans-serif", minWidth: "160px" }}>
                <div style={{ fontWeight: "700", fontSize: "14px", color: "#2C1810", marginBottom: "3px" }}>
                  {spawn.name}
                </div>
                <div style={{ fontSize: "11px", color: "#B89880", marginBottom: "8px" }}>
                  {spawn.neighborhood}
                </div>
                <div style={{ display: "inline-block", fontFamily: "monospace", fontSize: "10px", background: "#FFF4EE", color: "#6B3218", border: "1.5px solid #FFAA7F", padding: "2px 8px", borderRadius: "100px", marginBottom: "8px" }}>
                  {spawn.category}
                </div>
                <br />
                <button
                  onClick={() => onSelectSpawnPoint(spawn)}
                  style={{ fontFamily: "monospace", fontSize: "10px", fontWeight: "700", background: "#FFAA7F", color: "#6B3218", border: "none", padding: "6px 12px", borderRadius: "100px", cursor: "pointer", marginTop: "4px" }}
                >
                  View spot →
                </button>
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
}