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
        const airingTopResponse = await axios.get('https://api.jikan.moe/v4/top/anime', {
        params: {
            type: 'tv',
            sfw: true,
            limit: 10,
            filter: 'airing'
        }
    });

    const airingTopData = airingTopResponse.data.data;

    const uniqueIds = new Set<number>();
    const airingTop = airingTopData
    .filter(anime => {
        if (uniqueIds.has(anime.mal_id)) return false;
        uniqueIds.add(anime.mal_id);
        return true;
    })
    .slice(0, 5)
    .map(anime => ({
        mal_id: anime.mal_id,
        images: anime.images.webp.image_url,
        title: anime.title,
        type: anime.type,
        episodes: anime.episodes,
    }));


    res.json({airingTop: airingTop});
    } catch (error) {
        console.error('Error fetching anime details for home page', error);
        res.status(500).json({ error: 'Failed to fetch anime data' });
    }
});

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));