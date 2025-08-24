import express, { Request, Response } from 'express';
import cors from 'cors';
import axios from 'axios';
import dotenv from 'dotenv';
import { Cache } from './cache';
dotenv.config();

const PORT = process.env.PORT;
const app = express();

app.use(cors());
app.use(express.json());


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

//10minute cache
const homeCache = new Cache<Record<string, unknown>>(10 * 60 * 1000); 

//FUNCTIONS
function filterUniqueById(animes: AnimeData[], fetchLimit: number, maxInJson?: number) {
  const usedIds = new Set<number>();
  const unique: Result['data'] = [];

  for (const anime of animes) {
    if (!usedIds.has(anime.mal_id)) {
      usedIds.add(anime.mal_id);
      unique.push({
        mal_id: anime.mal_id,
        images: anime.images.webp.image_url,
        title: anime.title,
        type: anime.type,
        episodes: anime.episodes ?? null,
      });
    }
    if (unique.length >= fetchLimit) break;
  }

  if (maxInJson !== undefined) {
    return unique.slice(0, maxInJson);
  }

  return unique;
}

app.get('/home', async (req: Request, res: Response): Promise<any> => {
  const cached = homeCache.get();
  if (cached) {
    return res.json(cached);
  }

  try {
    const endpoints = [
      { key: 'airingTop', filter: 'airing' },
      { key: 'upcomingTop', filter: 'upcoming' },
      { key: 'popularityTop', filter: 'bypopularity' },
      { key: 'favoriteTop', filter: 'favorite' },
    ];

    const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));
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

      const uniqueTop = filterUniqueById(response.data.data, 10, 5);
      results.push({ key: endpoint.key, data: uniqueTop }); 

      await delay(350);
    }
    const seasonResponse = await axios.get<{ data: AnimeData[] }>(
      'https://api.jikan.moe/v4/seasons/now',
      {
        params: {
          filter: 'tv',
          sfw: true,
          limit: 16,
        },
      }
    );
    const seasonNow = filterUniqueById(seasonResponse.data.data, 16, 8);
    results.push({ key: 'seasonNow', data: seasonNow });


    const data = Object.fromEntries(results.map((r) => [r.key, r.data]));

    homeCache.set(data);
    res.json(data);
  } catch (error) {
    console.error('Error fetching home anime data:', error);
    res.status(500).json({ error: 'Failed to fetch home anime data' });
  }
});

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
