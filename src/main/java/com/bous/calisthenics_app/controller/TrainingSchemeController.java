package com.bous.calisthenics_app.controller;

import com.bous.calisthenics_app.entity.DifficultyLevel;
import com.bous.calisthenics_app.entity.ExerciseType;
import com.bous.calisthenics_app.entity.TrainingScheme;
import com.bous.calisthenics_app.service.TrainingSchemeService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/workouts")
public class TrainingSchemeController {

    private final TrainingSchemeService trainingSchemeService;

    public TrainingSchemeController(TrainingSchemeService trainingSchemeService) {
        this.trainingSchemeService = trainingSchemeService;
    }

    @GetMapping
    public ResponseEntity<List<TrainingScheme>> findAll(
            @RequestParam(required = false) DifficultyLevel  difficultyLevel,
            @RequestParam(required = false) ExerciseType type,
            @RequestParam(required = false) String name) {
        if (name != null) return ResponseEntity.ok(trainingSchemeService.findByName(name));
        if(type != null) return ResponseEntity.ok(trainingSchemeService.findByExerciseType(type));
        if(difficultyLevel != null) return ResponseEntity.ok(trainingSchemeService.findByDifficultyLevel(difficultyLevel));
        return ResponseEntity.ok(trainingSchemeService.findAll());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteById(@PathVariable Long id) {
        trainingSchemeService.delete(id);
        return ResponseEntity.noContent().build();
    }

    @PostMapping
    public ResponseEntity<TrainingScheme> save(@RequestBody TrainingScheme trainingScheme) {
        return ResponseEntity.status(HttpStatus.CREATED).body(trainingSchemeService.save(trainingScheme));
    }

    @PutMapping("/{id}")
    public ResponseEntity<TrainingScheme> update(@PathVariable Long id, @RequestBody TrainingScheme trainingScheme) {
        return ResponseEntity.ok(trainingSchemeService.update(id, trainingScheme));
    }


}
