package com.bous.calisthenics_app.controller;

import com.bous.calisthenics_app.entity.WorkoutLog;
import com.bous.calisthenics_app.service.WorkoutLogService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/workoutlogs")
@RequiredArgsConstructor
public class WorkoutLogController {

    private final WorkoutLogService workoutLogService;

    @GetMapping("/user/{userId}")
    public ResponseEntity<List<WorkoutLog>> getLogsByUser(@PathVariable int userId) {
        return ResponseEntity.ok(workoutLogService.getLogsByUser(userId));
    }

    @GetMapping("/user/{userId}/exercise/{exerciseId}")
    public ResponseEntity<List<WorkoutLog>> getLogsByUserAndExercise(
            @PathVariable int userId,
            @PathVariable Long exerciseId) {
        return ResponseEntity.ok(workoutLogService.getLogsByUserAndExercise(userId, exerciseId));
    }

    @PostMapping
    public ResponseEntity<WorkoutLog> save(@RequestBody WorkoutLog workoutLog) {
        return ResponseEntity.status(201).body(workoutLogService.save(workoutLog));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        workoutLogService.deleteById(id);
        return ResponseEntity.noContent().build();
    }
}
