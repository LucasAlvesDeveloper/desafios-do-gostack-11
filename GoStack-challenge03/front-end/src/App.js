import React, { useState, useEffect } from "react"

import api from './services/api'

import "./styles.css"

function App() {
    const [ repositories, setRepositories ] = useState([])

    useEffect(() => {
        api.get('/repositories')
            .then(response => setRepositories(response.data))
            .catch(err => console.error(err))
    }, [])

    async function handleAddRepository() {
        const response = await api.post('/repositories', {
            title: `Novo repositório ${Date.now().toLocaleString('pt-BR')}`,
            owner: 'Lucas Alves'
        })

        const repository = response.data

        setRepositories([...repositories, repository])
    }

    async function handleRemoveRepository(id) {
        const result = await api.delete(`/repositories/${id}`)

        const newRepoList = repositories.filter(repo => repo.id !== id)

        setRepositories([...newRepoList])
    }

    return (
        <div>
            <ul data-testid="repository-list">
                {
                    repositories.map((repo, index) => (
                        <li key={repo.id}>
                            Repositório {index + 1}

                            <p>{repo.title}</p>

                            <button onClick={() => handleRemoveRepository(repo.id)}>
                                Remover
                            </button>
                        </li>
                    ))
                }
            </ul>

            <button onClick={handleAddRepository}>Adicionar</button>
        </div>
    )
}

export default App;
