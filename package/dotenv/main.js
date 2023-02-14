function show(content) {
  window.document.getElementById('app').innerText = 'Hello,' + content
}

show('Webpack')

console.log(process.env.DB_HOST);