package com.bous.calisthenics_app.controller;

import com.bous.calisthenics_app.dto.WorkoutLogRequest;
import com.bous.calisthenics_app.entity.User;
import com.bous.calisthenics_app.entity.WorkoutLog;
import com.bous.calisthenics_app.service.WorkoutLogService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
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
    public ResponseEntity<WorkoutLog> save(@Valid @RequestBody WorkoutLogRequest workoutLog,
                                           @AuthenticationPrincipal User currentUser) {
        WorkoutLog saved = workoutLogService.save(workoutLog, currentUser);
        return ResponseEntity.status(HttpStatus.CREATED).body(saved);
    }

    @GetMapping("/{id}")
    public ResponseEntity<WorkoutLog> findById(@PathVariable Long id, @AuthenticationPrincipal User currentUser) {
        return ResponseEntity.ok(workoutLogService.findById(id, currentUser));
    }

    @PutMapping("/{id}")
    public ResponseEntity<WorkoutLog> update(@PathVariable Long id,
                                             @Valid @RequestBody WorkoutLogRequest workoutLog,
                                             @AuthenticationPrincipal User currentUser) {
        return ResponseEntity.ok(workoutLogService.update(id, workoutLog, currentUser));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteById(@PathVariable Long id, @AuthenticationPrincipal User currentUser) {
        workoutLogService.deleteById(id, currentUser);
        return ResponseEntity.noContent().build();
    }

    @GetMapping
    public ResponseEntity<List<WorkoutLog>> findAll(
            @RequestParam(required = false) Long exerciseId,
            @AuthenticationPrincipal User currentUser) {

        return ResponseEntity.ok(workoutLogService.findMine(exerciseId,currentUser));
    }
}