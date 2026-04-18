import chalk from "chalk";
import { Scheduler } from "./Scheduler.js";
import { ConfigManager } from "./configs/ConfigManager.js";
import { ApiServer } from "./api/ApiServer.js";

export class Manager {
  private configManager: ConfigManager;
  private scheduler: Scheduler;
  private apiServer: ApiServer;

  constructor() {
    this.printWelcomeMessage();
    this.configManager = new ConfigManager();
  }

  public run(): void {
    this.loadConfig();
    this.scheduler = this.configManager.createScheduler();
    this.printSchedule();
    const port = parseInt(process.env.PORT ?? "3000", 10);
    this.apiServer = new ApiServer(this.configManager, port);
    this.apiServer.start();
  }

  public loadConfig(): void {
    console.log("Loading configuration...");
    try {
      this.configManager.loadConfig();
      console.log(chalk.green("Configuration loaded successfully!"));
      this.printDivider();
    } catch (error) {
      console.error(chalk.red(`Error loading configuration: ${error.message}`));
      process.exit(1);
    }
  }

  public printSchedule(): void {
    this.scheduler.printSchedule();
  }

  private printWelcomeMessage(): void {
    console.log(chalk.bold.green("Welcome to the Free Game Notifier!"));
    this.printDivider();
  }

  private printDivider(): void {
    console.log(chalk.yellow("================================="));
  }
}
