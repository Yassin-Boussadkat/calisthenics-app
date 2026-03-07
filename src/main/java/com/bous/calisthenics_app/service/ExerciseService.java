package com.bous.calisthenics_app.service;

import com.bous.calisthenics_app.entity.DifficultyLevel;
import com.bous.calisthenics_app.entity.Exercise;
import com.bous.calisthenics_app.entity.ExerciseType;
import com.bous.calisthenics_app.entity.MuscleGroup;
import com.bous.calisthenics_app.repository.ExerciseRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ExerciseService {

    private final ExerciseRepository exerciseRepository;

    public ExerciseService(ExerciseRepository exerciseRepository) {
        this.exerciseRepository = exerciseRepository;
    }

    public List<Exercise> findAll(){
        return exerciseRepository.findAll();
    }

    public Exercise findById(Long id){
        return exerciseRepository.findById(id).orElseThrow(() -> new RuntimeException("Exercise not found."));
    }

    public Exercise save(Exercise exercise){
         return exerciseRepository.save(exercise);
    }

    public void deleteById(Long id){
        exerciseRepository.deleteById(id);
    }

    public Exercise update(Long id, Exercise exercise){
         if(!exerciseRepository.findById(id).isPresent()){
             throw new RuntimeException("Exercise not found.");
         }
         exercise.setId(id);
         return exerciseRepository.save(exercise);
    }

    public List<Exercise> findByDifficultyLevel(DifficultyLevel difficultyLevel) {
        return exerciseRepository.findByDifficultyLevel(difficultyLevel);
    }

    public List<Exercise> findByName(String name){
        return exerciseRepository.findByNameContainingIgnoreCase(name);
    }

    public List<Exercise> findByMuscleGroupsContaining(MuscleGroup muscleGroup){
        return exerciseRepository.findByMuscleGroupsContaining(muscleGroup);
    }

    public List<Exercise> findByExerciseType(ExerciseType exerciseType){
        return exerciseRepository.findByExerciseType(exerciseType);
    }
}
