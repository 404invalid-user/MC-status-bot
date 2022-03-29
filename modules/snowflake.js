//crude way of generating numeric ids using the time and some random not random
module.exports = () => {
  const date = Date.now().toString()
  const genS1 = Math.floor(Math.random() * parseInt(Math.random() * 4))
  const genS2 = Math.floor(Math.random() * parseInt(Math.random() * 4))
  const genS3 = Math.floor(Math.random() * parseInt(Math.random() * 4))
  const genS4 = Math.floor(Math.random() * parseInt(Math.random() * 4))
  var middle = Math.floor(date.length / 2)
  var s1 = date.substr(0, middle)
  var s2 = date.substr(middle + 1)
  return genS1 + s1 + genS2 + s2 + genS3 + genS4
}
