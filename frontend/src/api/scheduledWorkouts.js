import client from './client'

export function getMySchedule() {
    return client.get('/scheduled-workouts').then((res) => res.data)
}

export function createScheduledWorkout(exerciseId, dayOfWeek, targetSets, targetReps, targetWeightKg) {
    return client
        .post('/scheduled-workouts', { exerciseId, dayOfWeek, targetSets, targetReps, targetWeightKg })
        .then((res) => res.data)
}

export function deleteScheduledWorkout(id) {
    return client.delete(`/scheduled-workouts/${id}`)
}