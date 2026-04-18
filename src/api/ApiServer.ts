import express, { Request, Response } from "express";
import { ConfigManager } from "../configs/ConfigManager.js";
import chalk from "chalk";

export class ApiServer {
  private app = express();
  private configManager: ConfigManager;
  private port: number;

  constructor(configManager: ConfigManager, port = 3000) {
    this.configManager = configManager;
    this.port = port;
    this.app.set("json spaces", 2);
    this.setupRoutes();
  }

  private setupRoutes(): void {
    this.app.get("/health", (_req: Request, res: Response) => {
      res.json({ status: "ok", timestamp: new Date().toISOString() });
    });

    this.app.get("/api/free-games", async (_req: Request, res: Response) => {
      const platforms = this.configManager.createPlatforms();

      const platformResults = await Promise.all(
        platforms.map(async (platform) => {
          try {
            const games = await platform.fetchFreeGames();
            return { platform: platform.getName(), games, error: null };
          } catch (error) {
            return { platform: platform.getName(), games: [], error: String(error) };
          }
        }),
      );

      const games = platformResults.flatMap(({ platform, games }) =>
        games.map((game) => ({
          platform,
          title: game.title,
          url: game.url,
          iconUrl: game.iconUrl,
        })),
      );

      const errors = platformResults
        .filter((r) => r.error)
        .map((r) => ({ platform: r.platform, error: r.error }));

      res.json({
        success: true,
        fetchedAt: new Date().toISOString(),
        totalGames: games.length,
        games,
        ...(errors.length > 0 && { errors }),
      });
    });
  }

  public start(): void {
    this.app.listen(this.port, "0.0.0.0", () => {
      console.log(chalk.cyan(`API server running on port ${this.port}`));
      console.log(chalk.cyan(`  GET /health`));
      console.log(chalk.cyan(`  GET /api/free-games`));
    });
  }
}
