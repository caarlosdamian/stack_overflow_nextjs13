import * as z from "zod"

export const QuestionsSchema = z.object({
  title: z.string().min(5).max(130),
  explanation: z.string().min(100),
  tags: z.array(z.string().min(1).max(15)).min(1).max(3),
})

export const AnswerSchema = z.object({
  answer: z.string().min(100),
})

export const ProfileSchema = z.object({
  location: z.string(),
  username: z.string(),
  name: z.string(),
  bio: z.string(),
  portfolioWebsite: z.string().url().optional(),
})