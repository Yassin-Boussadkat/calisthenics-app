package com.bous.calisthenics_app.service;

import com.bous.calisthenics_app.dto.ScheduledWorkoutRequest;
import com.bous.calisthenics_app.entity.Exercise;
import com.bous.calisthenics_app.entity.ScheduledWorkout;
import com.bous.calisthenics_app.entity.User;
import com.bous.calisthenics_app.exception.ResourceNotFoundException;
import com.bous.calisthenics_app.repository.ExerciseRepository;
import com.bous.calisthenics_app.repository.ScheduledWorkoutRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class ScheduledWorkoutService {

    private final ScheduledWorkoutRepository scheduledWorkoutRepository;
    private final ExerciseRepository exerciseRepository;

    public ScheduledWorkout save(ScheduledWorkoutRequest request, User currentUser) {
        Exercise exercise = exerciseRepository.findById(request.getExerciseId())
                .orElseThrow(() -> new ResourceNotFoundException("Exercise not found"));

        ScheduledWorkout scheduled = new ScheduledWorkout();
        scheduled.setUser(currentUser);
        scheduled.setExercise(exercise);
        scheduled.setDayOfWeek(request.getDayOfWeek());
        scheduled.setTargetSets(request.getTargetSets());
        scheduled.setTargetReps(request.getTargetReps());

        return scheduledWorkoutRepository.save(scheduled);
    }

    public List<ScheduledWorkout> findMine(User currentUser) {
        return scheduledWorkoutRepository.findByUserId(currentUser.getId());
    }

    public void  deleteById(Long id, User currentUser) {
        ScheduledWorkout scheduled = scheduledWorkoutRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("ScheduledWorkout not found."));

        boolean isOwner = scheduled.getUser().getId().equals(currentUser.getId());
        if (!isOwner) {
            throw new AccessDeniedException("Je hebt geen toegang tot dit schema-item.");
        }

        scheduledWorkoutRepository.deleteById(id);
    }
}
