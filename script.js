const songVideo = document.querySelector(".song-video");
const audioStatus = document.querySelector("#audio-status");

if (songVideo instanceof HTMLVideoElement && audioStatus instanceof HTMLElement) {
  songVideo.addEventListener("error", () => {
    audioStatus.textContent = "無法載入影片，請確認 Kyoukaisen.mp4 已放在網站資料夾中。";
  });

  songVideo.addEventListener("loadedmetadata", () => {
    audioStatus.textContent = "影片已就緒，可以開始播放。";
  });
}