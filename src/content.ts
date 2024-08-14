let autoPlayEnabled = true;
let isPausedManually = false;

function checkIfEnabled() {
  chrome.storage.sync.get("autoPlayEnabled", result => {
    autoPlayEnabled = result.autoPlayEnabled ?? true;
    handleVisibilityChange();
  });
}

function handleVisibilityChange() {
  const videoElement = document.querySelector("video") as HTMLVideoElement;

  if (!autoPlayEnabled) return;

  if (document.visibilityState === "visible" && !isPausedManually) {
    videoElement?.play();
  } else {
    videoElement?.pause();
  }
}

function handlePlay() {
  isPausedManually = false;
}

function handlePause() {
  if (document.visibilityState === "visible") {
    isPausedManually = true;
  }
}

// Check initial state when the script loads
checkIfEnabled();

document.addEventListener("visibilitychange", handleVisibilityChange);
document.addEventListener("play", handlePlay, { capture: true });
document.addEventListener("pause", handlePause, { capture: true });

chrome.runtime.onMessage.addListener(message => {
  if (message.action === "toggleAutoPlay") {
    autoPlayEnabled = message.value;
    handleVisibilityChange();
  } else if (message.action === "focus") {
    if (autoPlayEnabled && !isPausedManually) {
      document.querySelector("video")?.play();
    }
  } else if (message.action === "blur") {
    if (autoPlayEnabled) {
      document.querySelector("video")?.pause();
    }
  }
});

// Re-check enabled state when the tab becomes active
document.addEventListener("visibilitychange", () => {
  if (document.visibilityState === "visible") {
    checkIfEnabled();
  }
});
