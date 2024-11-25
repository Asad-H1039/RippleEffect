export type Weather = {
  district: string
  lat: number
  lon: number
  timezone: string
  timezone_offset: number
  weather: {
    current: WeatherCurrent
    daily: WeatherDaily[]
    hourly: WeatherHourly[]
  }
}

export type WeatherCurrent = {
  clouds: number
  dew_point: number
  dt: number
  feels_like: number
  humidity: number
  pressure: number
  sunrise: number
  sunset: number
  temp: number
  uvi: number
  visibility: number
  weather: {
    id: number
    main: string
    description: string
    icon: string
  }[]
  wind_deg: number
  wind_gust: number
  wind_speed: number
}

export type WeatherDaily = {
  clouds: number
  dew_point: number
  dt: number
  feels_like: {
    day: number
    night: number
    eve: number
    morn: number
  }[]
  humidity: number
  moon_phase: number
  moonrise: number
  moonset: number
  pop: number
  pressure: number
  summary: string
  sunrise: number
  sunset: number
  temp: {
    day: number
    min: number
    max: number
    night: number
    eve: number
    morn: number
  }
  uvi: number
  visibility: number
  weather: {
    id: number
    main: string
    description: string
    icon: string
  }[]
  wind_deg: number
  wind_gust: number
  wind_speed: number
}

export type WeatherHourly = {
  clouds: number
  dew_point: number
  dt: number
  feels_like: number
  humidity: number
  pop: number
  pressure: number
  temp: number
  uvi: number
  visibility: number
  weather: {
    id: number
    main: string
    description: string
    icon: string
  }[]
  wind_deg: number
  wind_gust: number
  wind_speed: number
}
