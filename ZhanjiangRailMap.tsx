"use client"

import type React from "react"
import { useState, useEffect } from "react"
import dynamic from "next/dynamic"
import { zhanjiangRoutes } from "./routeData"
import { stationCoordinates, getCoordinates } from "./stationCoordinates"

const MapComponent = dynamic(
  () =>
    import("./MapComponent").catch((err) => {
      console.error("Error loading MapComponent:", err)
      return () => <div>地图加载失败，请刷新页面重试</div>
    }),
  {
    ssr: false,
    loading: () => (
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
    ),
  },
)

const ZhanjiangRailMap: React.FC = () => {
  const [isMounted, setIsMounted] = useState(false)
  const [activeRoute, setActiveRoute] = useState<number | null>(null)
  const [selectedRoute, setSelectedRoute] = useState<number | null>(null)

  useEffect(() => {
    setIsMounted(true)
  }, [])

  const handleRouteHover = (routeNumber: number | null) => {
    setActiveRoute(routeNumber)
  }

  const handleRouteClick = (routeNumber: number) => {
    setSelectedRoute((prev) => (prev === routeNumber ? null : routeNumber))
  }

  const getRouteStyle = (routeNumber: number) => {
    const isSelected = selectedRoute === routeNumber
    return {
      color: isSelected
        ? "red"
        : routeNumber === 1
          ? "#e53935" // 黎湛铁路 - 红色
          : routeNumber === 2
            ? "#1e88e5" // 粤海铁路 - 蓝色
            : routeNumber === 3
              ? "#43a047" // 深湛铁路 - 绿色
              : routeNumber === 4
                ? "#fb8c00" // 广湛高铁 - 橙色
                : "#9c27b0", // 河茂铁路 - 紫色
      weight: isSelected ? 4 : 3,
      opacity: selectedRoute === null || selectedRoute === routeNumber ? 1 : 0.3,
      dashArray: isSelected ? "5, 10" : undefined,
    }
  }

  return (
    <div className="zhanjiang-rail-map" style={{ height: "650px", width: "100%", display: "flex" }}>
      {isMounted && (
        <MapComponent
          zhanjiangRoutes={zhanjiangRoutes}
          stationCoordinates={stationCoordinates}
          getCoordinates={getCoordinates}
          getRouteStyle={getRouteStyle}
          handleRouteHover={handleRouteHover}
          handleRouteClick={handleRouteClick}
          selectedRoute={selectedRoute}
        />
      )}
      <div className="map-overlay">
        <h1>湛江市铁路交通地图</h1>
        <h2>广东省湛江市铁路网络</h2>
        <div>
          <h3>主要铁路线路</h3>
          <p>湛江市是粤西地区重要的铁路交通枢纽，连接粤港澳大湾区和海南自贸港。</p>
          <p className="tip">提示：点击站点可查看详细信息</p>
        </div>

        {activeRoute && (
          <div>
            <h3>路线: {zhanjiangRoutes[activeRoute].name}</h3>
            <p>站点:</p>
            <p className="stations">{zhanjiangRoutes[activeRoute].stations.join(", ")}</p>
          </div>
        )}

        {selectedRoute !== null && (
          <div>
            <h3>已选路线: {zhanjiangRoutes[selectedRoute].name}</h3>
            <p>站点:</p>
            <ul className="station-list">
              {zhanjiangRoutes[selectedRoute].stations.map((station, index) => (
                <li key={index}>{station}</li>
              ))}
            </ul>
          </div>
        )}

        <div>
          <h3>图例</h3>
          {selectedRoute !== null && (
            <button onClick={() => setSelectedRoute(null)} className="show-all-routes">
              显示所有路线
            </button>
          )}
          {Object.entries(zhanjiangRoutes).map(([routeNumber, route]) => (
            <div key={routeNumber} className="legend-item">
              <div className={`route-color route-${routeNumber}`}></div>
              <p onClick={() => handleRouteClick(Number(routeNumber))}>{route.name}</p>
            </div>
          ))}
          <div className="legend-item">
            <div className="selected-route"></div>
            <p>已选路线</p>
          </div>
          <div className="legend-item">
            <div className="station-marker"></div>
            <p>车站</p>
          </div>
        </div>

        <p className="note">注: 站点位置为实际位置。连线表示站点之间的连接关系，不一定完全符合实际铁路线路走向。</p>
      </div>
      <style jsx>{`
        .map-overlay {
          width: 30%;
          padding: 10px;
          background-color: white;
          box-shadow: 0 0 5px rgba(0,0,0,0.2);
          overflow-y: auto;
        }
        .italic { font-style: italic; }
        .tip {
          font-size: 12px;
          color: #1e88e5;
          font-style: italic;
        }
        .stations, .station-list li { font-size: 10px; }
        .station-list { list-style-type: none; padding: 0; }
        .legend-item {
          display: flex;
          align-items: center;
          margin: 5px 0;
        }
        .legend-item p {
          margin: 0 0 0 5px;
          font-size: 12px;
          cursor: pointer;
          transition: font-weight 0.1s ease;
        }
        .legend-item p:hover { font-weight: bold; }
        .route-color {
          width: 20px;
          height: 3px;
        }
        .route-1 { background-color: #e53935; }
        .route-2 { background-color: #1e88e5; }
        .route-3 { background-color: #43a047; }
        .route-4 { background-color: #fb8c00; }
        .route-5 { background-color: #9c27b0; }
        .selected-route {
          width: 20px;
          height: 0;
          border-bottom: 2px dashed red;
        }
        .station-marker {
          width: 10px;
          height: 10px;
          background-color: red;
        }
        .show-all-routes {
          margin: 10px 0;
          padding: 5px 10px;
          background-color: #f5f5f5;
          border: 1px solid #ddd;
          border-radius: 4px;
          cursor: pointer;
        }
        .note {
          font-size: 9px;
          text-align: center;
          color: #555;
        }
      `}</style>
    </div>
  )
}

export default ZhanjiangRailMap
