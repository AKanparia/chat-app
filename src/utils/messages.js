const generateMsg = (text) => {
  return {
    text,
    createdAt: new Date().getTime(),
  }
}

const generateLocationMsg = (latitude, longitude) => {
  return {
    url: `https://google.com/maps?q=${latitude},${longitude}`,
    createdAt: new Date().getTime(),
  }
}

module.exports = {
  generateMsg,
  generateLocationMsg,
}
