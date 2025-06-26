// anime.js
import express from 'express';
import { getTopRatedAnime } from '../utils/anilist.js';

const router = express.Router();

router.get('/top-rated', async (req, res) => {
  try {
    const animeList = await getTopRatedAnime();
    res.render('anime-list', { animeList });
  } catch (err) {
    console.error(err);
    res.status(500).send("Failed to fetch top anime.");
  }
});

export default router;