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

    public List<WorkoutLog> findAll() {
        return workoutLogRepository.findAll();
    }

    public WorkoutLog findById(Long id) {
        return workoutLogRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("WorkoutLog not found."));
    }

    public List<WorkoutLog> getLogsByUser(Long userId) {
        return workoutLogRepository.findByUserId(userId);
    }

    public List<WorkoutLog> getLogsByUserAndExercise(Long userId, Long exerciseId) {
        return workoutLogRepository.findByUserIdAndExerciseId(userId, exerciseId);
    }

    public WorkoutLog update(Long id, WorkoutLog workoutLog) {
        workoutLogRepository.findById(id).orElseThrow(() -> new RuntimeException("WorkoutLog not found."));
        workoutLog.setId(id);
        return workoutLogRepository.save(workoutLog);
    }

    public void deleteById(Long id) {
        workoutLogRepository.deleteById(id);
    }
}