import express from 'express';
import cors from 'cors';
import axios from 'axios';
import dotenv from 'dotenv';
dotenv.config();

const PORT = process.env.PORT
const app = express();

app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
    res.json('template');
});

app.get('/home', async (req, res) => {
    try {
        const animeTopResponse = await axios.get('https://api.jikan.moe/v4/top/anime', {
        params: {
            type: 'tv',
            sfw: true,
            limit: 5
        }
    });

    const animeTopData = animeTopResponse.data.data;

    const animeTop = animeTopData.map(anime => ({
        images: anime.images.webp.image_url,
        title: anime.title_english,
        type: anime.type,
        episodes: anime.episodes,

    }))

    res.json({animeTop:animeTop});
    } catch (error) {
        console.error('Error fetching anime details for home page', error);
        res.status(500).json({ error: 'Failed to fetch anime data' });
    }
});

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));