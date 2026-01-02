import { createFileRoute, redirect } from "@tanstack/react-router";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "@tanstack/react-router";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
	Form,
	FormControl,
	FormDescription,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { getUser } from "@/functions/get-user";
import { useThemes } from "@/hooks/use-themes";
import { api } from "@/lib/api";

const DIFFICULTY_OPTIONS = [
	{ name: "easy", label: "Easy" },
	{ name: "medium", label: "Medium" },
	{ name: "hard", label: "Hard" },
] as const;

type FormValues = {
	content: string;
	explanation: string;
	themeId: string;
	difficultyId: string;
	correctAnswer: string;
	wrongAnswer1: string;
	wrongAnswer2: string;
	wrongAnswer3: string;
};

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
	const { data: themesData, isLoading: isLoadingThemes } = useThemes();

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

	const form = useForm<FormValues>({
		defaultValues: {
			content: "",
			explanation: "",
			themeId: "",
			difficultyId: "",
			correctAnswer: "",
			wrongAnswer1: "",
			wrongAnswer2: "",
			wrongAnswer3: "",
		},
	});

	async function onSubmit(values: FormValues) {
		// Validation
		if (values.content.length < 10) {
			toast.error("Question must be at least 10 characters");
			return;
		}
		if (!values.themeId) {
			toast.error("Please select a theme");
			return;
		}
		if (!values.difficultyId) {
			toast.error("Please select a difficulty");
			return;
		}
		if (!values.correctAnswer || !values.wrongAnswer1 || !values.wrongAnswer2 || !values.wrongAnswer3) {
			toast.error("All answers are required");
			return;
		}

		// Fetch difficulties to get the GUID for the selected difficulty
		const difficultiesResponse = await api.difficulties.getAll();
		const selectedDifficulty = difficultiesResponse.data.find(
			(d) => d.name.toLowerCase() === values.difficultyId.toLowerCase()
		);

		console.log("Selected Difficulty:", selectedDifficulty);

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

	const themes = themesData?.data ?? [];

	return (
		<div className="container mx-auto px-4 py-8">
			<div className="mx-auto max-w-2xl">
				<div className="mb-8">
					<h1 className="font-bold text-3xl">Submit a Question</h1>
					<p className="mt-2 text-muted-foreground">
						Create a new quiz question for others to answer.
					</p>
				</div>

				<Form {...form}>
					<form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
						{/* Question Content */}
						<FormField
							control={form.control}
							name="content"
							render={({ field }) => (
								<FormItem>
									<FormLabel>Question</FormLabel>
									<FormControl>
										<Textarea
											placeholder="Enter your question here..."
											className="min-h-24"
											{...field}
										/>
									</FormControl>
									<FormDescription>
										Write a clear and concise question.
									</FormDescription>
									<FormMessage />
								</FormItem>
							)}
						/>

						{/* Theme Selection */}
						<FormField
							control={form.control}
							name="themeId"
							render={({ field }) => (
								<FormItem>
									<FormLabel>Theme</FormLabel>
									<Select
										onValueChange={field.onChange}
										defaultValue={field.value}
										disabled={isLoadingThemes}
									>
										<FormControl>
											<SelectTrigger>
												<SelectValue
													placeholder={
														isLoadingThemes
															? "Loading themes..."
															: "Select a theme"
													}
												/>
											</SelectTrigger>
										</FormControl>
										<SelectContent>
											{themes.map((theme) => (
												<SelectItem key={theme.id} value={theme.id}>
													{theme.name}
												</SelectItem>
											))}
										</SelectContent>
									</Select>
									<FormDescription>
										Choose the category that best fits your question.
									</FormDescription>
									<FormMessage />
								</FormItem>
							)}
						/>

						{/* Difficulty Selection */}
						<FormField
							control={form.control}
							name="difficultyId"
							render={({ field }) => (
								<FormItem>
									<FormLabel>Difficulty</FormLabel>
									<FormControl>
										<RadioGroup
											onValueChange={field.onChange}
											defaultValue={field.value}
											className="flex gap-4"
										>
											{DIFFICULTY_OPTIONS.map((option) => (
												<FormItem
													key={option.name}
													className="flex items-center space-x-2 space-y-0"
												>
													<FormControl>
														<RadioGroupItem value={option.name} />
													</FormControl>
													<FormLabel className="cursor-pointer font-normal">
														{option.label}
													</FormLabel>
												</FormItem>
											))}
										</RadioGroup>
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>

						{/* Answers Section */}
						<div className="space-y-4">
							<div>
								<FormLabel>Answers</FormLabel>
								<FormDescription>
									Provide the correct answer and 3 wrong answers.
								</FormDescription>
							</div>

							{/* Correct Answer */}
							<FormField
								control={form.control}
								name="correctAnswer"
								render={({ field }) => (
									<FormItem>
										<div className="rounded-lg border border-green-500 bg-green-50 p-4 dark:bg-green-950">
											<FormLabel className="text-green-700 dark:text-green-300">
												✓ Correct Answer
											</FormLabel>
											<FormControl>
												<Input
													placeholder="Enter the correct answer..."
													className="border-green-300 dark:border-green-700"
													{...field}
												/>
											</FormControl>
											<FormMessage />
										</div>
									</FormItem>
								)}
							/>

							{/* Wrong Answers */}
							<FormField
								control={form.control}
								name="wrongAnswer1"
								render={({ field }) => (
									<FormItem>
										<div className="rounded-lg border p-4">
											<FormLabel>Wrong Answer 1</FormLabel>
											<FormControl>
												<Input
													placeholder="Enter a wrong answer..."
													{...field}
												/>
											</FormControl>
											<FormMessage />
										</div>
									</FormItem>
								)}
							/>

							<FormField
								control={form.control}
								name="wrongAnswer2"
								render={({ field }) => (
									<FormItem>
										<div className="rounded-lg border p-4">
											<FormLabel>Wrong Answer 2</FormLabel>
											<FormControl>
												<Input
													placeholder="Enter a wrong answer..."
													{...field}
												/>
											</FormControl>
											<FormMessage />
										</div>
									</FormItem>
								)}
							/>

							<FormField
								control={form.control}
								name="wrongAnswer3"
								render={({ field }) => (
									<FormItem>
										<div className="rounded-lg border p-4">
											<FormLabel>Wrong Answer 3</FormLabel>
											<FormControl>
												<Input
													placeholder="Enter a wrong answer..."
													{...field}
												/>
											</FormControl>
											<FormMessage />
										</div>
									</FormItem>
								)}
							/>
						</div>

						{/* Explanation */}
						<FormField
							control={form.control}
							name="explanation"
							render={({ field }) => (
								<FormItem>
									<FormLabel>
										Explanation{" "}
										<span className="text-muted-foreground">(optional)</span>
									</FormLabel>
									<FormControl>
										<Textarea
											placeholder="Explain why the correct answer is correct..."
											className="min-h-20"
											{...field}
										/>
									</FormControl>
									<FormDescription>
										Provide additional context or explanation for the answer.
									</FormDescription>
									<FormMessage />
								</FormItem>
							)}
						/>

						{/* Submit Buttons */}
						<div className="flex justify-end gap-4">
							<Button
								type="button"
								variant="outline"
								onClick={() => navigate({ to: "/dashboard" })}
							>
								Cancel
							</Button>
							<Button type="submit" disabled={createQuestionMutation.isPending}>
								{createQuestionMutation.isPending
									? "Submitting..."
									: "Submit Question"}
							</Button>
						</div>
					</form>
				</Form>
			</div>
		</div>
	);
}
