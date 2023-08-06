const express = require('express')
const app = express()
const morgan = require('morgan')
app.use( express.json())

morgan.token('data',(request, response)=>{
  return JSON.stringify(request.body)
})

app.use(morgan(':method :url :status :res[content-length] - :response-time ms :data'))


let persons =
[
    { 
      "id": 1,
      "name": "Arto Hellas", 
      "number": "040-123456"
    },
    { 
      "id": 2,
      "name": "Ada Lovelace", 
      "number": "39-44-5323523"
    },
    { 
      "id": 3,
      "name": "Dan Abramov", 
      "number": "12-43-234345"
    },
    { 
      "id": 4,
      "name": "Mary Poppendieck", 
      "number": "39-23-6423122"
    }
]
app.get('/', (request, response) => {
  response.send('<h1>Hello World!</h1>')
})

app.get('/api/persons', (request, response) => {
  response.json(persons)
})

app.get('/info', (request, response) =>{
    console.log(`Phonebook has info for ${persons.length} people`);
    response.send(
        `<p>Phonebook has info for ${persons.length} people </p>
        <p> ${new Date()}</p>
    `)
})

const generateId = () => {
    return Math.floor(Math.random()*1000000000)
  }

app.get('/api/persons/:id', (request,response) =>{
    const id = Number(request.params.id)
    const person = persons.find(person=> person.id === id)
    person?
        response.json(person):
        response.status(404).end()
})

app.post('/api/persons', (request, response) =>{
    const body = request.body
    
    console.log(body)

    if(!body.name || !body.number){
        return response.status(400).json({
            error:'content missing'
        })
    }

    if(!persons.find(person=> person.name === body.name)){
        return response.status(406).json({
            error:'the person is already in the phonebook'
        })
    }

    const person = {
        name:body.name,
        number:body.number,
        id:generateId()
    }
    persons = persons.concat(person)
    response.json(person)
})

const PORT = 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})