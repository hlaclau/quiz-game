import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createFileRoute, redirect, useNavigate } from "@tanstack/react-router";
import { toast } from "sonner";
import {
	QuestionForm,
	type QuestionFormValues,
} from "@/components/questions/question-form";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { getUser } from "@/functions/get-user";
import { useDifficulties } from "@/hooks/use-difficulties";
import { useQuestion } from "@/hooks/use-question";
import { api } from "@/lib/api";

export const Route = createFileRoute("/questions/$id_/edit")({
	component: RouteComponent,
	beforeLoad: async () => {
		const session = await getUser();
		if (!session) {
			throw redirect({
				to: "/login",
			});
		}
		return { session };
	},
});

function RouteComponent() {
	const { id } = Route.useParams();
	const navigate = useNavigate();
	const queryClient = useQueryClient();
	const { data, isLoading, error } = useQuestion(id);
	const { data: difficultiesData, isLoading: isLoadingDifficulties } =
		useDifficulties();

	const updateQuestionMutation = useMutation({
		mutationFn: (input: Parameters<typeof api.questions.update>[1]) =>
			api.questions.update(id, input),
		onSuccess: () => {
			toast.success("Question updated successfully!");
			queryClient.invalidateQueries({ queryKey: ["questions"] });
			queryClient.invalidateQueries({ queryKey: ["question", id] });
			navigate({ to: "/questions/$id", params: { id } });
		},
		onError: (error: Error) => {
			toast.error(error.message || "Failed to update question");
		},
	});

	const difficulties = difficultiesData?.data ?? [];

	async function handleSubmit(values: QuestionFormValues) {
		if (values.content.length < 10) {
			toast.error("Question must be at least 10 characters");
			return;
		}
		if (!values.themeId) {
			toast.error("Please select a theme");
			return;
		}
		if (!values.difficultyName) {
			toast.error("Please select a difficulty");
			return;
		}
		if (
			!values.correctAnswer ||
			!values.wrongAnswer1 ||
			!values.wrongAnswer2 ||
			!values.wrongAnswer3
		) {
			toast.error("All answers are required");
			return;
		}

		const selectedDifficulty = difficulties.find(
			(d) => d.name.toLowerCase() === values.difficultyName.toLowerCase(),
		);

		if (!selectedDifficulty) {
			toast.error("Invalid difficulty selected");
			return;
		}

		const question = data?.data;
		if (!question) return;

		const correctAnswerId = question.answers.find((a) => a.isCorrect)?.id;
		const wrongAnswerIds = question.answers
			.filter((a) => !a.isCorrect)
			.map((a) => a.id);

		const answers = [
			{ id: correctAnswerId, content: values.correctAnswer, isCorrect: true },
			{ id: wrongAnswerIds[0], content: values.wrongAnswer1, isCorrect: false },
			{ id: wrongAnswerIds[1], content: values.wrongAnswer2, isCorrect: false },
			{ id: wrongAnswerIds[2], content: values.wrongAnswer3, isCorrect: false },
		];

		await updateQuestionMutation.mutateAsync({
			content: values.content,
			explanation: values.explanation || null,
			themeId: values.themeId,
			difficultyId: selectedDifficulty.id,
			answers,
		});
	}

	if (isLoading || isLoadingDifficulties) {
		return (
			<div className="container mx-auto px-4 py-8">
				<div className="mx-auto max-w-2xl">
					<div className="mb-8">
						<Skeleton className="mb-2 h-8 w-48" />
						<Skeleton className="h-4 w-64" />
					</div>
					<div className="space-y-6">
						<Skeleton className="h-32 w-full" />
						<Skeleton className="h-16 w-full" />
						<Skeleton className="h-16 w-full" />
						<Skeleton className="h-48 w-full" />
					</div>
				</div>
			</div>
		);
	}

	if (error || !data?.data) {
		return (
			<div className="container mx-auto max-w-2xl px-4 py-8">
				<Card>
					<CardContent className="py-12 text-center">
						<h2 className="mb-2 font-semibold text-xl">Question not found</h2>
						<p className="text-muted-foreground">
							The question you're trying to edit doesn't exist or has been
							removed.
						</p>
					</CardContent>
				</Card>
			</div>
		);
	}

	const question = data.data;
	const currentDifficulty = difficulties.find(
		(d) => d.id === question.difficultyId,
	);

	return (
		<div className="container mx-auto px-4 py-8">
			<div className="mx-auto max-w-2xl">
				<div className="mb-8">
					<h1 className="font-bold text-3xl">Edit Question</h1>
					<p className="mt-2 text-muted-foreground">
						Update the question details below.
					</p>
				</div>

				<QuestionForm
					mode="edit"
					question={question}
					defaultValues={{
						difficultyName: currentDifficulty?.name.toLowerCase(),
					}}
					onSubmit={handleSubmit}
					onCancel={() => navigate({ to: "/questions/$id", params: { id } })}
					isSubmitting={updateQuestionMutation.isPending}
				/>
			</div>
		</div>
	);
}
