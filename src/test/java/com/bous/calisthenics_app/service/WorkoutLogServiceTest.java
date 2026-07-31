package com.bous.calisthenics_app.service;

import com.bous.calisthenics_app.dto.WorkoutLogRequest;
import com.bous.calisthenics_app.entity.*;
import com.bous.calisthenics_app.exception.ResourceNotFoundException;
import com.bous.calisthenics_app.repository.ExerciseRepository;
import com.bous.calisthenics_app.repository.WorkoutLogRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.access.AccessDeniedException;

import java.time.LocalDate;
import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class WorkoutLogServiceTest {

    @Mock
    private WorkoutLogRepository workoutLogRepository;

    @Mock
    private ExerciseRepository exerciseRepository;

    @InjectMocks
    private WorkoutLogService workoutLogService;

    private User owner;
    private User otherUser;
    private User admin;
    private WorkoutLog log;
    private Exercise exercise;

    @BeforeEach
    void setUp() {
        owner = new User();
        owner.setId(1L);
        owner.setRole(Role.USER);

        otherUser = new User();
        otherUser.setId(2L);
        otherUser.setRole(Role.USER);

        admin = new User();
        admin.setId(3L);
        admin.setRole(Role.ADMIN);

        exercise = new Exercise();
        exercise.setId(10L);

        log = new WorkoutLog();
        log.setId(100L);
        log.setUser(owner);
        log.setExercise(exercise);
    }

    @Test
    void findById_ownerCanAccessTheirOwnLog() {
        when(workoutLogRepository.findById(100L)).thenReturn(Optional.of(log));

        WorkoutLog result = workoutLogService.findById(100L, owner);

        assertThat(result).isEqualTo(log);
    }

    @Test
    void findById_adminCanAccessAnyLog() {
        when(workoutLogRepository.findById(100L)).thenReturn(Optional.of(log));

        WorkoutLog result = workoutLogService.findById(100L, admin);

        assertThat(result).isEqualTo(log);
    }

    @Test
    void findById_otherUserCannotAccessSomeoneElsesLog() {
        when(workoutLogRepository.findById(100L)).thenReturn(Optional.of(log));

        assertThatThrownBy(() -> workoutLogService.findById(100L, otherUser))
                .isInstanceOf(AccessDeniedException.class);
    }

    @Test
    void findById_throwsResourceNotFoundWhenLogDoesNotExist() {
        when(workoutLogRepository.findById(999L)).thenReturn(Optional.empty());

        assertThatThrownBy(() -> workoutLogService.findById(999L, owner))
                .isInstanceOf(ResourceNotFoundException.class);
    }

    @Test
    void update_ownerCanUpdateTheirOwnLogWithoutChangingOwner() {
        WorkoutLogRequest request = new WorkoutLogRequest();
        request.setExerciseId(10L);
        request.setDate(LocalDate.of(2026, 7, 30));
        request.setSets(4);
        request.setReps(12);
        request.setWeightInKg(20.0);

        when(workoutLogRepository.findById(100L)).thenReturn(Optional.of(log));
        when(exerciseRepository.findById(10L)).thenReturn(Optional.of(exercise));
        when(workoutLogRepository.save(any(WorkoutLog.class))).thenAnswer(invocation -> invocation.getArgument(0));

        WorkoutLog result = workoutLogService.update(100L, request, owner);

        assertThat(result.getSets()).isEqualTo(4);
        assertThat(result.getUser()).isEqualTo(owner);
    }

    @Test
    void update_adminUpdatingSomeoneElsesLogDoesNotChangeOwner() {
        WorkoutLogRequest request = new WorkoutLogRequest();
        request.setExerciseId(10L);
        request.setDate(LocalDate.of(2026, 7, 30));
        request.setSets(5);
        request.setReps(8);
        request.setWeightInKg(25.0);

        when(workoutLogRepository.findById(100L)).thenReturn(Optional.of(log));
        when(exerciseRepository.findById(10L)).thenReturn(Optional.of(exercise));
        when(workoutLogRepository.save(any(WorkoutLog.class))).thenAnswer(invocation -> invocation.getArgument(0));

        WorkoutLog result = workoutLogService.update(100L, request, admin);

        // De eigenaar moet de oorspronkelijke owner blijven, niet de admin die de edit uitvoert
        assertThat(result.getUser()).isEqualTo(owner);
    }

    @Test
    void deleteById_otherUserCannotDeleteSomeoneElsesLog() {
        when(workoutLogRepository.findById(100L)).thenReturn(Optional.of(log));

        assertThatThrownBy(() -> workoutLogService.deleteById(100L, otherUser))
                .isInstanceOf(AccessDeniedException.class);
    }
}