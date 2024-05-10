const morgan = require('morgan')
const express = require('express')
const app = express()

app.use(express.json())
morgan(app)

let phonebook = [
    {
        id: 1,
        name: "Arto Hellas",
        number: "040-12456",
    },
    {
        id: 2,
        name: "Dan Abramov",
        number: "12-43-234345",
    },
    {
        id: 3,
        name: "Arto Hellas",
        number: "39-23-6423122",
    }
]

morgan.token('content', function (request, repsonse) { 
    return request.content
})

app.use(assignContent)
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :content'))


function assignContent(req, res, next) {
    if (req.method === "POST") {
        req.content = JSON.stringify(req.body);
    }
    next();
  }

app.get('/', (request, response) => {
    response.send('<h1>Hi, you have reached my phonebook api</h1>')
})

app.get('/api/persons', (request, response) => {
    response.json(phonebook)
})

app.get('/api/info', (request, response) => {
    response.send(`<p>Phonebook has info for ${phonebook.length} people</p><br>${new Date()}`)
})

app.get('/api/persons/:id', (request, response) => {
    const id = Number(request.params.id)
    const person = phonebook.find(person => person.id === id)

    if(person){
        response.json(person)
    }else{
        response.status(404).end()
    }
})

app.delete('/api/persons/:id', (request, response) => {
    const id = Number(request.params.id)
    phonebook = phonebook.filter(person => person.id !== id)

    response.status(204).end()
})

app.post('/api/persons', (request, response) => {
    const maxId = Math.floor(Math.random() * 100)
    const person = request.body

    if (!person.name) {
        return response.status(400).json({ 
          error: 'name missing' 
        })
    }else if(phonebook.find(added => added.name === person.name)){
        return response.status(400).json({ 
            error: 'name must be unique' 
          })
    }

    if (!person.number) {
        return response.status(400).json({ 
          error: 'number missing' 
        })
    }

    person.id = maxId

    phonebook = phonebook.concat(person)

    response.json(person)
})




const unknownEndpoint = (request, response) => {
    response.status(404).send({ error: 'unknown endpoint' })
}

app.use(unknownEndpoint)

const PORT = 3001
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})


