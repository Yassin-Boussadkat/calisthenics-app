import client from './client'

export function getMyLogs() {
    return client.get('/workout-logs').then((res) => res.data)
}

export function createLog(log) {
    return client.post('/workout-logs', log).then((res) => res.data)
}

export function deleteLog(id) {
    return client.delete(`/workout-logs/${id}`)
}