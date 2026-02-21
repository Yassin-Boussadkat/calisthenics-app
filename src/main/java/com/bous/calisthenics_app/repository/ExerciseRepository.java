package com.bous.calisthenics_app.repository;

import com.bous.calisthenics_app.entity.DifficultyLevel;
import com.bous.calisthenics_app.entity.Exercise;
import com.bous.calisthenics_app.entity.ExerciseType;
import com.bous.calisthenics_app.entity.MuscleGroup;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

interface ExerciseRepository extends JpaRepository<Exercise, Long> {



    List<Exercise> findByDifficultyLevel(DifficultyLevel difficultyLevel);
    List<Exercise> findByNameContainingIgnoreCase(String name);
    List<Exercise> findByMuscleGroupsContaining(MuscleGroup muscleGroup);
    List<Exercise> findByExerciseType(ExerciseType exerciseType);

}
