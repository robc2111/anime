// app.js

import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import animeRoutes from './routes/anime.js';
import bodyParser from 'body-parser';
import { getTopRatedAnime } from './utils/anilist.js'; // <-- Import
import { affiliateMap } from './utils/affiliateLinks.js';

const app = express();
const PORT = process.env.PORT || 3000;

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(express.static('public'));
app.use(bodyParser.urlencoded({ extended: true }));
app.use('/anime', animeRoutes);

// 🥇 Get and show top-rated anime
import { getFilteredAnime } from './utils/anilist.js';

app.get('/', async (req, res) => {
  try {
    const { status, genre, service, minScore } = req.query;
    const anime = await getFilteredAnime({ status, genre, service, minScore });
    res.render('anime.ejs', { anime, req });
  } catch (err) {
    console.error('❌ Error fetching anime:', err.response?.errors || err.message || err);
    res.status(500).send('Failed to fetch anime');
  }
});



app.get('/', async (req, res) => {
  try {
    const { status, genre, service, minScore } = req.query;
    let anime = await getFilteredAnime({ status, genre, service, minScore });

    anime = anime.map(show => ({
      ...show,
      externalLinks: show.externalLinks.map(link => ({
        ...link,
        url: affiliateMap[link.site] || link.url
      }))
    }));

    res.render('anime.ejs', { anime, req });
  } catch (err) {
    console.error('❌ Error fetching anime:', err);
    res.status(500).send('Failed to fetch anime');
  }
});

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});