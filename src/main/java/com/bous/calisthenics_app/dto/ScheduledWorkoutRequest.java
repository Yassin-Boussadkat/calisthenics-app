package com.bous.calisthenics_app.dto;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.PositiveOrZero;
import lombok.Data;

import java.time.DayOfWeek;

@Data
public class ScheduledWorkoutRequest {

    @NotNull(message = "Exercise is verplicht")
    private Long exerciseId;

    @NotNull(message = "Dag van de week is verplicht")
    private DayOfWeek dayOfWeek;

    @Min(value = 1, message = "Sets moet minimaal 1 zijn")
    private int targetSets;

    @Min(value = 1, message = "Reps moet minimaal 1 zijn")
    private int targetReps;

    @PositiveOrZero(message = "Gewicht kan niet negatief zijn")
    private double targetWeightKg;
}
