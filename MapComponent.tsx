"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { getStationDetails } from "./stationCoordinates"

// Remove the direct imports of leaflet and react-leaflet
// import { MapContainer, TileLayer, Polyline, Marker, Tooltip, Popup } from "react-leaflet"
// import L from "leaflet"
// import "leaflet/dist/leaflet.css"

// Define the props interface
interface MapComponentProps {
  zhanjiangRoutes: any
  stationCoordinates: { [key: string]: [number, number] }
  getCoordinates: (stationName: string) => [number, number] | null
  getRouteStyle: (routeNumber: number) => any
  handleRouteHover: (routeNumber: number | null) => void
  handleRouteClick: (routeNumber: number) => void
  selectedRoute: number | null
}

const MapComponent: React.FC<MapComponentProps> = ({
  zhanjiangRoutes,
  stationCoordinates,
  getCoordinates,
  getRouteStyle,
  handleRouteHover,
  handleRouteClick,
  selectedRoute,
}) => {
  const [activeStation, setActiveStation] = useState<string | null>(null)
  const [map, setMap] = useState<any>(null)
  const [leafletLoaded, setLeafletLoaded] = useState(false)

  // Load Leaflet dynamically
  useEffect(() => {
    // Only run in browser
    if (typeof window !== "undefined") {
      // Dynamic imports
      Promise.all([import("leaflet"), import("react-leaflet"), import("leaflet/dist/leaflet.css")]).then(
        ([L, ReactLeaflet]) => {
          setMap({
            L: L.default,
            MapContainer: ReactLeaflet.MapContainer,
            TileLayer: ReactLeaflet.TileLayer,
            Polyline: ReactLeaflet.Polyline,
            Marker: ReactLeaflet.Marker,
            Tooltip: ReactLeaflet.Tooltip,
            Popup: ReactLeaflet.Popup,
          })
          setLeafletLoaded(true)
        },
      )
    }
  }, [])

  if (!leafletLoaded || !map) {
    return (
      <div
        style={{
          height: "100%",
          width: "70%",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          backgroundColor: "#f0f0f0",
        }}
      >
        加载地图中...
      </div>
    )
  }

  // Create station icon after Leaflet is loaded
  const stationIcon = new map.L.Icon({
    iconUrl:
      'data:image/svg+xml;utf8,<svg width="10" height="10" viewBox="0 0 10 10" fill="none" xmlns="http://www.w3.org/2000/svg"><rect width="10" height="10" fill="red"/></svg>',
    iconSize: [10, 10],
    iconAnchor: [5, 5],
    className: "station-icon",
  })

  const { MapContainer, TileLayer, Polyline, Marker, Tooltip, Popup } = map

  return (
    <MapContainer center={[21.3, 110.3]} zoom={9} style={{ height: "100%", width: "70%" }} zoomControl={true}>
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      />

      {Object.entries(zhanjiangRoutes).map(([routeNumberStr, routeData]) => {
        const routeNumber = Number(routeNumberStr)
        const coordinates = routeData.path.map((station) => getCoordinates(station)).filter((c) => c !== null) as [
          number,
          number,
        ][]

        return (
          <Polyline
            key={routeNumber}
            positions={coordinates}
            pathOptions={getRouteStyle(routeNumber)}
            eventHandlers={{
              mouseover: () => handleRouteHover(routeNumber),
              mouseout: () => handleRouteHover(null),
              click: () => handleRouteClick(routeNumber),
            }}
          />
        )
      })}

      {Object.entries(stationCoordinates).map(([name, coords]) => {
        const stationDetails = getStationDetails(name)
        return (
          <Marker
            key={name}
            position={coords}
            icon={stationIcon}
            eventHandlers={{
              click: () => setActiveStation(activeStation === name ? null : name),
            }}
          >
            <Tooltip permanent direction="top" offset={[0, -5]}>
              {name.replace(/_/g, " ")}
            </Tooltip>
            <Popup>
              <div className="station-popup">
                <h3>{name}</h3>
                <p>
                  <strong>地址：</strong>
                  {stationDetails?.address || "暂无信息"}
                </p>
                <p>
                  <strong>电话：</strong>
                  {stationDetails?.phone || "暂无信息"}
                </p>
                <p>
                  <strong>坐标：</strong>
                  {stationDetails?.coordinates[1]},{stationDetails?.coordinates[0]}
                </p>
              </div>
            </Popup>
          </Marker>
        )
      })}
    </MapContainer>
  )
}

export default MapComponent
