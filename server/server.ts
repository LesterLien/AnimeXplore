import express, { Request, Response } from 'express';
import cors from 'cors';
import axios from 'axios';
import dotenv from 'dotenv';
dotenv.config();

const PORT = process.env.PORT;
const app = express();

app.use(cors());
app.use(express.json());

app.get('/', (req: Request, res: Response) => {
  res.json('template');
});

type AnimeData = {
  mal_id: number;
  images: { webp: { image_url: string } };
  title: string;
  type: string;
  episodes: number | null;
};

type Result = {
  key: string;
  data: {
    mal_id: number;
    images: string;
    title: string;
    type: string;
    episodes: number | null;
  }[];
};

const homeCache: {
  data: Record<string, unknown> | null;
  timestamp: number;
  ttl: number;
} = {
  data: null,
  timestamp: 0,
  ttl: 10 * 60 * 1000,
};

app.get('/home', async (req: Request, res: Response): Promise<any> => {
  const now = Date.now();

  if (homeCache.data && now - homeCache.timestamp < homeCache.ttl) {
    return res.json(homeCache.data);
  }

  try {
    const endpoints = [
      { key: 'airingTop', filter: 'airing' },
      { key: 'upcomingTop', filter: 'upcoming' },
      { key: 'popularityTop', filter: 'bypopularity' },
      { key: 'favoriteTop', filter: 'favorite' },
    ];

    const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));
    const usedIds = new Set<number>();
    const results: Result[] = [];

    for (const endpoint of endpoints) {
      const response = await axios.get<{ data: AnimeData[] }>(
        'https://api.jikan.moe/v4/top/anime',
        {
          params: {
            type: 'tv',
            sfw: true,
            limit: 20,
            filter: endpoint.filter,
          },
        }
      );

      const uniqueAnimes: Result['data'] = [];
      for (const anime of response.data.data) {
        if (!usedIds.has(anime.mal_id)) {
          usedIds.add(anime.mal_id);
          uniqueAnimes.push({
            mal_id: anime.mal_id,
            images: anime.images.webp.image_url,
            title: anime.title,
            type: anime.type,
            episodes: anime.episodes ?? null,
          });
        }
        if (uniqueAnimes.length >= 5) break;
      }

      results.push({
        key: endpoint.key,
        data: uniqueAnimes,
      });

      await delay(350);
    }

    const data = Object.fromEntries(results.map((r) => [r.key, r.data]));

    homeCache.data = data;
    homeCache.timestamp = now;

    res.json(data);
  } catch (error) {
    console.error('Error fetching home anime data:', error);
    res.status(500).json({ error: 'Failed to fetch home anime data' });
  }
});

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
