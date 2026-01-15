import {
	CreateQuestionUseCase,
	GetDifficultiesUseCase,
	GetQuestionByIdUseCase,
	GetQuestionsUseCase,
	GetThemesUseCase,
	SetQuestionValidationUseCase,
} from "../application/use-cases";
import {
	createDifficultyRepository,
	createQuestionRepository,
	createThemeRepository,
} from "./adapters";
import { container } from "./container";

/**
 * Dependency keys for type-safe resolution
 */
export const DependencyKeys = {
	repositories: {
		theme: "repository.theme",
		question: "repository.question",
		difficulty: "repository.difficulty",
	},
	useCases: {
		createQuestion: "useCase.createQuestion",
		getQuestionById: "useCase.getQuestionById",
		getQuestions: "useCase.getQuestions",
		getThemes: "useCase.getThemes",
		getDifficulties: "useCase.getDifficulties",
		setQuestionValidation: "useCase.setQuestionValidation",
	},
} as const;

/**
 * Setup and register all dependencies in the container
 */
export function setupContainer(): void {
	// Register repositories as singletons
	container.singleton(DependencyKeys.repositories.theme, createThemeRepository);
	container.singleton(
		DependencyKeys.repositories.question,
		createQuestionRepository,
	);
	container.singleton(
		DependencyKeys.repositories.difficulty,
		createDifficultyRepository,
	);

	// Register use cases
	container.register(DependencyKeys.useCases.createQuestion, () => {
		return new CreateQuestionUseCase(
			container.resolve(DependencyKeys.repositories.question),
		);
	});

	container.register(DependencyKeys.useCases.getQuestionById, () => {
		return new GetQuestionByIdUseCase(
			container.resolve(DependencyKeys.repositories.question),
		);
	});

	container.register(DependencyKeys.useCases.getQuestions, () => {
		return new GetQuestionsUseCase(
			container.resolve(DependencyKeys.repositories.question),
		);
	});

	container.register(DependencyKeys.useCases.getThemes, () => {
		return new GetThemesUseCase(
			container.resolve(DependencyKeys.repositories.theme),
		);
	});

	container.register(DependencyKeys.useCases.getDifficulties, () => {
		return new GetDifficultiesUseCase(
			container.resolve(DependencyKeys.repositories.difficulty),
		);
	});

	container.register(DependencyKeys.useCases.setQuestionValidation, () => {
		return new SetQuestionValidationUseCase(
			container.resolve(DependencyKeys.repositories.question),
		);
	});
}

/**
 * Get all use cases (convenience export for backward compatibility)
 */
export function getUseCases() {
	return {
		createQuestion: container.resolve<CreateQuestionUseCase>(
			DependencyKeys.useCases.createQuestion,
		),
		getQuestionById: container.resolve<GetQuestionByIdUseCase>(
			DependencyKeys.useCases.getQuestionById,
		),
		getQuestions: container.resolve<GetQuestionsUseCase>(
			DependencyKeys.useCases.getQuestions,
		),
		getThemes: container.resolve<GetThemesUseCase>(
			DependencyKeys.useCases.getThemes,
		),
		getDifficulties: container.resolve<GetDifficultiesUseCase>(
			DependencyKeys.useCases.getDifficulties,
		),
		setQuestionValidation: container.resolve<SetQuestionValidationUseCase>(
			DependencyKeys.useCases.setQuestionValidation,
		),
	};
}

// Initialize container on module load
setupContainer();
