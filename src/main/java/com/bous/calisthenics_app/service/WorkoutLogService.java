package com.bous.calisthenics_app.service;

import com.bous.calisthenics_app.entity.WorkoutLog;
import com.bous.calisthenics_app.repository.WorkoutLogRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
@RequiredArgsConstructor
public class WorkoutLogService {

    private final WorkoutLogRepository workoutLogRepository;

    public WorkoutLog save(WorkoutLog workoutLog) {
        return workoutLogRepository.save(workoutLog);
    }

    public List<WorkoutLog> getLogsByUser(int userId) {
        return workoutLogRepository.findByUserId(userId);
    }

    public List<WorkoutLog> getLogsByUserAndExercise(int userId, Long exerciseId) {
        return workoutLogRepository.findByUserIdAndExerciseId(userId, exerciseId);
    }

    public void deleteById(Long id) {
        workoutLogRepository.deleteById(id);
    }
}
