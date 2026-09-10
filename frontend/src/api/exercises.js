import client from './client'

export function getExercises() {
    return client.get('/exercises').then((res) => res.data)
}

export function createExercise(exercise) {
    return client.post('/exercises', exercise).then((res) => res.data)
}

export function deleteExercise(id) {
    return client.delete(`/exercises/${id}`)
}