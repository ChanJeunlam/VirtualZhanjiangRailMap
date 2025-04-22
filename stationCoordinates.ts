// 站点详细信息类型定义
interface StationInfo {
  coordinates: [number, number] // [纬度, 经度]
  address: string
  phone: string
}

// 站点详细信息数据
export const stationDetails: { [key: string]: StationInfo } = {
  湛江站: {
    coordinates: [21.192514, 110.393996],
    address: "湛江市霞山区解放西路40号",
    phone: "(0759)12306",
  },
  湛江北站: {
    coordinates: [21.223748, 110.362123],
    address: "广东省湛江市霞山区海头街道西厅村",
    phone: "(0759)12306",
  },
  湛江西站: {
    coordinates: [21.249186, 110.294987],
    address: "广东省湛江市麻章区上塘村",
    phone: "(0759)12306",
  },
  徐闻站: {
    coordinates: [20.352062, 110.151946],
    address: "广东省湛江市徐闻县木兰大道",
    phone: "(0759)12306",
  },
  廉江站: {
    coordinates: [21.622313, 110.303976],
    address: "湛江市廉江市东环四路",
    phone: "(0759)6552671",
  },
  河唇站: {
    coordinates: [21.701727, 110.307948],
    address: "广东省湛江市廉江市河唇镇五一路",
    phone: "(0759)12306",
  },
  雷州站: {
    coordinates: [20.925462, 110.052287],
    address: "广东省湛江市雷州市新城大道",
    phone: "(0759)12306",
  },
  遂溪站: {
    coordinates: [21.404848, 110.273477],
    address: "湛江市遂溪县文仓路18号",
    phone: "(0759)12306",
  },
  塘缀站: {
    coordinates: [21.453928, 110.572845],
    address: "广东省湛江市吴川市塘缀镇山路村大道塘缀火车站",
    phone: "(0759)12306",
  },
  雷州龙门站: {
    coordinates: [20.72035, 110.015216],
    address: "广东省湛江市雷州市龙门镇雷州龙门站",
    phone: "(0759)12306",
  },
}

// 为了兼容性保留原来的坐标对象，但使用新的准确坐标
export const stationCoordinates: { [key: string]: [number, number] } = Object.entries(stationDetails).reduce(
  (acc, [name, info]) => {
    acc[name] = info.coordinates
    return acc
  },
  {} as { [key: string]: [number, number] },
)

export const getCoordinates = (stationName: string): [number, number] | null => {
  const cleanName = stationName.replace(" (x)", "").replace(/ /g, "_")
  return stationCoordinates[cleanName] || null
}

// 获取站点详细信息
export const getStationDetails = (stationName: string): StationInfo | null => {
  const cleanName = stationName.replace(" (x)", "").replace(/ /g, "_")
  return stationDetails[cleanName] || null
}
