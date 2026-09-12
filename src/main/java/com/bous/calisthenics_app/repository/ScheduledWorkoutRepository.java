package com.bous.calisthenics_app.repository;

import com.bous.calisthenics_app.entity.ScheduledWorkout;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ScheduledWorkoutRepository extends JpaRepository<ScheduledWorkout, Long> {
    List<ScheduledWorkout> findByUserId(Long userId);
}

