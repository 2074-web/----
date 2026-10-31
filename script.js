const songVideo = document.querySelector(".song-video");
const audioStatus = document.querySelector("#audio-status");

const countdownValues = {
  days: document.querySelector("#countdown-days"),
  hours: document.querySelector("#countdown-hours"),
  mins: document.querySelector("#countdown-mins"),
  secs: document.querySelector("#countdown-secs"),
};
const countdownTabs = Array.from(document.querySelectorAll(".countdown__tab"));
const countdownPanel = document.querySelector("#countdown-panel");
const countdownTitle = document.querySelector("#countdown-title");
const countdownDate = document.querySelector("#countdown-date");
const countdownMessage = document.querySelector("#countdown-message");
const countdownLocation = document.querySelector("#countdown-location");

const concerts = [
  {
    tabLabel: "TOKYO D1",
    title: "TOKYO DOME — DAY 1",
    location: "東京，日本",
    datetime: "2027-03-20T19:30:00+09:00",
  },
  {
    tabLabel: "TOKYO D2",
    title: "TOKYO DOME — DAY 2",
    location: "東京，日本",
    datetime: "2027-03-21T19:30:00+09:00",
  },
  {
    tabLabel: "TAIPEI D1",
    title: "TAIPEI ARENA — DAY 1",
    location: "臺北，臺灣",
    datetime: "2027-04-10T19:30:00+08:00",
  },
  {
    tabLabel: "TAIPEI D2",
    title: "TAIPEI ARENA — DAY 2",
    location: "臺北，臺灣",
    datetime: "2027-04-11T19:30:00+08:00",
  },
];

if (
  Object.values(countdownValues).every((value) => value instanceof HTMLElement) &&
  countdownTabs.length === concerts.length &&
  countdownTabs.every((tab) => tab instanceof HTMLButtonElement) &&
  countdownPanel instanceof HTMLElement &&
  countdownTitle instanceof HTMLElement &&
  countdownLocation instanceof HTMLElement &&
  countdownDate instanceof HTMLTimeElement &&
  countdownMessage instanceof HTMLElement
) {
  const scheduledConcerts = concerts.map((concert) => ({
    ...concert,
    timestamp: Date.parse(concert.datetime),
  }));
  const nearestUpcomingIndex = scheduledConcerts.findIndex(
    (concert) => concert.timestamp > Date.now(),
  );
  let selectedConcertIndex =
    nearestUpcomingIndex === -1 ? concerts.length - 1 : nearestUpcomingIndex;

  const updateCountdown = () => {
    const now = Date.now();
    const concert = scheduledConcerts[selectedConcertIndex];
    const remaining = concert.timestamp - now;

    countdownTitle.textContent =
      remaining <= 0 ? concert.title : `NEXT SHOW: ${concert.title}`;
    countdownLocation.textContent = concert.location;
    countdownDate.dateTime = concert.datetime;
    countdownDate.textContent = new Intl.DateTimeFormat("zh-TW", {
      dateStyle: "long",
      timeStyle: "short",
    }).format(concert.timestamp);

    if (remaining <= 0) {
      Object.values(countdownValues).forEach((value) => {
        value.textContent = "00";
      });
      countdownMessage.textContent = "THIS SHOW HAS ENDED";
      countdownMessage.hidden = false;
      return;
    }

    const days = Math.floor(remaining / (1000 * 60 * 60 * 24));
    const hours = Math.floor((remaining / (1000 * 60 * 60)) % 24);
    const mins = Math.floor((remaining / (1000 * 60)) % 60);
    const secs = Math.floor((remaining / 1000) % 60);

    countdownMessage.hidden = true;
    countdownValues.days.textContent = String(days).padStart(2, "0");
    countdownValues.hours.textContent = String(hours).padStart(2, "0");
    countdownValues.mins.textContent = String(mins).padStart(2, "0");
    countdownValues.secs.textContent = String(secs).padStart(2, "0");
  };

  const selectConcert = (index, moveFocus = false) => {
    selectedConcertIndex = index;
    countdownTabs.forEach((tab, tabIndex) => {
      const isSelected = tabIndex === selectedConcertIndex;
      tab.setAttribute("aria-selected", String(isSelected));
      tab.tabIndex = isSelected ? 0 : -1;
    });
    countdownPanel.setAttribute(
      "aria-labelledby",
      countdownTabs[selectedConcertIndex].id,
    );
    if (moveFocus) {
      countdownTabs[selectedConcertIndex].focus();
    }
    updateCountdown();
  };

  countdownTabs.forEach((tab, index) => {
    tab.textContent = concerts[index].tabLabel;
    tab.addEventListener("click", () => selectConcert(index));
    tab.addEventListener("keydown", (event) => {
      let nextIndex = index;
      if (event.key === "ArrowRight") {
        nextIndex = (index + 1) % countdownTabs.length;
      } else if (event.key === "ArrowLeft") {
        nextIndex = (index - 1 + countdownTabs.length) % countdownTabs.length;
      } else if (event.key === "Home") {
        nextIndex = 0;
      } else if (event.key === "End") {
        nextIndex = countdownTabs.length - 1;
      } else {
        return;
      }

      event.preventDefault();
      selectConcert(nextIndex, true);
    });
  });

  selectConcert(selectedConcertIndex);
  window.setInterval(updateCountdown, 1000);
}

if (songVideo instanceof HTMLVideoElement && audioStatus instanceof HTMLElement) {
  songVideo.addEventListener("error", () => {
    audioStatus.textContent = "無法載入影片，請確認 Kyoukaisen.mp4 已放在網站資料夾中。";
  });

  songVideo.addEventListener("loadedmetadata", () => {
    audioStatus.textContent = "影片已就緒，可以開始播放。";
  });
}