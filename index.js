const express = require('express')
const app = express()

const cors = require('cors')
app.use(cors())

app.use(express.static('build'))

// data
let persons = [
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

// json-parser middleware
app.use(express.json())

// request logger middleware
const morgan = require('morgan')
morgan.token('body', (req, res) => {return JSON.stringify(req.body)})
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :body'))

// home page
app.get('/', (request, response) => {
    response.send('<h1>Phonebook</h1>')
})

// persons api
app.get('/api/persons', (request, response) => {
    response.json(persons)
})

app.get('/api/persons/:id', (request, response) => {
    const id = Number(request.params.id)
    const person = persons.find(p => p.id === id)

    if (person) {
        response.json(person)
    } else {
        response.status(404).end()
    }
})

// delete person
app.delete('/api/persons/:id', (request, response) => {
    const id = Number(request.params.id)
    persons = persons.filter(p => p.id !== id)
    response.status(204).end()
})

// post person
app.post('/api/persons', (request, response) => {
    const body = request.body

    if (!body.name || !body.number) {
        return response.status(400).json({error: 'content missing'})
    }

    if (persons.find(p => p.name === body.name)) {
        return response.status(400).json({error: 'name must be unique'})
    }

    const person = {
        name: body.name, 
        number: body.number,
        date: new Date(),
        id: Math.floor(Math.random()* 9876543210),
    }
    
    persons = persons.concat(person)
    response.json(person)
})

// info page
app.get('/info', (request, response) => {
    const nbPersons = persons.length
    const date = new Date()
    response.send(
        `<p>Phonebook has info for ${nbPersons} people</p>
        <p>${date}</p>`, 
    )
})

// endpoint error message middleware
const unknownEndpoint = (request, response) => {
    response.status(404).send({ error: 'unknown endpoint' })
}
  
app.use(unknownEndpoint)


// port
const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})