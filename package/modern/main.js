function show(content) {
  window.document.getElementById('app').innerText = 'Hello,' + content
}

const getData = async () => {
  await console.log('bbb')
} 
const bb = 123

class Jump {
  constructor() {

  }

  bb = () => {
    console.log('test')
  }
}

let a = new Jump()

console.log(a)

getData()

show('Webpack')