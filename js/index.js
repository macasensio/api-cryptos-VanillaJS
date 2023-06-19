//variables
const monedaSelect = document.querySelector('#moneda')
const criptoSelect = document.querySelector('#criptomoneda')

const formulario = document.querySelector('#formulario')
const resultado = document.querySelector('.resultado')

//objeto consulta
const objConsulta = {
    moneda: '',
    criptomoneda: ''
}

//addEventListener
document.addEventListener('DOMContentLoaded', () => {
    consultarApi()
    monedaSelect.addEventListener('change', leerValor)
    criptomoneda.addEventListener('change', leerValor)
    formulario.addEventListener('submit', submitFormulario)
})


//leer valor del select
function leerValor(e) {
    objConsulta[e.target.name] = e.target.value
}

function submitFormulario(e) {
    e.preventDefault()

    //validar form
    const { moneda, criptomoneda } = objConsulta
    if (moneda === '' || criptomoneda === '') {
        mostrarAlerta('Ambos campos son obligatorios')
        return
    }
    //consultar API resultados
    consultarResultado()
}

function mostrarAlerta(msg) {
    limpiarHTML()
    const alerta = document.querySelector('.alerta')

    if (!alerta) {
        const alerta = document.createElement('p')
        alerta.classList.add('alerta')
        alerta.textContent = msg
        resultado.appendChild(alerta)

        setTimeout(() => {
            alerta.remove()
        }, 3000)
    }
}

async function consultarResultado() {
    const { moneda, criptomoneda } = objConsulta

    const url = `https://min-api.cryptocompare.com/data/pricemultifull?fsyms=${criptomoneda}&tsyms=${moneda}`

    try {
        const respuesta = await fetch(url)
        const cotizacion = await respuesta.json()
        mostrarHTML(cotizacion.DISPLAY[criptomoneda][moneda])
    } catch (error) {
        console.error(error)
    }
}


function mostrarHTML(cotizacion) {
    const { LOW24HOUR, HIGH24HOUR, PRICE } = cotizacion
    console.log(cotizacion)
    limpiarHTML()
    const respuesta = document.createElement('div')
    respuesta.innerHTML = `
        <p class="precio">Precio actual: <span>${PRICE}</span></p>
        <p>Precio más bajo en las últimas 24hs: <span>${LOW24HOUR}</span></p>
        <p>Precio más alto en las últimas 24hs: <span>${HIGH24HOUR}</span></p>
    `

    resultado.appendChild(respuesta)
}

function limpiarHTML() {
    while (resultado.firstChild) {
        resultado.removeChild(resultado.firstChild)
    }
}


//consultar criptos a la Api
async function consultarApi() {
    const url = 'https://min-api.cryptocompare.com/data/top/mktcapfull?limit=10&tsym=USD'

    try {
        const respuesta = await fetch(url)
        const resultado = await respuesta.json()
        const criptomonedas = await resultado.Data
        selectCriptomonedas(criptomonedas)
    } catch (error) {
        console.error(error)
    }
}

//selectCriptomonedas
function selectCriptomonedas(criptomonedas) {
    criptomonedas.forEach(cripto => {
        const { FullName, Name } = cripto.CoinInfo

        const option = document.createElement('option')
        option.value = Name
        option.textContent = FullName

        criptoSelect.appendChild(option)
    })
}