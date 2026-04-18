import fetch from "node-fetch";
import { GamePlatform } from "./GamePlatform.js";
import { GOGSettings } from "../configs/types/types.js";
import { Game } from "../games/Game.js";

const GOG_FREE_GAMES_URL =
  "https://www.gog.com/games/ajax/filtered?mediaType=game&price=free&sort=popularity&page=1";

export class GOGPlatform extends GamePlatform {
  constructor(settings: GOGSettings) {
    super("GOG", settings);
  }

  async fetchFreeGames(): Promise<Game[]> {
    console.log(`Fetching free games from GOG...`);
    try {
      const response = await fetch(GOG_FREE_GAMES_URL, {
        headers: {
          "User-Agent":
            "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
          Accept: "application/json",
        },
      });

      if (!response.ok) {
        throw new Error(
          `Failed to fetch from GOG: ${response.status} ${response.statusText}`,
        );
      }

      const json = (await response.json()) as any;
      const products: any[] = json?.products ?? [];

      return products.map((item: any) => {
        const title = item.title ?? "Unknown";
        const slug = item.slug ?? "";
        const url = `https://www.gog.com/game/${slug}`;
        const iconUrl = item.image
          ? `https:${item.image}.jpg`
          : "";
        return new Game(title, url, iconUrl);
      });
    } catch (error) {
      this.logError(error, "Error fetching free games from GOG");
      throw error;
    }
  }
}
