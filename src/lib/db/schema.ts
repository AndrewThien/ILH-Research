import {integer, pgTable, serial, text, timestamp, varchar, numeric, } from "drizzle-orm/pg-core"


export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  created_at: timestamp("created_at").notNull().defaultNow(),
  user_id: varchar("user_id", {length:256}).notNull(),
  cat1: numeric("category_1", {precision: 2}).notNull(),
  cat2: numeric("category_2", {precision: 2}).notNull(),
  cat3: numeric("category_3", {precision: 2}).notNull(),
  avg: numeric("average_score", {precision: 2}).notNull(),
})

export const questions = pgTable("questions", {
    id: serial("id").primaryKey(),
    created_at: timestamp("created_at").notNull().defaultNow(),
    questions: text("questions").notNull(),
    category: integer("category").notNull(),
})


export const choices = pgTable("choices", {
    id: serial("id").primaryKey(),
    created_at: timestamp("created_at").notNull().defaultNow(),
    question_id: integer("question_id").references(()=>questions.id).notNull(),
    choice: text("choice").notNull(),
    score: numeric("score", {precision: 2}).notNull(),
})
