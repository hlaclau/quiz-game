import { createFileRoute, redirect, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";
import { getUser } from "@/functions/get-user";
import { useQuestions } from "@/hooks/use-questions";
import { useThemes } from "@/hooks/use-themes";

export const Route = createFileRoute("/dashboard")({
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

const ITEMS_PER_PAGE = 10;

function SkeletonRow() {
	return (
		<TableRow>
			<TableCell>
				<Skeleton className="h-4 w-full" />
			</TableCell>
			<TableCell>
				<Skeleton className="h-4 w-20" />
			</TableCell>
			<TableCell>
				<Skeleton className="h-4 w-16" />
			</TableCell>
			<TableCell>
				<Skeleton className="h-4 w-24" />
			</TableCell>
		</TableRow>
	);
}

function RouteComponent() {
	const { session } = Route.useRouteContext();
	const navigate = useNavigate();
	const [page, setPage] = useState(1);
	const [themeFilter, setThemeFilter] = useState<string | undefined>(undefined);

	const { data: questionsData, isLoading: isLoadingQuestions } = useQuestions({
		page,
		limit: ITEMS_PER_PAGE,
		themeId: themeFilter,
	});

	const { data: themesData } = useThemes();

	const themeMap = new Map(
		themesData?.data.map((theme) => [theme.id, theme]) ?? [],
	);

	const handlePreviousPage = () => {
		setPage((p) => Math.max(1, p - 1));
	};

	const handleNextPage = () => {
		if (questionsData && page < questionsData.totalPages) {
			setPage((p) => p + 1);
		}
	};

	const handleThemeChange = (value: string) => {
		setThemeFilter(value === "all" ? undefined : value);
		setPage(1);
	};

	return (
		<div className="container mx-auto px-4 py-8">
			<div className="mb-8">
				<h1 className="font-bold text-3xl">Dashboard</h1>
				<p className="mt-2 text-muted-foreground">
					Welcome back, {session?.user.name}!
				</p>
			</div>

			<div className="space-y-4">
				<div className="flex items-center justify-between">
					<h2 className="font-semibold text-xl">Questions</h2>
					<div className="flex items-center gap-4">
						<Select
							value={themeFilter ?? "all"}
							onValueChange={handleThemeChange}
						>
							<SelectTrigger className="w-[200px]">
								<SelectValue placeholder="Filter by theme" />
							</SelectTrigger>
							<SelectContent>
								<SelectItem value="all">All themes</SelectItem>
								{themesData?.data.map((theme) => (
									<SelectItem key={theme.id} value={theme.id}>
										{theme.name}
									</SelectItem>
								))}
							</SelectContent>
						</Select>
					</div>
				</div>

				<div className="rounded-md border">
					<Table>
						<TableHeader>
							<TableRow>
								<TableHead className="w-[400px]">Question</TableHead>
								<TableHead>Theme</TableHead>
								<TableHead>Status</TableHead>
								<TableHead>Created</TableHead>
							</TableRow>
						</TableHeader>
						<TableBody>
							{isLoadingQuestions ? (
								<>
									<SkeletonRow />
									<SkeletonRow />
									<SkeletonRow />
									<SkeletonRow />
									<SkeletonRow />
								</>
							) : questionsData?.data.length === 0 ? (
								<TableRow>
									<TableCell
										colSpan={4}
										className="h-24 text-center text-muted-foreground"
									>
										No questions found.
									</TableCell>
								</TableRow>
							) : (
								questionsData?.data.map((question) => {
									const theme = themeMap.get(question.themeId);
									return (
										<TableRow
											key={question.id}
											className="cursor-pointer hover:bg-muted/50"
											onClick={() =>
												navigate({
													to: "/questions/$id",
													params: { id: question.id },
												})
											}
										>
											<TableCell className="font-medium">
												{question.content.length > 80
													? `${question.content.substring(0, 80)}...`
													: question.content}
											</TableCell>
											<TableCell>
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
											</TableCell>
											<TableCell>
												<Badge
													variant={question.validated ? "default" : "outline"}
												>
													{question.validated ? "Validated" : "Pending"}
												</Badge>
											</TableCell>
											<TableCell className="text-muted-foreground">
												{new Date(question.createdAt).toLocaleDateString()}
											</TableCell>
										</TableRow>
									);
								})
							)}
						</TableBody>
					</Table>
				</div>

				{questionsData && questionsData.totalPages > 0 && (
					<div className="flex items-center justify-between">
						<p className="text-muted-foreground text-sm">
							Showing {(page - 1) * ITEMS_PER_PAGE + 1} to{" "}
							{Math.min(page * ITEMS_PER_PAGE, questionsData.total)} of{" "}
							{questionsData.total} questions
						</p>
						<div className="flex items-center gap-2">
							<Button
								variant="outline"
								size="sm"
								onClick={handlePreviousPage}
								disabled={page === 1}
							>
								Previous
							</Button>
							<span className="text-sm">
								Page {page} of {questionsData.totalPages}
							</span>
							<Button
								variant="outline"
								size="sm"
								onClick={handleNextPage}
								disabled={page >= questionsData.totalPages}
							>
								Next
							</Button>
						</div>
					</div>
				)}
			</div>
		</div>
	);
}
