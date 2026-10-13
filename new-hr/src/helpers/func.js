export const typeDate = (event) => {
  const input = event.target

  let value = input.value.replace(/\D/g, '')
  if (value.length > 8) value = value.slice(0, 8)

  // Formatlash
  let formattedValue = ''
  if (value.length > 4) {
    formattedValue = `${value.slice(0, 2)}-${value.slice(2, 4)}-${value.slice(4)}`
  } else if (value.length > 2) {
    formattedValue = `${value.slice(0, 2)}-${value.slice(2)}`
  } else {
    formattedValue = value
  }

  input.value = formattedValue
}

export const formatToISO = (timeString) => {
  let [hours, minutes] = timeString.split(':')
  if (!hours || !minutes) return ''
  return new Date(`1970-01-01T${hours}:${minutes}:00`).toISOString()
}

export const formatToISODate = (dateString) => {
  if (!dateString) return ''

  const [day, month, year] = dateString.split('-')

  if (!day || !month || !year) return ''

  const date = new Date(`${year}-${month}-${day}`)

  if (isNaN(date.getTime())) return ''

  return date.toISOString()
}

export const fromDateToClassic = (isoString) => {
  if (!isoString) return ''

  const date = new Date(isoString)

  if (isNaN(date.getTime())) return ''

  const day = String(date.getDate()).padStart(2, '0')
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const year = date.getFullYear()

  return `${day}-${month}-${year}`
}

export const formatToTime = (value) => {
  let date = new Date(value)

  let hours = date.getHours().toString().padStart(2, '0')
  let minutes = date.getMinutes().toString().padStart(2, '0')

  return `${hours}:${minutes}`
}



const addZero = (v) => (v < 10 ? `0${v}` : `${v}`)

export const convertDateShort = (value = new Date(), type = null) => {
  let date = new Date(value)
  return type == 'full'
    ? `${addZero(date.getDate())}/${addZero(date.getMonth() + 1)}/${addZero(date.getFullYear())} ${addZero(date.getHours())}:${addZero(date.getMinutes())}:${addZero(date.getSeconds())}`
    : type == 'hour'
      ? `${addZero(date.getHours())}:${addZero(date.getMinutes())}`
    : type == 'hour-second'
      ? `${addZero(date.getHours())}:${addZero(date.getMinutes())}:${addZero(date.getSeconds())}`
  :   `${addZero(date.getDate())}/${addZero(date.getMonth() + 1)}/${addZero(date.getFullYear())}`
}


export const convertTime = (hour, minus, second, type) => {
  return type == 'full'
    ?
    `${addZero(hour)}:${addZero(minus)}:${addZero(second)}`
    :
    `${addZero(hour)}:${addZero(minus)}`
}



// export const validateIPv4 = (ip) => {
//   const ipv4Regex =
//     /^(25[0-5]|2[0-4][0-9]|1?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|1?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|1?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|1?[0-9][0-9]?)$/
//   return ipv4Regex.test(ip)
// }




//// BU YERDA NORMALNIY DASTURCHI KODLARI BOSHLANADI
export const validateIPv4WithPort = (ipString) => {
  // Port ixtiyoriy bo'lishi uchun
  const [ip, port] = ipString.split(':');
  
  // IP validate
  const ipv4Regex = /^(\d{1,3}\.){3}\d{1,3}$/;
  if (!ipv4Regex.test(ip)) return false;
  
  const parts = ip.split('.');
  if (parts.some(part => parseInt(part) > 255)) return false;
  
  // Port validate (agar port berilgan bo'lsa)
  if (port) {
    const portNum = parseInt(port);
    if (isNaN(portNum) || portNum < 1 || portNum > 65535) return false;
  }
  
  return true;
}