package com.bous.calisthenics_app.repository;

import com.bous.calisthenics_app.entity.DifficultyLevel;
import com.bous.calisthenics_app.entity.ExerciseType;
import com.bous.calisthenics_app.entity.TrainingScheme;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface TrainingSchemeRepository extends JpaRepository<TrainingScheme, Long> {

    List<TrainingScheme> findByNameContainingIgnoreCase(String name);
    List<TrainingScheme> findByDifficultyLevel(DifficultyLevel difficultyLevel);
    List<TrainingScheme> findByExerciseType(ExerciseType exerciseType);

}
