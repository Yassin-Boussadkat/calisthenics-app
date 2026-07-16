package com.bous.calisthenics_app.controller;

import com.bous.calisthenics_app.entity.WorkoutLog;
import com.bous.calisthenics_app.service.WorkoutLogService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/workout-logs")
public class WorkoutLogController {

    private final WorkoutLogService workoutLogService;

    public WorkoutLogController(WorkoutLogService workoutLogService) {
        this.workoutLogService = workoutLogService;
    }

    @PostMapping
    public ResponseEntity<WorkoutLog> save(@Valid @RequestBody WorkoutLog workoutLog) {
        WorkoutLog saved = workoutLogService.save(workoutLog);
        return ResponseEntity.status(HttpStatus.CREATED).body(saved);
    }

    @GetMapping("/{id}")
    public ResponseEntity<WorkoutLog> findById(@PathVariable Long id) {
        return ResponseEntity.ok(workoutLogService.findById(id));
    }

    @PutMapping("/{id}")
    public ResponseEntity<WorkoutLog> update(@PathVariable Long id, @Valid @RequestBody WorkoutLog workoutLog) {
        return ResponseEntity.ok(workoutLogService.update(id, workoutLog));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteById(@PathVariable Long id) {
        workoutLogService.deleteById(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping
    public ResponseEntity<List<WorkoutLog>> findAll(
            @RequestParam(required = false) Long userId,
            @RequestParam(required = false) Long exerciseId) {

        if (userId != null && exerciseId != null) {
            return ResponseEntity.ok(workoutLogService.getLogsByUserAndExercise(userId, exerciseId));
        }
        if (userId != null) {
            return ResponseEntity.ok(workoutLogService.getLogsByUser(userId));
        }
        return ResponseEntity.ok(workoutLogService.findAll());
    }
}