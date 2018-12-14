const rate = 1024
const limit = 1000

const conversion = (val) => {
  let unit = ''
  if (val > (rate * rate * limit)) {
    unit = 'GB/s'
    val = val / (rate * rate * rate)
    val = val.toFixed(2)
  } else if (val > rate * limit) {
    unit = 'MB/s'
    val = val / (rate * rate)
    val = val.toFixed(2)
  } else if (val <= rate * limit) {
    unit = 'KB/s'
    val = val / rate
    val = val.toFixed(2)
  }
  return val + unit
}
export { conversion }

const conversionUnit = (val) => {
  let unit = ''
  if (val > (rate * rate * limit)) {
    unit = 'GB'
    val = val / (rate * rate * rate)
    val = val.toFixed(2)
  } else if (val > rate * limit) {
    unit = 'MB'
    val = val / (rate * rate)
    val = val.toFixed(2)
  } else if (val < rate * limit) {
    unit = 'KB'
    val = val / rate
    val = val.toFixed(2)
  }
  return val + unit
}
export { conversionUnit }

const hour = 24
const minute = 60
const time = (val) => {
  let unit = ''
  let result = ''
  if (val > minute * hour) {
    let t = Math.floor(val / (minute * hour))
    val = val % (minute * hour)
    unit = '天'
    result = t + unit
  } if (val > minute) {
    let t = Math.floor(val / minute)
    val = val % minute
    unit = '小时'
    result = result + t + unit
  } if (val <= minute) {
    unit = '分钟'
    result = result + val + unit
  }
  // console.log(result)
  return result
}
export { time }
