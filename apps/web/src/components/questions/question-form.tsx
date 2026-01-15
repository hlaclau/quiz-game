import { useForm } from "react-hook-form";
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
import { useThemes } from "@/hooks/use-themes";
import type { QuestionWithAnswersDTO } from "@/lib/api";

const DIFFICULTY_OPTIONS = [
	{ name: "easy", label: "Easy" },
	{ name: "medium", label: "Medium" },
	{ name: "hard", label: "Hard" },
] as const;

export type QuestionFormValues = {
	content: string;
	explanation: string;
	themeId: string;
	difficultyName: string;
	correctAnswer: string;
	wrongAnswer1: string;
	wrongAnswer2: string;
	wrongAnswer3: string;
};

export interface QuestionFormProps {
	mode: "create" | "edit";
	defaultValues?: Partial<QuestionFormValues>;
	question?: QuestionWithAnswersDTO;
	onSubmit: (values: QuestionFormValues) => Promise<void>;
	onCancel: () => void;
	isSubmitting?: boolean;
	submitLabel?: string;
}

function getDefaultValuesFromQuestion(
	question: QuestionWithAnswersDTO,
	difficultyName: string,
): QuestionFormValues {
	const correctAnswer = question.answers.find((a) => a.isCorrect);
	const wrongAnswers = question.answers.filter((a) => !a.isCorrect);

	return {
		content: question.content,
		explanation: question.explanation ?? "",
		themeId: question.themeId,
		difficultyName,
		correctAnswer: correctAnswer?.content ?? "",
		wrongAnswer1: wrongAnswers[0]?.content ?? "",
		wrongAnswer2: wrongAnswers[1]?.content ?? "",
		wrongAnswer3: wrongAnswers[2]?.content ?? "",
	};
}

export function QuestionForm({
	mode,
	defaultValues,
	question,
	onSubmit,
	onCancel,
	isSubmitting = false,
	submitLabel,
}: QuestionFormProps) {
	const { data: themesData, isLoading: isLoadingThemes } = useThemes();
	const themes = themesData?.data ?? [];

	const initialValues: QuestionFormValues = question
		? getDefaultValuesFromQuestion(
				question,
				defaultValues?.difficultyName ?? "",
			)
		: {
				content: "",
				explanation: "",
				themeId: "",
				difficultyName: "",
				correctAnswer: "",
				wrongAnswer1: "",
				wrongAnswer2: "",
				wrongAnswer3: "",
				...defaultValues,
			};

	const form = useForm<QuestionFormValues>({
		defaultValues: initialValues,
	});

	const buttonLabel =
		submitLabel ?? (mode === "create" ? "Submit Question" : "Save Changes");
	const pendingLabel = mode === "create" ? "Submitting..." : "Saving...";

	return (
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
								value={field.value}
								disabled={isLoadingThemes}
							>
								<FormControl>
									<SelectTrigger>
										<SelectValue
											placeholder={
												isLoadingThemes ? "Loading themes..." : "Select a theme"
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
					name="difficultyName"
					render={({ field }) => (
						<FormItem>
							<FormLabel>Difficulty</FormLabel>
							<FormControl>
								<RadioGroup
									onValueChange={field.onChange}
									value={field.value}
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
									<FormLabel className="mb-2 block text-green-700 dark:text-green-300">
										Correct Answer
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
									<FormLabel className="mb-2 block">Wrong Answer 1</FormLabel>
									<FormControl>
										<Input placeholder="Enter a wrong answer..." {...field} />
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
									<FormLabel className="mb-2 block">Wrong Answer 2</FormLabel>
									<FormControl>
										<Input placeholder="Enter a wrong answer..." {...field} />
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
									<FormLabel className="mb-2 block">Wrong Answer 3</FormLabel>
									<FormControl>
										<Input placeholder="Enter a wrong answer..." {...field} />
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
					<Button type="button" variant="outline" onClick={onCancel}>
						Cancel
					</Button>
					<Button type="submit" disabled={isSubmitting}>
						{isSubmitting ? pendingLabel : buttonLabel}
					</Button>
				</div>
			</form>
		</Form>
	);
}
