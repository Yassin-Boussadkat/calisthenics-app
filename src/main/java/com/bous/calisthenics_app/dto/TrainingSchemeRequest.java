package com.bous.calisthenics_app.dto;

import com.bous.calisthenics_app.entity.DifficultyLevel;
import com.bous.calisthenics_app.entity.ExerciseType;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

import java.util.List;

@Data
public class TrainingSchemeRequest {

    @NotBlank(message = "Naam is verplicht")
    private String name;
    

    @NotNull(message = "Moeilijkheidsgraad is verplicht")
    private DifficultyLevel difficultyLevel;

    @NotNull(message = "Oefentype is verplicht")
    private ExerciseType exerciseType;

    @NotEmpty(message = "Minimaal 1 oefening is verplicht")
    private List<Long> exerciseIds;
}
