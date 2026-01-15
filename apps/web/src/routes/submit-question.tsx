import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createFileRoute, redirect, useNavigate } from "@tanstack/react-router";
import { toast } from "sonner";
import {
	QuestionForm,
	type QuestionFormValues,
} from "@/components/questions/question-form";
import { getUser } from "@/functions/get-user";
import { useDifficulties } from "@/hooks/use-difficulties";
import { api } from "@/lib/api";

export const Route = createFileRoute("/submit-question")({
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
	const { session } = Route.useRouteContext();
	const navigate = useNavigate();
	const queryClient = useQueryClient();
	const { data: difficultiesData } = useDifficulties();

	const createQuestionMutation = useMutation({
		mutationFn: api.questions.create,
		onSuccess: () => {
			toast.success("Question submitted successfully!");
			queryClient.invalidateQueries({ queryKey: ["questions"] });
			navigate({ to: "/dashboard" });
		},
		onError: (error: Error) => {
			toast.error(error.message || "Failed to submit question");
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

		const answers = [
			{ content: values.correctAnswer, isCorrect: true },
			{ content: values.wrongAnswer1, isCorrect: false },
			{ content: values.wrongAnswer2, isCorrect: false },
			{ content: values.wrongAnswer3, isCorrect: false },
		];

		await createQuestionMutation.mutateAsync({
			content: values.content,
			explanation: values.explanation || null,
			themeId: values.themeId,
			difficultyId: selectedDifficulty.id,
			authorId: session.user.id,
			answers,
		});
	}

	return (
		<div className="container mx-auto px-4 py-8">
			<div className="mx-auto max-w-2xl">
				<div className="mb-8">
					<h1 className="font-bold text-3xl">Submit a Question</h1>
					<p className="mt-2 text-muted-foreground">
						Create a new quiz question for others to answer.
					</p>
				</div>

				<QuestionForm
					mode="create"
					onSubmit={handleSubmit}
					onCancel={() => navigate({ to: "/dashboard" })}
					isSubmitting={createQuestionMutation.isPending}
				/>
			</div>
		</div>
	);
}
