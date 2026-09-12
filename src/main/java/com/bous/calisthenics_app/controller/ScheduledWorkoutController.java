package com.bous.calisthenics_app.controller;

import com.bous.calisthenics_app.dto.ScheduledWorkoutRequest;
import com.bous.calisthenics_app.entity.ScheduledWorkout;
import com.bous.calisthenics_app.entity.User;
import com.bous.calisthenics_app.service.ScheduledWorkoutService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/scheduled-workouts")
public class ScheduledWorkoutController {

    private final ScheduledWorkoutService scheduledWorkoutService;

    public ScheduledWorkoutController(ScheduledWorkoutService scheduledWorkoutService) {
        this.scheduledWorkoutService = scheduledWorkoutService;
    }

    @PostMapping
    public ResponseEntity<ScheduledWorkout> save(@Valid @RequestBody ScheduledWorkoutRequest request,
                                                 @AuthenticationPrincipal User currentUser) {
        ScheduledWorkout saved = scheduledWorkoutService.save(request, currentUser);
        return ResponseEntity.status(HttpStatus.CREATED).body(saved);
    }

    @GetMapping
    public ResponseEntity<List<ScheduledWorkout>> findMine(@AuthenticationPrincipal User currentUser) {
        return ResponseEntity.ok(scheduledWorkoutService.findMine(currentUser));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteById(@PathVariable Long id, @AuthenticationPrincipal User currentUser) {
        scheduledWorkoutService.deleteById(id, currentUser);
        return ResponseEntity.noContent().build();
    }
}
