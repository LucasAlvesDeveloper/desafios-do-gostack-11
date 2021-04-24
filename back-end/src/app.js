const express = require("express")
const cors = require("cors")
const { v4: uuid, validate: isUuid } = require('uuid');

const app = express()

app.use(express.json())
app.use(cors())

const repositories = [
    {
        id: uuid(),
        title: 'Nome qualquer',
        url: 'https://www.dominiopublico.com.br/',
        techs: ['ReactJS', 'NodeJS'],
        likes: 123
    }
]

function validateProjectId(request, response, next) {
    const { id } = request.params

    if (!isUuid(id)) {
        return response.status(400).json({ error: 'Invalid Project Id' })
    }

    return next()
}

app.use('/repositories/:id', validateProjectId)

app.get("/repositories", (request, response) => {
    const { title } = request.query

    const results = title
        ? repositories.filter(repository => repository.title.includes(title))
        : repositories

    return response.json(results)
})

app.post("/repositories", (request, response) => {
    /* 
    Estrutura do JSON:
        {
            id: iofehiwo,
            title: 'Nome qualquer',
            url: 'https://www.dominiopublico.com.br/',
            techs: ['ReactJS', 'NodeJS']
            likes: 123
        }
    */

    const { title, url, techs } = request.body

    const repository = { id: uuid(), title, url, techs, likes: 0 }

    console.log(repository)

    repositories.push(repository)

    return response.json(repository)
})

app.put("/repositories/:id", (request, response) => {
    const { id } = request.params
    const { title, url, techs } = request.body

    const repositoryIndex = repositories.findIndex(repo => repo.id === id)

    if (repositoryIndex === -1) return response.status(400).json({ error: 'Repository not Found' })

    const repository = repositories[repositoryIndex]

    if (title) {repository.title = title}
    if (url) {repository.url = url}
    if (techs) {repository.techs = techs}

    return response.json(repository)
})

app.delete("/repositories/:id", (request, response) => {
    const { id } = request.params

    const repositoryIndex = repositories.findIndex(repo => repo.id === id)

    if (repositoryIndex === -1) return response.status(400).json({ error: 'Repository not Found' })

    repositories.splice(repositoryIndex, 1)

    return response.status(204).send()
})

app.post("/repositories/:id/like", (request, response) => {
    const { id } = request.params

    const repositoryIndex = repositories.findIndex(repo => repo.id === id)

    if (repositoryIndex === -1) return response.status(400).json({ error: 'Repository not Found' })

    const repository = repositories[repositoryIndex]

    repository.likes += 1

    return response.json(repository)
})

module.exports = app
