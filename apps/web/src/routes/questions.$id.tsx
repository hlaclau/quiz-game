import { createFileRoute, Link, redirect } from "@tanstack/react-router";
import { CheckCircle, XCircle } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { getUser } from "@/functions/get-user";
import { useDifficulties } from "@/hooks/use-difficulties";
import { useQuestion } from "@/hooks/use-question";
import { useThemes } from "@/hooks/use-themes";

export const Route = createFileRoute("/questions/$id")({
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
	const { data, isLoading, error } = useQuestion(id);
	const { data: themesData } = useThemes();
	const { data: difficultiesData } = useDifficulties();

	const theme = themesData?.data.find((t) => t.id === data?.data?.themeId);
	const difficulty = difficultiesData?.data.find(
		(d) => d.id === data?.data?.difficultyId,
	);

	if (isLoading) {
		return (
			<div className="container mx-auto max-w-3xl px-4 py-8">
				<div className="mb-6">
					<Skeleton className="mb-2 h-8 w-48" />
					<Skeleton className="h-4 w-32" />
				</div>
				<Card>
					<CardHeader>
						<Skeleton className="h-6 w-full" />
					</CardHeader>
					<CardContent className="space-y-6">
						<Skeleton className="h-20 w-full" />
						<Skeleton className="h-32 w-full" />
					</CardContent>
				</Card>
			</div>
		);
	}

	if (error || !data?.data) {
		return (
			<div className="container mx-auto max-w-3xl px-4 py-8">
				<Card>
					<CardContent className="py-12 text-center">
						<h2 className="mb-2 font-semibold text-xl">Question not found</h2>
						<p className="mb-6 text-muted-foreground">
							The question you're looking for doesn't exist or has been removed.
						</p>
						<Button asChild>
							<Link to="/dashboard">Back to Dashboard</Link>
						</Button>
					</CardContent>
				</Card>
			</div>
		);
	}

	const question = data.data;

	return (
		<div className="container mx-auto max-w-3xl px-4 py-8">
			<div className="mb-6">
				<Button variant="ghost" size="sm" asChild className="mb-4">
					<Link to="/dashboard">&larr; Back to Dashboard</Link>
				</Button>
				<div className="flex items-center gap-3">
					<h1 className="font-bold text-2xl">Question Details</h1>
					<Badge variant={question.validated ? "default" : "outline"}>
						{question.validated ? "Validated" : "Pending"}
					</Badge>
				</div>
				<p className="mt-1 text-muted-foreground text-sm">
					Created on {new Date(question.createdAt).toLocaleDateString()}
				</p>
			</div>

			<div className="space-y-6">
				<Card>
					<CardHeader>
						<CardTitle>Question</CardTitle>
					</CardHeader>
					<CardContent>
						<p className="text-lg">{question.content}</p>
					</CardContent>
				</Card>

				<Card>
					<CardHeader>
						<CardTitle>Answers</CardTitle>
						<CardDescription>
							The correct answer is highlighted in green
						</CardDescription>
					</CardHeader>
					<CardContent>
						<ul className="space-y-3">
							{question.answers.map((answer) => (
								<li
									key={answer.id}
									className={`flex items-center gap-3 rounded-lg border p-4 ${
										answer.isCorrect
											? "border-green-500 bg-green-50 dark:bg-green-950/20"
											: "border-border"
									}`}
								>
									{answer.isCorrect ? (
										<CheckCircle className="h-5 w-5 shrink-0 text-green-600" />
									) : (
										<XCircle className="h-5 w-5 shrink-0 text-muted-foreground" />
									)}
									<span
										className={
											answer.isCorrect
												? "font-medium text-green-700 dark:text-green-400"
												: ""
										}
									>
										{answer.content}
									</span>
									{answer.isCorrect && (
										<Badge
											variant="secondary"
											className="ml-auto bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400"
										>
											Correct
										</Badge>
									)}
								</li>
							))}
						</ul>
					</CardContent>
				</Card>

				{question.explanation && (
					<Card>
						<CardHeader>
							<CardTitle>Explanation</CardTitle>
							<CardDescription>Shown to users after answering</CardDescription>
						</CardHeader>
						<CardContent>
							<p className="text-muted-foreground">{question.explanation}</p>
						</CardContent>
					</Card>
				)}

				<Card>
					<CardHeader>
						<CardTitle>Metadata</CardTitle>
					</CardHeader>
					<CardContent>
						<dl className="grid grid-cols-2 gap-4">
							<div>
								<dt className="mb-1 font-medium text-muted-foreground text-sm">
									Theme
								</dt>
								<dd>
									{theme ? (
										<Badge
											variant="secondary"
											style={{
												backgroundColor: theme.color ?? undefined,
												color: theme.color ? "#fff" : undefined,
											}}
										>
											{theme.name}
										</Badge>
									) : (
										<span className="text-muted-foreground">-</span>
									)}
								</dd>
							</div>
							<div>
								<dt className="mb-1 font-medium text-muted-foreground text-sm">
									Difficulty
								</dt>
								<dd>
									{difficulty ? (
										<Badge
											variant="outline"
											style={{
												borderColor: difficulty.color ?? undefined,
												color: difficulty.color ?? undefined,
											}}
										>
											{difficulty.name}
										</Badge>
									) : (
										<span className="text-muted-foreground">-</span>
									)}
								</dd>
							</div>
							<div>
								<dt className="mb-1 font-medium text-muted-foreground text-sm">
									Question ID
								</dt>
								<dd className="font-mono text-sm">{question.id}</dd>
							</div>
							<div>
								<dt className="mb-1 font-medium text-muted-foreground text-sm">
									Last Updated
								</dt>
								<dd className="text-sm">
									{new Date(question.updatedAt).toLocaleString()}
								</dd>
							</div>
						</dl>
					</CardContent>
				</Card>
			</div>
		</div>
	);
}
