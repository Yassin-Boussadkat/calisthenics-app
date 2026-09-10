package com.bous.calisthenics_app.service;

import com.bous.calisthenics_app.dto.TrainingSchemeRequest;
import com.bous.calisthenics_app.entity.DifficultyLevel;
import com.bous.calisthenics_app.entity.Exercise;
import com.bous.calisthenics_app.entity.ExerciseType;
import com.bous.calisthenics_app.entity.TrainingScheme;
import com.bous.calisthenics_app.exception.ResourceNotFoundException;
import com.bous.calisthenics_app.repository.ExerciseRepository;
import com.bous.calisthenics_app.repository.TrainingSchemeRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class TrainingSchemeService {

    private final TrainingSchemeRepository trainingSchemeRepository;
    private final ExerciseRepository exerciseRepository;

    public TrainingSchemeService(TrainingSchemeRepository trainingSchemeRepository,
                                 ExerciseRepository exerciseRepository) {
        this.trainingSchemeRepository = trainingSchemeRepository;
        this.exerciseRepository = exerciseRepository;
    }

    public List<TrainingScheme> findAll() {
        return trainingSchemeRepository.findAll();
    }

    public List<TrainingScheme> findByExerciseType(ExerciseType exerciseType) {
        return trainingSchemeRepository.findByExerciseType(exerciseType);
    }

    public TrainingScheme findById(Long id) {
        return trainingSchemeRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("No TrainingScheme found with id " + id));
    }

    public TrainingScheme save(TrainingSchemeRequest request) {
        TrainingScheme scheme = new TrainingScheme();
        applyRequest(scheme, request);
        return trainingSchemeRepository.save(scheme);
    }

    public void delete(Long id) {
        findById(id);
        trainingSchemeRepository.deleteById(id);
    }

    public List<TrainingScheme> findByName(String name) {
        return trainingSchemeRepository.findByNameContainingIgnoreCase(name);
    }

    public List<TrainingScheme> findByDifficultyLevel(DifficultyLevel difficultyLevel) {
        return trainingSchemeRepository.findByDifficultyLevel(difficultyLevel);
    }

    public TrainingScheme update(Long id, TrainingSchemeRequest request) {
        TrainingScheme existing = findById(id);
        applyRequest(existing, request);
        return trainingSchemeRepository.save(existing);
    }

    private void applyRequest(TrainingScheme scheme, TrainingSchemeRequest request) {
        List<Exercise> exercises = exerciseRepository.findAllById(request.getExerciseIds());

        scheme.setName(request.getName());
        scheme.setDifficultyLevel(request.getDifficultyLevel());
        scheme.setExerciseType(request.getExerciseType());
        scheme.setExercises(exercises);
    }
}