import { createFileRoute, redirect, useNavigate } from "@tanstack/react-router";
import { ArrowUpDown } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
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
import { Switch } from "@/components/ui/switch";
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
import { useSetQuestionValidation } from "@/hooks/use-validate-question";
import type { SortField, SortOrder } from "@/lib/api";

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

type ValidationFilter = "all" | "pending" | "validated";

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
				<Skeleton className="h-4 w-24" />
			</TableCell>
			<TableCell>
				<Skeleton className="h-5 w-9" />
			</TableCell>
		</TableRow>
	);
}

function RouteComponent() {
	const { session } = Route.useRouteContext();
	const navigate = useNavigate();
	const [page, setPage] = useState(1);
	const [themeFilter, setThemeFilter] = useState<string | undefined>(undefined);
	const [validationFilter, setValidationFilter] =
		useState<ValidationFilter>("all");
	const sortBy: SortField = "createdAt";
	const [sortOrder, setSortOrder] = useState<SortOrder>("desc");

	const validatedFilterValue =
		validationFilter === "all" ? undefined : validationFilter === "validated";
	const { data: questionsData, isLoading: isLoadingQuestions } = useQuestions({
		page,
		limit: ITEMS_PER_PAGE,
		themeId: themeFilter,
		validated: validatedFilterValue,
		sortBy,
		sortOrder,
	});

	const { data: themesData } = useThemes();
	const validationMutation = useSetQuestionValidation();

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

	const handleValidationFilterChange = (value: ValidationFilter) => {
		setValidationFilter(value);
		setPage(1);
	};

	const handleSortToggle = () => {
		setSortOrder((prev) => (prev === "desc" ? "asc" : "desc"));
	};

	const handleSetValidation = async (
		questionId: string,
		validated: boolean,
	) => {
		try {
			await validationMutation.mutateAsync({ id: questionId, validated });
			toast.success(validated ? "Question validated" : "Question unvalidated");
		} catch {
			toast.error("Failed to update question validation");
		}
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
				<div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
					<h2 className="font-semibold text-xl">Questions</h2>
					<div className="flex flex-wrap items-center gap-2">
						{/* Validation Filter Tabs */}
						<div className="flex rounded-lg border bg-muted p-1">
							<Button
								variant={validationFilter === "all" ? "secondary" : "ghost"}
								size="sm"
								className="h-7 px-3"
								onClick={() => handleValidationFilterChange("all")}
							>
								All
							</Button>
							<Button
								variant={validationFilter === "pending" ? "secondary" : "ghost"}
								size="sm"
								className="h-7 px-3"
								onClick={() => handleValidationFilterChange("pending")}
							>
								Pending
							</Button>
							<Button
								variant={
									validationFilter === "validated" ? "secondary" : "ghost"
								}
								size="sm"
								className="h-7 px-3"
								onClick={() => handleValidationFilterChange("validated")}
							>
								Validated
							</Button>
						</div>

						{/* Theme Filter */}
						<Select
							value={themeFilter ?? "all"}
							onValueChange={handleThemeChange}
						>
							<SelectTrigger className="w-[160px]">
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
								<TableHead>
									<Button
										variant="ghost"
										size="sm"
										className="-ml-3 h-8 font-medium"
										onClick={handleSortToggle}
										aria-label="Toggle sort order by creation date"
									>
										Created
										<ArrowUpDown className="ml-1 h-4 w-4" aria-hidden="true" />
									</Button>
								</TableHead>
								<TableHead className="w-[100px]">Validated</TableHead>
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
										<TableRow key={question.id} className="group">
											<TableCell
												className="cursor-pointer font-medium"
												onClick={() =>
													navigate({
														to: "/questions/$id",
														params: { id: question.id },
													})
												}
											>
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
											<TableCell className="text-muted-foreground">
												{new Date(question.createdAt).toLocaleDateString()}
											</TableCell>
											<TableCell>
												<Switch
													checked={question.validated}
													disabled={validationMutation.isPending}
													onCheckedChange={(checked) =>
														handleSetValidation(question.id, checked)
													}
													aria-label="Toggle validation status for question"
												/>
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
