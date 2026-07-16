package com.bous.calisthenics_app.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.PositiveOrZero;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDate;

@Entity
@Data
@NoArgsConstructor
public class WorkoutLog {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotNull(message = "Gebruiker is verplicht")
    @ManyToOne
    @JoinColumn(name = "user_id")
    private User user;

    @NotNull(message = "Exercise is verplicht")
    @ManyToOne
    @JoinColumn(name = "exercise_id")
    private Exercise exercise;

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

