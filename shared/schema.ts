import { pgTable, text, serial, integer, boolean, timestamp, real } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
});

export const emergencyContacts = pgTable("emergency_contacts", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull(),
  name: text("name").notNull(),
  phone: text("phone").notNull(),
  email: text("email"),
  relationship: text("relationship"),
  isPrimary: boolean("is_primary").default(false),
});

export const alertLogs = pgTable("alert_logs", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull(),
  alertType: text("alert_type").notNull(), // 'keyboard', 'voice', 'manual'
  status: text("status").notNull(), // 'triggered', 'sent', 'failed'
  location: text("location"), // JSON string with lat/lng
  message: text("message"),
  timestamp: timestamp("timestamp").defaultNow(),
});

export const userSettings = pgTable("user_settings", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull(),
  aiTone: text("ai_tone").default("calm"), // 'calm', 'urgent', 'professional'
  autoEscalation: boolean("auto_escalation").default(true),
  contextAwareness: boolean("context_awareness").default(true),
  voiceMode: text("voice_mode").default("always"), // 'always', 'push', 'keyword'
  language: text("language").default("en"),
  theme: text("theme").default("dark"),
  accentColor: text("accent_color").default("#99CC00"),
});

export const insertUserSchema = createInsertSchema(users).omit({
  id: true,
});

export const insertEmergencyContactSchema = createInsertSchema(emergencyContacts).omit({
  id: true,
});

export const insertAlertLogSchema = createInsertSchema(alertLogs).omit({
  id: true,
  timestamp: true,
});

export const insertUserSettingsSchema = createInsertSchema(userSettings).omit({
  id: true,
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;

export type InsertEmergencyContact = z.infer<typeof insertEmergencyContactSchema>;
export type EmergencyContact = typeof emergencyContacts.$inferSelect;

export type InsertAlertLog = z.infer<typeof insertAlertLogSchema>;
export type AlertLog = typeof alertLogs.$inferSelect;

export type InsertUserSettings = z.infer<typeof insertUserSettingsSchema>;
export type UserSettings = typeof userSettings.$inferSelect;
