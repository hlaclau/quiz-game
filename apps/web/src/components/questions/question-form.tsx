import { Check, CircleHelp, Lightbulb, Loader2, X } from "lucide-react";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
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
import { cn } from "@/lib/utils";

const DIFFICULTY_OPTIONS = [
	{ name: "easy", label: "Easy", color: "bg-emerald-500" },
	{ name: "medium", label: "Medium", color: "bg-amber-500" },
	{ name: "hard", label: "Hard", color: "bg-rose-500" },
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

	return (
		<Form {...form}>
			<form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
				{/* Question Content Card */}
				<Card>
					<CardHeader className="pb-4">
						<CardTitle className="flex items-center gap-2 text-lg">
							<CircleHelp className="size-5 text-primary" />
							Question
						</CardTitle>
						<CardDescription>
							Write a clear and concise question for players to answer.
						</CardDescription>
					</CardHeader>
					<CardContent className="space-y-4">
						<FormField
							control={form.control}
							name="content"
							render={({ field }) => (
								<FormItem>
									<FormControl>
										<Textarea
											placeholder="Enter your question here..."
											className="min-h-28 resize-none text-base"
											{...field}
										/>
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>

						{/* Theme & Difficulty Row */}
						<div className="grid gap-4 sm:grid-cols-2">
							<FormField
								control={form.control}
								name="themeId"
								render={({ field }) => (
									<FormItem>
										<FormLabel className="text-muted-foreground text-xs uppercase tracking-wide">
											Theme
										</FormLabel>
										<Select
											onValueChange={field.onChange}
											value={field.value}
											disabled={isLoadingThemes}
										>
											<FormControl>
												<SelectTrigger className="w-full">
													<SelectValue
														placeholder={
															isLoadingThemes ? "Loading..." : "Select a theme"
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
										<FormMessage />
									</FormItem>
								)}
							/>

							<FormField
								control={form.control}
								name="difficultyName"
								render={({ field }) => (
									<FormItem>
										<FormLabel className="text-muted-foreground text-xs uppercase tracking-wide">
											Difficulty
										</FormLabel>
										<div className="flex gap-2">
											{DIFFICULTY_OPTIONS.map((option) => {
												const isSelected = field.value === option.name;
												return (
													<button
														key={option.name}
														type="button"
														onClick={() => field.onChange(option.name)}
														className={cn(
															"flex flex-1 items-center justify-center gap-1.5 rounded-lg border-2 px-3 py-2 font-medium text-sm transition-all",
															isSelected
																? "border-primary bg-primary/10 text-primary"
																: "border-border bg-background text-muted-foreground hover:border-primary/50 hover:bg-muted",
														)}
													>
														<span
															className={cn(
																"size-2 rounded-full",
																option.color,
															)}
														/>
														{option.label}
													</button>
												);
											})}
										</div>
										<FormMessage />
									</FormItem>
								)}
							/>
						</div>
					</CardContent>
				</Card>

				{/* Answers Card */}
				<Card>
					<CardHeader className="pb-4">
						<CardTitle className="flex items-center gap-2 text-lg">
							<Check className="size-5 text-emerald-500" />
							Answers
						</CardTitle>
						<CardDescription>
							Enter one correct answer and three wrong answers.
						</CardDescription>
					</CardHeader>
					<CardContent className="space-y-3">
						{/* Correct Answer */}
						<FormField
							control={form.control}
							name="correctAnswer"
							render={({ field }) => (
								<FormItem>
									<div className="flex items-center gap-3 rounded-lg border-2 border-emerald-500/50 bg-emerald-500/5 p-3 transition-colors focus-within:border-emerald-500 dark:bg-emerald-500/10">
										<div className="flex size-8 shrink-0 items-center justify-center rounded-full bg-emerald-500 text-white">
											<Check className="size-4" />
										</div>
										<FormControl>
											<Input
												placeholder="Enter the correct answer..."
												className="border-0 bg-transparent p-0 shadow-none focus-visible:ring-0"
												{...field}
											/>
										</FormControl>
									</div>
									<FormMessage />
								</FormItem>
							)}
						/>

						{/* Wrong Answers */}
						{(["wrongAnswer1", "wrongAnswer2", "wrongAnswer3"] as const).map(
							(name, index) => (
								<FormField
									key={name}
									control={form.control}
									name={name}
									render={({ field }) => (
										<FormItem>
											<div className="flex items-center gap-3 rounded-lg border-2 border-transparent bg-muted/50 p-3 transition-colors focus-within:border-border focus-within:bg-background">
												<div className="flex size-8 shrink-0 items-center justify-center rounded-full bg-muted-foreground/20 text-muted-foreground">
													<X className="size-4" />
												</div>
												<FormControl>
													<Input
														placeholder={`Wrong answer ${index + 1}...`}
														className="border-0 bg-transparent p-0 shadow-none focus-visible:ring-0"
														{...field}
													/>
												</FormControl>
											</div>
											<FormMessage />
										</FormItem>
									)}
								/>
							),
						)}
					</CardContent>
				</Card>

				{/* Explanation Card */}
				<Card>
					<CardHeader className="pb-4">
						<CardTitle className="flex items-center gap-2 text-lg">
							<Lightbulb className="size-5 text-amber-500" />
							Explanation
							<span className="ml-1 font-normal text-muted-foreground text-sm">
								(optional)
							</span>
						</CardTitle>
						<CardDescription>
							Help players learn by explaining the correct answer.
						</CardDescription>
					</CardHeader>
					<CardContent>
						<FormField
							control={form.control}
							name="explanation"
							render={({ field }) => (
								<FormItem>
									<FormControl>
										<Textarea
											placeholder="Explain why the correct answer is correct..."
											className="min-h-24 resize-none"
											{...field}
										/>
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>
					</CardContent>
				</Card>

				{/* Submit Buttons */}
				<div className="flex items-center justify-end gap-3 pt-2">
					<Button
						type="button"
						variant="ghost"
						onClick={onCancel}
						disabled={isSubmitting}
					>
						Cancel
					</Button>
					<Button type="submit" disabled={isSubmitting} className="min-w-32">
						{isSubmitting ? (
							<>
								<Loader2 className="mr-2 size-4 animate-spin" />
								Saving...
							</>
						) : (
							buttonLabel
						)}
					</Button>
				</div>
			</form>
		</Form>
	);
}
