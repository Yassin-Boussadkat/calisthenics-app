package com.bous.calisthenics_app.service;

import com.bous.calisthenics_app.dto.WorkoutLogRequest;
import com.bous.calisthenics_app.entity.Exercise;
import com.bous.calisthenics_app.entity.User;
import com.bous.calisthenics_app.entity.WorkoutLog;
import com.bous.calisthenics_app.exception.ResourceNotFoundException;
import com.bous.calisthenics_app.repository.ExerciseRepository;
import com.bous.calisthenics_app.repository.WorkoutLogRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
@RequiredArgsConstructor
public class WorkoutLogService {

    private final WorkoutLogRepository workoutLogRepository;
    private final ExerciseRepository exerciseRepository;

    public WorkoutLog save(WorkoutLogRequest workoutLog, User currentUser) {
        Exercise exercise = exerciseRepository.findById(workoutLog.getExerciseId())
                .orElseThrow(() -> new ResourceNotFoundException("Exercise not found"));

        WorkoutLog workoutLogEntity = new WorkoutLog();
        workoutLogEntity.setUser(currentUser);
        workoutLogEntity.setExercise(exercise);
        workoutLogEntity.setDate(workoutLog.getDate());
        workoutLogEntity.setSets(workoutLog.getSets());
        workoutLogEntity.setReps(workoutLog.getReps());
        workoutLogEntity.setWeightInKg(workoutLog.getWeightInKg());
        workoutLogEntity.setNotes(workoutLog.getNotes());

        return workoutLogRepository.save(workoutLogEntity);
    }

    public List<WorkoutLog> findMine(Long exerciseId, User currentUser) {
        if(exerciseId == null) {
            return workoutLogRepository.findByUserId(currentUser.getId());
        }

        return workoutLogRepository.findByUserIdAndExerciseId(currentUser.getId(), exerciseId);

    }

    public WorkoutLog findById(Long id, User currentUser) {

        WorkoutLog log = workoutLogRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("WorkoutLog not found."));
        checkOwnership(log, currentUser);
        return log;
    }

    public WorkoutLog update(Long id, WorkoutLogRequest workoutLog, User currentUser) {
        WorkoutLog log = findById(id, currentUser);

        Exercise exercise = exerciseRepository.findById(workoutLog.getExerciseId())
                .orElseThrow(() -> new ResourceNotFoundException("Exercise not found"));

        log.setExercise(exercise);
        log.setDate(workoutLog.getDate());
        log.setSets(workoutLog.getSets());
        log.setReps(workoutLog.getReps());
        log.setWeightInKg(workoutLog.getWeightInKg());
        log.setNotes(workoutLog.getNotes());

        return workoutLogRepository.save(log);
    }

    public void deleteById(Long id, User currentUser) {
        findById(id, currentUser);
        workoutLogRepository.deleteById(id);
    }

    private void checkOwnership(WorkoutLog workoutLog, User currentUser) {
        boolean isOwner = workoutLog.getUser().getId().equals(currentUser.getId());
        boolean isAdmin = currentUser.getAuthorities().stream()
                .anyMatch(a -> a.getAuthority().equals("ROLE_ADMIN"));
        if(!isOwner && !isAdmin)
            throw new AccessDeniedException("Je hebt geen toegang tot deze workout log.");
    }
}