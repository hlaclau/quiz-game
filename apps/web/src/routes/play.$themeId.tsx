import { useQuery } from "@tanstack/react-query";
import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowLeft, Check, Timer, X } from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import { BlurFade } from "@/components/ui/blur-fade";
import { Button } from "@/components/ui/button";
import { api } from "@/lib/api";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/play/$themeId")({
	component: QuizComponent,
});

const TOTAL_QUESTIONS = 10;
const QUESTION_TIMER_SECONDS = 10;

function QuizComponent() {
	const { themeId } = Route.useParams();
	const [answeredQuestionIds, setAnsweredQuestionIds] = useState<string[]>([]);
	const [selectedAnswerId, setSelectedAnswerId] = useState<string | null>(null);
	const [correctAnswerId, setCorrectAnswerId] = useState<string | null>(null);
	const [isAnswered, setIsAnswered] = useState(false);
	const [score, setScore] = useState(0);
	const [isQuizComplete, setIsQuizComplete] = useState(false);
	const [noMoreQuestions, setNoMoreQuestions] = useState(false);
	const [timeLeft, setTimeLeft] = useState(QUESTION_TIMER_SECONDS);

	const currentQuestionNumber = answeredQuestionIds.length + 1;

	const {
		data: apiResponse,
		isLoading,
		error,
	} = useQuery({
		queryKey: ["quiz", themeId, answeredQuestionIds.length],
		queryFn: () => api.questions.getRandom(themeId, 1, answeredQuestionIds),
		enabled: !isQuizComplete && answeredQuestionIds.length < TOTAL_QUESTIONS,
		staleTime: Number.POSITIVE_INFINITY,
		refetchOnWindowFocus: false,
		retry: false,
	});

	const currentQuestion = apiResponse?.data?.[0];

	// Timer countdown
	useEffect(() => {
		if (isAnswered || !currentQuestion || timeLeft <= 0) return;

		const timer = setInterval(() => {
			setTimeLeft((prev) => Math.max(0, prev - 1));
		}, 1000);

		return () => clearInterval(timer);
	}, [isAnswered, currentQuestion, timeLeft]);

	// Check if we ran out of questions from the API
	useEffect(() => {
		if (apiResponse?.data && apiResponse.data.length === 0) {
			setNoMoreQuestions(true);
			setIsQuizComplete(true);
		}
	}, [apiResponse]);

	const advanceToNextQuestion = useCallback(
		(currentId: string) => {
			setTimeout(() => {
				const newAnsweredIds = [...answeredQuestionIds, currentId];
				setAnsweredQuestionIds(newAnsweredIds);

				if (newAnsweredIds.length >= TOTAL_QUESTIONS) {
					setIsQuizComplete(true);
				} else {
					// Reset state for next question
					setSelectedAnswerId(null);
					setCorrectAnswerId(null);
					setIsAnswered(false);
					setTimeLeft(QUESTION_TIMER_SECONDS);
				}
			}, 1500);
		},
		[answeredQuestionIds],
	);

	const handleTimeout = useCallback(async () => {
		if (isAnswered || !currentQuestion) return;

		setIsAnswered(true);
		// No selected answer on timeout

		try {
			// Validate with the first answer just to get the correct answer ID
			// We don't increment score on timeout
			const firstAnswerId = currentQuestion.answers[0]?.id;
			if (firstAnswerId) {
				const result = await api.questions.validate(
					currentQuestion.id,
					firstAnswerId,
				);
				setCorrectAnswerId(result.correctAnswerId);
			}

			advanceToNextQuestion(currentQuestion.id);
		} catch (error) {
			console.error("Failed to handle timeout:", error);
			advanceToNextQuestion(currentQuestion.id);
		}
	}, [isAnswered, currentQuestion, advanceToNextQuestion]);

	// Trigger timeout
	useEffect(() => {
		if (timeLeft === 0 && !isAnswered && currentQuestion) {
			handleTimeout();
		}
	}, [timeLeft, isAnswered, currentQuestion, handleTimeout]);

	const handleAnswer = async (answerId: string) => {
		if (isAnswered || !currentQuestion) return;

		setSelectedAnswerId(answerId);
		setIsAnswered(true);

		try {
			const result = await api.questions.validate(currentQuestion.id, answerId);

			if (result.isCorrect) {
				setScore((prev) => prev + 1);
			}
			setCorrectAnswerId(result.correctAnswerId);

			advanceToNextQuestion(currentQuestion.id);
		} catch (error) {
			console.error("Failed to validate answer:", error);
			advanceToNextQuestion(currentQuestion.id);
		}
	};

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

	if (error) {
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

	if (isQuizComplete) {
		const totalAnswered = answeredQuestionIds.length;
		return (
			<div className="flex min-h-screen flex-col items-center justify-center gap-6 p-6 text-center">
				<BlurFade inView>
					<div className="rounded-full bg-primary/10 p-6 text-primary">
						<Check className="size-12" />
					</div>
					<h1 className="mt-6 font-bold text-4xl">Quiz Completed!</h1>
					<p className="mt-2 text-muted-foreground text-xl">
						You scored {score} out of {totalAnswered}
					</p>
					{noMoreQuestions && totalAnswered < TOTAL_QUESTIONS && (
						<p className="mt-1 text-muted-foreground text-sm">
							(No more questions available in this theme)
						</p>
					)}
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

	if (!currentQuestion) {
		return null;
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
				<div className="flex items-center gap-4">
					<div className="font-medium text-muted-foreground text-sm">
						Question {currentQuestionNumber} / {TOTAL_QUESTIONS}
					</div>
					<div
						className={cn(
							"flex items-center gap-2 rounded-full px-3 py-1 font-medium text-sm transition-colors",
							timeLeft <= 3
								? "bg-red-100 text-red-600 dark:bg-red-900/20 dark:text-red-400"
								: "bg-secondary text-secondary-foreground",
						)}
					>
						<Timer className="size-4" />
						<span>{timeLeft}s</span>
					</div>
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
							const isCorrectAnswer = correctAnswerId === answer.id;
							const showCorrect = isAnswered && isCorrectAnswer;
							const showWrong = isAnswered && isSelected && !isCorrectAnswer;

							return (
								<button
									key={answer.id}
									type="button"
									disabled={isAnswered}
									onClick={() => handleAnswer(answer.id)}
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
