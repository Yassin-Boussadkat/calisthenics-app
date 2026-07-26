package com.bous.calisthenics_app.dto;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.PositiveOrZero;
import lombok.Data;

import java.time.LocalDate;

@Data
public class WorkoutLogRequest {
    @NotNull
    private Long exerciseId;

    @NotNull(message = "Datum is verplicht")
    private LocalDate date;

    @Min(value = 1, message = "Sets moet minimaal 1 zijn")
    private int sets;

    @Min(value = 1, message = "Reps moet minimaal 1 zijn")
    private int reps;

    @PositiveOrZero(message = "Gewicht kan niet negatief zijn")
    private double weightInKg;

    private String notes;

}
