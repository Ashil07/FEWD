const params = new URLSearchParams(window.location.search);
const accessToken = params.get("access_token");

document.getElementById("loginBtn").addEventListener("click", () => {
  window.location.href = "/login";
});

if (accessToken) {
  document.getElementById("login").style.display = "none";
  document.getElementById("moodSection").style.display = "block";
}

const moodPlaylists = {
  happy: "37i9dQZF1DXdPec7aLTmlC",
  sad: "37i9dQZF1DWVrtsSlLKzro",
  relaxed: "37i9dQZF1DX4WYpdgoIcn6",
  energetic: "37i9dQZF1DX70RN3TfWWJh",
};

document.querySelectorAll(".mood").forEach((btn) => {
  btn.addEventListener("click", () => {
    const mood = btn.dataset.mood;
    const playlistId = moodPlaylists[mood];
    document.getElementById("moodSection").style.display = "none";
    document.getElementById("playerSection").style.display = "block";
    document.getElementById("playlistTitle").textContent = `Now Playing: ${mood.toUpperCase()} Vibes`;
    document.getElementById("spotifyPlayer").src =
      `https://open.spotify.com/embed/playlist/${playlistId}?utm_source=generator&theme=0`;
  });
});
