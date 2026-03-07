package com.bous.calisthenics_app.controller;

import com.bous.calisthenics_app.entity.DifficultyLevel;
import com.bous.calisthenics_app.entity.Exercise;
import com.bous.calisthenics_app.entity.ExerciseType;
import com.bous.calisthenics_app.entity.MuscleGroup;
import com.bous.calisthenics_app.service.ExerciseService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
@RequestMapping("/api/exercises")
@RestController
public class ExerciseController {

    private final ExerciseService exerciseService;

    public ExerciseController(ExerciseService exerciseService) {
        this.exerciseService = exerciseService;
    }

    @PostMapping
    public ResponseEntity<Exercise> save(@RequestBody Exercise exercise){
         Exercise savedExercise = exerciseService.save(exercise);
         return ResponseEntity.status(HttpStatus.CREATED).body(savedExercise);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id){
        exerciseService.deleteById(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/{id}")
    public ResponseEntity<Exercise> findById(@PathVariable Long id){
        return ResponseEntity.ok(exerciseService.findById(id));
    }

    @PutMapping("/{id}")
    public ResponseEntity<Exercise> update(@PathVariable Long id, @RequestBody Exercise exercise){
        return ResponseEntity.ok(exerciseService.update(id, exercise));
    }

    @GetMapping()
    public ResponseEntity<List<Exercise>> findAll(@RequestParam(value = "name", required = false) String name,
                                                  @RequestParam(value = "difficulty", required = false) DifficultyLevel difficultyLevel,
                                                  @RequestParam(value = "type",required = false) ExerciseType exerciseType,
                                                  @RequestParam(value = "musclegroup", required = false) MuscleGroup muscleGroup){

        if(name != null) return ResponseEntity.ok(exerciseService.findByName(name));
        if(difficultyLevel != null) return ResponseEntity.ok(exerciseService.findByDifficultyLevel(difficultyLevel));
        if(exerciseType != null) return ResponseEntity.ok(exerciseService.findByExerciseType(exerciseType));
        if(muscleGroup != null) return ResponseEntity.ok(exerciseService.findByMuscleGroupsContaining(muscleGroup));
        return ResponseEntity.ok(exerciseService.findAll());
    }

}
