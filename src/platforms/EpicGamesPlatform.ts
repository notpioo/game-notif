import fetch from "node-fetch";
import { EpicGamesSettings } from "../configs/types/types.js";
import { Game } from "../games/Game.js";
import { GamePlatform } from "./GamePlatform.js";

const EPIC_FREE_GAMES_API =
  "https://store-site-backend-static.ak.epicgames.com/freeGamesPromotions?locale=en-US&country=US&allowCountries=US";

export default class EpicGamesPlatform extends GamePlatform {
  constructor(settings: EpicGamesSettings) {
    super("Epic Games", settings);
  }

  public async fetchFreeGames(): Promise<Game[]> {
    console.log(`Fetching free games from Epic Games API...`);
    try {
      const response = await fetch(EPIC_FREE_GAMES_API, {
        headers: {
          "User-Agent":
            "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
        },
      });

      if (!response.ok) {
        throw new Error(
          `Failed to fetch from Epic Games API: ${response.statusText}`,
        );
      }

      const json = (await response.json()) as any;
      const elements: any[] =
        json?.data?.Catalog?.searchStore?.elements ?? [];

      const now = new Date();
      const freeGames: Game[] = [];

      for (const item of elements) {
        if (!item.promotions) continue;

        const activeOffers =
          item.promotions.promotionalOffers?.flatMap(
            (p: any) => p.promotionalOffers,
          ) ?? [];

        const isFreeNow = activeOffers.some((offer: any) => {
          const start = new Date(offer.startDate);
          const end = new Date(offer.endDate);
          return (
            now >= start &&
            now <= end &&
            offer.discountSetting?.discountPercentage === 0
          );
        });

        if (isFreeNow) {
          const title = item.title ?? "Unknown";
          const slug =
            item.catalogNs?.mappings?.[0]?.pageSlug ??
            item.productSlug ??
            item.urlSlug ??
            "";
          const url = `https://store.epicgames.com/en-US/p/${slug}`;
          const iconUrl =
            item.keyImages?.find((img: any) => img.type === "Thumbnail")?.url ??
            item.keyImages?.[0]?.url ??
            "";
          freeGames.push(new Game(title, url, iconUrl));
        }
      }

      return freeGames;
    } catch (error) {
      this.logError(error, "Error fetching free games from Epic Games");
      throw error;
    }
  }
}
