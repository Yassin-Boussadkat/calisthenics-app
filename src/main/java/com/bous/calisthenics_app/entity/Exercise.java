package com.bous.calisthenics_app.entity;

import jakarta.persistence.*;
import lombok.Data;

import java.util.List;
@Data
@Entity
public class Exercise {

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private Long id;
    private String name;
    private String description;
    @ElementCollection
    @Enumerated(EnumType.STRING)
    private List<MuscleGroup> muscleGroups;
    @Enumerated(EnumType.STRING)
    private DifficultyLevel difficultyLevel;
    @Enumerated(EnumType.STRING)
    private ExerciseType exerciseType;

}
