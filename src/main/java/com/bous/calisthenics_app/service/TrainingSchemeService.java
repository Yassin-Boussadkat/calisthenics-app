package com.bous.calisthenics_app.service;

import com.bous.calisthenics_app.entity.DifficultyLevel;
import com.bous.calisthenics_app.entity.ExerciseType;
import com.bous.calisthenics_app.entity.TrainingScheme;
import com.bous.calisthenics_app.repository.TrainingSchemeRepository;
import org.springframework.stereotype.Service;

import java.io.DataInput;
import java.util.List;

@Service
public class TrainingSchemeService {

    private final TrainingSchemeRepository trainingSchemeRepository;

    public TrainingSchemeService(TrainingSchemeRepository trainingSchemeRepository) {
        this.trainingSchemeRepository = trainingSchemeRepository;
    }

    public List<TrainingScheme> findAll() {
        return trainingSchemeRepository.findAll();
    }

    public List<TrainingScheme> findByExerciseType(ExerciseType exerciseType) {
        return trainingSchemeRepository.findByExerciseType(exerciseType);
    }

    public TrainingScheme findById(Long id){
        return trainingSchemeRepository.findById(id).orElseThrow(() -> new RuntimeException("No TrainingScheme found with id " + id));
    }

    public TrainingScheme save(TrainingScheme trainingScheme) {
        return trainingSchemeRepository.save(trainingScheme);
    }

    public void delete(Long id){
        trainingSchemeRepository.deleteById(id);
    }

    public List<TrainingScheme> findByName(String name){
        return trainingSchemeRepository.findByNameContainingIgnoreCase(name);
    }

    public List<TrainingScheme> findByDifficultyLevel(DifficultyLevel difficultyLevel){
        return trainingSchemeRepository.findByDifficultyLevel(difficultyLevel);
    }

    public TrainingScheme update(Long id, TrainingScheme trainingScheme) {
        trainingSchemeRepository.findById(id).orElseThrow(() -> new RuntimeException("No TrainingScheme found with id " + id));
        trainingScheme.setId(id);
        return trainingSchemeRepository.save(trainingScheme);
    }

}
