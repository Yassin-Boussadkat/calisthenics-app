package com.bous.calisthenics_app.repository;

import com.bous.calisthenics_app.entity.WorkoutLog;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface WorkoutLogRepository extends JpaRepository<WorkoutLog, Long> {
    List<WorkoutLog> findByUserId(int userId);
    List<WorkoutLog> findByUserIdAndExerciseId(int userId, Long exerciseId);
}
