import client from './client'

export function getSchemes(difficultyLevel) {
    const params = difficultyLevel ? { difficultyLevel } : {}
    return client.get('/workouts', { params }).then((res) => res.data)
}

export function createScheme(scheme) {
    return client.post('/workouts', scheme).then((res) => res.data)
}

export function deleteScheme(id) {
    return client.delete(`/workouts/${id}`)
}
