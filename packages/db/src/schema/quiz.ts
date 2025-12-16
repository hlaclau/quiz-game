import { relations } from "drizzle-orm";
import {
	boolean,
	index,
	integer,
	pgTable,
	primaryKey,
	text,
	timestamp,
} from "drizzle-orm/pg-core";
import { user } from "./auth";

export const theme = pgTable("theme", {
	id: text("id").primaryKey(),
	name: text("name").notNull().unique(),
	description: text("description"),
	color: text("color"),
	createdAt: timestamp("created_at").defaultNow().notNull(),
	updatedAt: timestamp("updated_at")
		.defaultNow()
		.$onUpdate(() => new Date())
		.notNull(),
});

export const tag = pgTable("tag", {
	id: text("id").primaryKey(),
	name: text("name").notNull().unique(),
	createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const question = pgTable(
	"question",
	{
		id: text("id").primaryKey(),
		content: text("content").notNull(),
		explanation: text("explanation"),
		difficulty: integer("difficulty"), // 1=easy, 2=medium, 3=hard
		themeId: text("theme_id")
			.notNull()
			.references(() => theme.id, { onDelete: "cascade" }),
		authorId: text("author_id")
			.notNull()
			.references(() => user.id, { onDelete: "cascade" }),
		createdAt: timestamp("created_at").defaultNow().notNull(),
		updatedAt: timestamp("updated_at")
			.defaultNow()
			.$onUpdate(() => new Date())
			.notNull(),
	},
	(table) => [
		index("question_theme_id_idx").on(table.themeId),
		index("question_author_id_idx").on(table.authorId),
	],
);

export const answer = pgTable(
	"answer",
	{
		id: text("id").primaryKey(),
		content: text("content").notNull(),
		isCorrect: boolean("is_correct").notNull().default(false),
		questionId: text("question_id")
			.notNull()
			.references(() => question.id, { onDelete: "cascade" }),
		createdAt: timestamp("created_at").defaultNow().notNull(),
	},
	(table) => [index("answer_question_id_idx").on(table.questionId)],
);

export const questionTag = pgTable(
	"question_tag",
	{
		questionId: text("question_id")
			.notNull()
			.references(() => question.id, { onDelete: "cascade" }),
		tagId: text("tag_id")
			.notNull()
			.references(() => tag.id, { onDelete: "cascade" }),
	},
	(table) => [
		primaryKey({ columns: [table.questionId, table.tagId] }),
		index("question_tag_question_id_idx").on(table.questionId),
		index("question_tag_tag_id_idx").on(table.tagId),
	],
);

// Relations
export const themeRelations = relations(theme, ({ many }) => ({
	questions: many(question),
}));

export const tagRelations = relations(tag, ({ many }) => ({
	questionTags: many(questionTag),
}));

export const questionRelations = relations(question, ({ one, many }) => ({
	theme: one(theme, {
		fields: [question.themeId],
		references: [theme.id],
	}),
	author: one(user, {
		fields: [question.authorId],
		references: [user.id],
	}),
	answers: many(answer),
	questionTags: many(questionTag),
}));

export const answerRelations = relations(answer, ({ one }) => ({
	question: one(question, {
		fields: [answer.questionId],
		references: [question.id],
	}),
}));

export const questionTagRelations = relations(questionTag, ({ one }) => ({
	question: one(question, {
		fields: [questionTag.questionId],
		references: [question.id],
	}),
	tag: one(tag, {
		fields: [questionTag.tagId],
		references: [tag.id],
	}),
}));
