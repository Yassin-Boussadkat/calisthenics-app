package com.bous.calisthenics_app.controller;

import com.bous.calisthenics_app.entity.WorkoutLog;
import com.bous.calisthenics_app.service.WorkoutLogService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/workout-logs")
@RequiredArgsConstructor
public class WorkoutLogController {

    private final WorkoutLogService workoutLogService;

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

    @PostMapping
    public ResponseEntity<WorkoutLog> save(@RequestBody WorkoutLog workoutLog) {
        return ResponseEntity.status(201).body(workoutLogService.save(workoutLog));
    }

    @PutMapping("/{id}")
    public ResponseEntity<WorkoutLog> update(
            @PathVariable Long id,
            @RequestBody WorkoutLog workoutLog) {

        return ResponseEntity.ok(workoutLogService.update(id, workoutLog));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        workoutLogService.deleteById(id);
        return ResponseEntity.noContent().build();
    }
}
