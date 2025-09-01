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


type AnimeCardData = {
  mal_id: number;
  images: { webp: { image_url: string } };
  title: string;
  type: string;
  episodes: number | null;
};

type AnimeTrendingData = {
  mal_id: number;
  images: { webp: { image_url: string } };
  trailer: {
    images: {
      maximum_image_url: string;
    };
  };
  title: string;
  type: string;
  episodes: number | null;
  score: number;
  favorites: number;
  synopsis: string;
  genres: { name: string }[];
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

type ResultTrending = {
  key: string;
  data: {
    mal_id: number;
    images: string;
    title: string;
    type: string;
    episodes: number | null;
    score: number;
    favorites: number;
    synopsis: string;
    genres: string[];
  }[];
};

//10minute cache
const homeCache = new Cache<Record<string, unknown>>(10 * 60 * 1000); 

//FUNCTIONS
function filterUniqueCard(animes: AnimeCardData[], fetchLimit: number, maxInJson?: number) {
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

  return maxInJson !== undefined ? unique.slice(0, maxInJson) : unique;
}

function filterUniqueTrending(animes: AnimeTrendingData[], fetchLimit: number, maxInJson?: number) {
  const usedIds = new Set<number>();
  const unique: ResultTrending['data'] = [];

  for (const anime of animes) {
    if (!usedIds.has(anime.mal_id)) {
      usedIds.add(anime.mal_id);
      unique.push({
        mal_id: anime.mal_id,
        images: anime.trailer.images.maximum_image_url, 
        title: anime.title,
        type: anime.type,
        episodes: anime.episodes ?? null,
        score: anime.score,
        favorites: anime.favorites,
        synopsis: anime.synopsis,
        genres: anime.genres.map(g => g.name), 
      });
    }
    if (unique.length >= fetchLimit) break;
  }

  return maxInJson !== undefined ? unique.slice(0, maxInJson) : unique;
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
      const response = await axios.get<{ data: AnimeCardData[] }>(
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

      const uniqueTop = filterUniqueCard(response.data.data, 10, 5);
      results.push({ key: endpoint.key, data: uniqueTop }); 

      await delay(350);
    }
    const seasonResponse = await axios.get<{ data: AnimeCardData[] }>(
      'https://api.jikan.moe/v4/seasons/now',
      {
        params: {
          filter: 'tv',
          sfw: true,
          limit: 16,
        },
      }
    );
    const seasonNow = filterUniqueCard(seasonResponse.data.data, 16, 8);
    results.push({ key: 'seasonNow', data: seasonNow });

    const trendingResponse = await axios.get<{ data: AnimeTrendingData[] }>(
      'https://api.jikan.moe/v4/top/anime',
      {
        params: {
          filter: 'airing',
          sfw: true,
          limit: 10,
        },
      }
    );
    const trendingTop = filterUniqueTrending(trendingResponse.data.data, 10, 5);
    results.push({ key: 'trendingTop', data: trendingTop });


    const data = Object.fromEntries(results.map((r) => [r.key, r.data]));

    homeCache.set(data);
    res.json(data);
  } catch (error) {
    console.error('Error fetching home anime data:', error);
    res.status(500).json({ error: 'Failed to fetch home anime data' });
  }
});

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
