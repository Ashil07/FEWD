import express from "express";
import dotenv from "dotenv";
import axios from "axios";
import querystring from "querystring";
import path from "path";
import { fileURLToPath } from "url";

dotenv.config();
const app = express();
// __dirname is not defined in ES module scope; recreate it from import.meta.url
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Allow devtools / Live Server connections (adjust origins as needed)
app.use((req, res, next) => {
  // Relax CSP to allow inline styles (used by script) and Spotify embeds.
  // Adjust origins as needed for production.
  res.setHeader(
    "Content-Security-Policy",
    "default-src 'self'; " +
      "connect-src 'self' http://127.0.0.1:5500 http://localhost:8888 https://accounts.spotify.com http://127.0.0.1:8888/callback https://api.spotify.com ; " +
      "style-src 'self' 'unsafe-inline'; " +
      "frame-src 'self' https://open.spotify.com; " +
      "img-src 'self' data:;"
  );
  next();
});

app.use(express.static(path.join(__dirname, "public")));

const client_id = process.env.SPOTIFY_CLIENT_ID;
const client_secret = process.env.SPOTIFY_CLIENT_SECRET;
const redirect_uri = process.env.REDIRECT_URI;

// Helpful debug output (will NOT log the client secret)
console.log(`Using SPOTIFY_CLIENT_ID=${client_id ? 'yes' : 'missing'}, REDIRECT_URI=${redirect_uri}`);

app.get("/login", (req, res) => {
  const scope = "user-read-playback-state user-modify-playback-state streaming";
  const auth_url =
    "https://accounts.spotify.com/authorize?" +
    querystring.stringify({
      response_type: "code",
      client_id,
      scope,
      redirect_uri,
    });
  res.redirect(auth_url);
});

app.get("/callback", async (req, res) => {
  const code = req.query.code || null;
  try {
    const tokenRes = await axios.post(
      "https://accounts.spotify.com/api/token",
      querystring.stringify({
        grant_type: "authorization_code",
        code,
        redirect_uri,
        client_id,
        client_secret,
      }),
      { headers: { "Content-Type": "application/x-www-form-urlencoded" } }
    );
    const { access_token } = tokenRes.data;
    res.redirect(`/index.html?access_token=${access_token}`);
  } catch (err) {
    // Log full error details from Spotify to help diagnose INVALID_CLIENT
    console.error('Token exchange error:', err.response?.data || err.message || err);
    res.status(500).send("Error getting token");
  }
});

const PORT = process.env.PORT || 8888;
app.listen(PORT, () =>
  console.log(`Server running on http://localhost:${PORT}`)
);
