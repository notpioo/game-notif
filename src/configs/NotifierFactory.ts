import { DiscordChannel as DiscordNotifier } from "../notifiers/DiscordChannel.js";
import { Notifier } from "../notifiers/Notifier.js";
import { NtfyChannel } from "../notifiers/NtfyChannel.js";
import { WhatsAppChannel } from "../notifiers/WhatsAppChannel.js";
import { DiscordSettings, NtfySettings, WhatsAppSettings } from "./types/types.js";

export interface NotifierFactory {
  create(settings: any): Notifier;
}

export class NtfyNotifierFactory implements NotifierFactory {
  create(settings: NtfySettings): Notifier {
    return new NtfyChannel(settings);
  }
}

export class DiscordNotifierFactory implements NotifierFactory {
  create(settings: DiscordSettings): Notifier {
    return new DiscordNotifier(settings);
  }
}

export class WhatsAppNotifierFactory implements NotifierFactory {
  create(settings: WhatsAppSettings): Notifier {
    return new WhatsAppChannel(settings);
  }
}
