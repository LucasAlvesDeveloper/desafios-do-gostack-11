const express = require('express')
const app = express()
const cors = require('cors')
const { v4: uuid, validate: isUuid } = require('uuid')

app.use(express.json())
app.use(cors())

const repositories = []
const num = 0

app.get('/repositories', (req, res) => {
    return res.json(repositories)
})

app.post('/repositories', (req, res) => {
    const repo = {
        id: uuid(),
        ...req.body
    }

    repositories.push(repo)

    return res.json(repo)
})

app.delete('/repositories/:id', (req, res) => {
    const { id } = req.params

    const repoIndex = repositories.findIndex(repository => repository.id === id)

    if (repoIndex === -1) return res.status(404).json({ error: 'Repository not found' })

    repositories.splice(repoIndex, 1)

    return res.status(204).send()
})