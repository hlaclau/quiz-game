import { useQuery } from "@tanstack/react-query";
import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowLeft, Check, X } from "lucide-react";
import { useState } from "react";
import { BlurFade } from "@/components/ui/blur-fade";
import { Button } from "@/components/ui/button";
import { api } from "@/lib/api";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/play/$themeId")({
	component: QuizComponent,
});

function QuizComponent() {
	const { themeId } = Route.useParams();
	const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
	const [selectedAnswerId, setSelectedAnswerId] = useState<string | null>(null);
	const [isAnswered, setIsAnswered] = useState(false);
	const [score, setScore] = useState(0);

	const {
		data: apiResponse,
		isLoading,
		error,
	} = useQuery({
		queryKey: ["questions", themeId],
		queryFn: () => api.questions.getRandom(themeId, 10),
		staleTime: 0, // Always fetch new questions
	});

	const questions = apiResponse?.data;

	if (isLoading) {
		return (
			<div className="flex min-h-screen items-center justify-center">
				<div className="flex flex-col items-center gap-4">
					<div className="size-12 animate-spin rounded-full border-4 border-primary border-t-transparent" />
					<p className="text-muted-foreground">Loading your quiz...</p>
				</div>
			</div>
		);
	}

	if (error || !questions || questions.length === 0) {
		return (
			<div className="flex min-h-screen flex-col items-center justify-center gap-4 p-6 text-center">
				<div className="rounded-full bg-destructive/10 p-4 text-destructive">
					<X className="size-8" />
				</div>
				<h2 className="font-bold text-2xl">Oops! Something went wrong</h2>
				<p className="text-muted-foreground">
					We couldn't load the questions for this theme.
				</p>
				<Button asChild variant="outline">
					<Link to="/play">Try Another Theme</Link>
				</Button>
			</div>
		);
	}

	const currentQuestion = questions[currentQuestionIndex];
	const isLastQuestion = currentQuestionIndex === questions.length - 1;

	const handleAnswer = (answerId: string, isCorrect: boolean) => {
		if (isAnswered) return;

		setSelectedAnswerId(answerId);
		setIsAnswered(true);

		if (isCorrect) {
			setScore((prev) => prev + 1);
		}

		// Auto advance after delay
		setTimeout(() => {
			if (isLastQuestion) {
				// Handle game over (for now just show score)
				// We'll implement a proper results screen later or just show it here
			} else {
				setCurrentQuestionIndex((prev) => prev + 1);
				setSelectedAnswerId(null);
				setIsAnswered(false);
			}
		}, 1500);
	};

	if (isAnswered && isLastQuestion && selectedAnswerId) {
		// Simple results view for now
		return (
			<div className="flex min-h-screen flex-col items-center justify-center gap-6 p-6 text-center">
				<BlurFade inView>
					<div className="rounded-full bg-primary/10 p-6 text-primary">
						<Check className="size-12" />
					</div>
					<h1 className="mt-6 font-bold text-4xl">Quiz Completed!</h1>
					<p className="mt-2 text-muted-foreground text-xl">
						You scored {score} out of {questions.length}
					</p>
					<div className="mt-8 flex gap-4">
						<Button asChild>
							<Link to="/play">Play Again</Link>
						</Button>
						<Button asChild variant="outline">
							<Link to="/">Back Home</Link>
						</Button>
					</div>
				</BlurFade>
			</div>
		);
	}

	return (
		<div className="relative min-h-screen px-6 py-12">
			{/* Header */}
			<div className="mx-auto mb-12 flex max-w-4xl items-center justify-between">
				<Button asChild variant="ghost" size="icon">
					<Link to="/play">
						<ArrowLeft className="size-5" />
					</Link>
				</Button>
				<div className="font-medium text-muted-foreground text-sm">
					Question {currentQuestionIndex + 1} / {questions.length}
				</div>
				<div className="font-medium text-primary text-sm">Score: {score}</div>
			</div>

			<div className="mx-auto max-w-3xl">
				<BlurFade key={currentQuestion.id} inView>
					{/* Question */}
					<div className="mb-12 text-center">
						<h2 className="font-bold text-3xl leading-tight md:text-4xl">
							{currentQuestion.content}
						</h2>
					</div>

					{/* Answers */}
					<div className="grid gap-4 md:grid-cols-2">
						{currentQuestion.answers.map((answer) => {
							const isSelected = selectedAnswerId === answer.id;
							const showCorrect = isAnswered && answer.isCorrect;
							const showWrong = isAnswered && isSelected && !answer.isCorrect;

							return (
								<button
									key={answer.id}
									type="button"
									disabled={isAnswered}
									onClick={() => handleAnswer(answer.id, answer.isCorrect)}
									className={cn(
										"relative flex min-h-[80px] w-full items-center justify-center rounded-2xl border-2 p-6 text-center font-medium text-lg transition-all",
										!isAnswered &&
											"border-border bg-card hover:border-primary/50 hover:bg-accent",
										showCorrect &&
											"border-green-500 bg-green-500/10 text-green-600 dark:text-green-400",
										showWrong &&
											"border-red-500 bg-red-500/10 text-red-600 dark:text-red-400",
										isAnswered &&
											!showCorrect &&
											!showWrong &&
											"border-border/50 bg-muted/50 opacity-50",
									)}
								>
									{answer.content}
									{showCorrect && (
										<div className="-translate-y-1/2 absolute top-1/2 right-4 rounded-full bg-green-500 p-1 text-white">
											<Check className="size-4" />
										</div>
									)}
									{showWrong && (
										<div className="-translate-y-1/2 absolute top-1/2 right-4 rounded-full bg-red-500 p-1 text-white">
											<X className="size-4" />
										</div>
									)}
								</button>
							);
						})}
					</div>
				</BlurFade>
			</div>
		</div>
	);
}
