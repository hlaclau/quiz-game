import type {
	SortField,
	SortOrder,
} from "../../../domain/interfaces/question-repository.interface";
import type { QuestionDTO } from "../../dtos/question.dto";

/**
 * Input for GetQuestions use case
 */
export interface GetQuestionsInput {
	page: number;
	limit: number;
	themeId?: string;
	validated?: boolean;
	sortBy?: SortField;
	sortOrder?: SortOrder;
}

/**
 * Output for GetQuestions use case
 */
export interface GetQuestionsOutput {
	data: QuestionDTO[];
	total: number;
	page: number;
	limit: number;
	totalPages: number;
}
