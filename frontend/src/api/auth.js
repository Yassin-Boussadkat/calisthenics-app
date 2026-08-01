import client from './client'

export function login(email, password) {
    return client.post('/auth/login', { email, password }).then((res) => res.data)
}

export function register(firstName, lastName, email, password) {
    return client
        .post('/auth/register', { firstName, lastName, email, password })
        .then((res) => res.data)
}