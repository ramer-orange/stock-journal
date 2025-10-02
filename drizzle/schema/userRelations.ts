import { relations } from "drizzle-orm";
import { users } from "./users";
import { journals } from "./journals";

export const userRelations = relations(users, ({ many }) => ({
  journals: many(journals),
}));
