document.addEventListener('DOMContentLoaded', () => {
  const params = new URLSearchParams(window.location.search);
  const accessToken = params.get('access_token');

  const loginBtn = document.getElementById('loginBtn');
  const loginSection = document.getElementById('login');
  const moodSection = document.getElementById('moodSection');
  const playerSection = document.getElementById('playerSection');
  const backBtn = document.getElementById('backBtn');
  const spotifyPlayer = document.getElementById('spotifyPlayer');
  const playlistTitle = document.getElementById('playlistTitle');

  const moodPlaylists = {
    happy: "37i9dQZF1DXdPec7aLTmlC",
    sad: "3p16N3kxHFwRAakp204mMe",
    relaxed: "37i9dQZF1DX4WYpdgoIcn6",
    energetic: "37i9dQZF1DX70RN3TfWWJh"
  };

  if (loginBtn) {
    loginBtn.addEventListener('click', () => {
      window.location.href = '/login';
    });
  }

  if (accessToken) {
    loginSection.style.display = 'none';
    moodSection.style.display = 'block';
  } else {
    loginSection.style.display = '';
    moodSection.style.display = 'none';
    playerSection.style.display = 'none';
  }

  document.querySelectorAll('.mood-card').forEach(btn => {
    btn.addEventListener('click', () => {
      const mood = btn.dataset.mood;
      const playlistId = moodPlaylists[mood];

      if (!playlistId) return;

      playlistTitle.textContent = `Now Playing: ${mood.charAt(0).toUpperCase() + mood.slice(1)} Vibes`;
      spotifyPlayer.src = `https://open.spotify.com/embed/playlist/${playlistId}?utm_source=generator&theme=0`;

      moodSection.style.display = 'none';
      playerSection.style.display = 'block';
    });
  });

  if (backBtn) {
    backBtn.addEventListener('click', () => {
      spotifyPlayer.src = '';
      playerSection.style.display = 'none';
      moodSection.style.display = 'block';
    });
  }
});
