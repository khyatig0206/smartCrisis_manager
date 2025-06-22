import { 
  users, 
  emergencyContacts, 
  alertLogs, 
  userSettings,
  type User, 
  type InsertUser,
  type EmergencyContact,
  type InsertEmergencyContact,
  type AlertLog,
  type InsertAlertLog,
  type UserSettings,
  type InsertUserSettings
} from "@shared/schema";

export interface IStorage {
  // User methods
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  // Emergency contacts methods
  getEmergencyContacts(userId: number): Promise<EmergencyContact[]>;
  createEmergencyContact(contact: InsertEmergencyContact): Promise<EmergencyContact>;
  updateEmergencyContact(id: number, contact: Partial<InsertEmergencyContact>): Promise<EmergencyContact | undefined>;
  deleteEmergencyContact(id: number): Promise<boolean>;
  
  // Alert logs methods
  getAlertLogs(userId: number): Promise<AlertLog[]>;
  createAlertLog(log: InsertAlertLog): Promise<AlertLog>;
  
  // User settings methods
  getUserSettings(userId: number): Promise<UserSettings | undefined>;
  updateUserSettings(userId: number, settings: Partial<InsertUserSettings>): Promise<UserSettings>;
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private emergencyContacts: Map<number, EmergencyContact>;
  private alertLogs: Map<number, AlertLog>;
  private userSettings: Map<number, UserSettings>;
  private currentUserId: number;
  private currentContactId: number;
  private currentLogId: number;
  private currentSettingsId: number;

  constructor() {
    this.users = new Map();
    this.emergencyContacts = new Map();
    this.alertLogs = new Map();
    this.userSettings = new Map();
    this.currentUserId = 1;
    this.currentContactId = 1;
    this.currentLogId = 1;
    this.currentSettingsId = 1;
  }

  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.currentUserId++;
    const user: User = { ...insertUser, id };
    this.users.set(id, user);
    
    // Create default settings for new user
    const defaultSettings: UserSettings = {
      id: this.currentSettingsId++,
      userId: id,
      aiTone: "calm",
      autoEscalation: true,
      contextAwareness: true,
      voiceMode: "always",
      language: "en",
      theme: "dark",
      accentColor: "#99CC00",
    };
    this.userSettings.set(id, defaultSettings);
    
    return user;
  }

  async getEmergencyContacts(userId: number): Promise<EmergencyContact[]> {
    return Array.from(this.emergencyContacts.values()).filter(
      (contact) => contact.userId === userId
    );
  }

  async createEmergencyContact(contact: InsertEmergencyContact): Promise<EmergencyContact> {
    const id = this.currentContactId++;
    const newContact: EmergencyContact = { 
      ...contact, 
      id,
      email: contact.email || null,
      relationship: contact.relationship || null,
      isPrimary: contact.isPrimary || null
    };
    this.emergencyContacts.set(id, newContact);
    return newContact;
  }

  async updateEmergencyContact(id: number, contact: Partial<InsertEmergencyContact>): Promise<EmergencyContact | undefined> {
    const existing = this.emergencyContacts.get(id);
    if (!existing) return undefined;
    
    const updated: EmergencyContact = { ...existing, ...contact };
    this.emergencyContacts.set(id, updated);
    return updated;
  }

  async deleteEmergencyContact(id: number): Promise<boolean> {
    return this.emergencyContacts.delete(id);
  }

  async getAlertLogs(userId: number): Promise<AlertLog[]> {
    return Array.from(this.alertLogs.values())
      .filter((log) => log.userId === userId)
      .sort((a, b) => (b.timestamp?.getTime() || 0) - (a.timestamp?.getTime() || 0));
  }

  async createAlertLog(log: InsertAlertLog): Promise<AlertLog> {
    const id = this.currentLogId++;
    const newLog: AlertLog = { 
      ...log, 
      id, 
      timestamp: new Date(),
      message: log.message || null,
      location: log.location || null
    };
    this.alertLogs.set(id, newLog);
    return newLog;
  }

  async getUserSettings(userId: number): Promise<UserSettings | undefined> {
    return this.userSettings.get(userId);
  }

  async updateUserSettings(userId: number, settings: Partial<InsertUserSettings>): Promise<UserSettings> {
    const existing = this.userSettings.get(userId);
    if (!existing) {
      const newSettings: UserSettings = {
        id: this.currentSettingsId++,
        userId,
        aiTone: settings.aiTone || "calm",
        autoEscalation: settings.autoEscalation ?? true,
        contextAwareness: settings.contextAwareness ?? true,
        voiceMode: settings.voiceMode || "always",
        language: settings.language || "en",
        theme: settings.theme || "dark",
        accentColor: settings.accentColor || "#99CC00",
      };
      this.userSettings.set(userId, newSettings);
      return newSettings;
    }
    
    const updated: UserSettings = { ...existing, ...settings };
    this.userSettings.set(userId, updated);
    return updated;
  }
}

export const storage = new MemStorage();
