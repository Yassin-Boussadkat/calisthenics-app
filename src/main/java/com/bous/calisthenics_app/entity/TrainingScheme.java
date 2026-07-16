
package com.bous.calisthenics_app.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Entity
@Data
@NoArgsConstructor
public class TrainingScheme {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank(message = "Naam is verplicht")
    private String name;

    private String description;

    @NotNull(message = "Moeilijkheidsgraad is verplicht")
    @Enumerated(EnumType.STRING)
    private DifficultyLevel difficultyLevel;

    @NotNull(message = "Oefentype is verplicht")
    @Enumerated(EnumType.STRING)
    private ExerciseType exerciseType;

    @ManyToMany
    @JoinTable(
            name = "training_scheme_exercises",
            joinColumns = @JoinColumn(name = "scheme_id"),
            inverseJoinColumns = @JoinColumn(name = "exercise_id")
    )
    private List<Exercise> exercises;
}
