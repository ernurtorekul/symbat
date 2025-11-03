export declare enum SkinType {
    OILY = "oily",
    DRY = "dry",
    COMBINATION = "combination",
    NORMAL = "normal",
    SENSITIVE = "sensitive"
}
export declare enum SkinTone {
    VERY_FAIR = "very_fair",
    FAIR = "fair",
    MEDIUM = "medium",
    OLIVE = "olive",
    TAN = "tan",
    DEEP = "deep"
}
export declare class SubmitQuizDto {
    skinType: SkinType;
    skinTone: SkinTone;
    skinConcerns: string[];
    allergies?: string[];
    additionalResponses?: Record<string, any>;
}
