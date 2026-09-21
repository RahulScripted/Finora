import { createAudioPlayer, type AudioPlayer } from "expo-audio";

const sources = {
  success: require("@assets/sounds/success.mp3"),
  failure: require("@assets/sounds/failure.mp3"),
  notification: require("@assets/sounds/notification.mp3"),
};

const cache: Partial<Record<keyof typeof sources, AudioPlayer>> = {};

function play(key: keyof typeof sources) {
  try {
    let player = cache[key];
    if (!player) {
      player = createAudioPlayer(sources[key]);
      cache[key] = player;
    }
    player.seekTo(0);
    player.play();
  } catch {}
}

export const playSuccess = () => play("success");
export const playFailure = () => play("failure");
export const playNotification = () => play("notification");
