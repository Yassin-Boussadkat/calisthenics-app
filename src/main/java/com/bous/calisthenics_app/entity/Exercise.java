package com.bous.calisthenics_app.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

import java.util.List;
@Data
@Entity
public class Exercise {

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private Long id;

    @NotBlank(message = "Naam is verplicht")
    private String name;

    private String description;

    @ElementCollection
    @Enumerated(EnumType.STRING)
    @NotEmpty(message = "Minimaal 1 spiergroep is verplicht")
    private List<MuscleGroup> muscleGroups;

    @Enumerated(EnumType.STRING)
    @NotNull(message = "Moeilijkheidsgraad is verplicht")
    private DifficultyLevel difficultyLevel;

    @Enumerated(EnumType.STRING)
    @NotNull(message = "Oefentype is verplicht")
    private ExerciseType exerciseType;

}