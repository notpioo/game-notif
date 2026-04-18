import fetch from "node-fetch";
import { Notifier } from "./Notifier.js";
import { Game } from "../games/Game.js";
import { WhatsAppSettings } from "../configs/types/types.js";

const CALLMEBOT_URL = "https://api.callmebot.com/whatsapp.php";

export class WhatsAppChannel extends Notifier {
  private settings: WhatsAppSettings;

  constructor(settings: WhatsAppSettings) {
    super();
    this.settings = settings;
  }

  async send(game: Game): Promise<void> {
    const message = `🎮 *Game Gratis!*\n\n*${game.title}*\n\nKlaim sekarang: ${game.url}`;

    const url = `${CALLMEBOT_URL}?phone=${encodeURIComponent(this.settings.phoneNumber)}&text=${encodeURIComponent(message)}&apikey=${encodeURIComponent(this.settings.apiKey)}`;

    try {
      const response = await fetch(url);

      if (!response.ok) {
        throw new Error(
          `Failed to send WhatsApp notification: ${response.statusText}`,
        );
      }

      this.logSuccess();
    } catch (error) {
      this.logError(error);
      throw error;
    }
  }
}
