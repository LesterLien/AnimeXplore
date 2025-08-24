import { useEffect, useState } from "react";
import axios from "axios";
import { GrNext, GrPrevious } from "react-icons/gr";

type Anime = {
  images: string;
  title: string;
  type: string;
  episodes: number;
};

type HomeCacheData = {
  data: {
    airingTop: Anime[];
    upcomingTop: Anime[];
    popularityTop: Anime[];
    favoriteTop: Anime[];
  };
  timestamp: number;
};

const CACHE_KEY = "home-anime-cache";
const TTL = 10 * 60 * 1000; 

export default function Home() {
  const [topAiringAnime, setTopAiringAnime] = useState<Anime[]>([]);
  const [topUpcomingAnime, setTopUpcomingAnime] = useState<Anime[]>([]);
  const [topPopularityAnime, setTopPopularityAnime] = useState<Anime[]>([]);
  const [topFavoriteAnime, setTopFavoriteAnime] = useState<Anime[]>([]);

  useEffect(() => {
    const fetchAnime = async () => {
      try {
        const cache = localStorage.getItem(CACHE_KEY);

        if (cache) {
          const parsed: HomeCacheData = JSON.parse(cache);
          const now = Date.now();

          if (now - parsed.timestamp < TTL) {
            setTopAiringAnime(parsed.data.airingTop);
            setTopUpcomingAnime(parsed.data.upcomingTop);
            setTopPopularityAnime(parsed.data.popularityTop);
            setTopFavoriteAnime(parsed.data.favoriteTop);
            return;
          }
        }

        const response = await axios.get<{
          airingTop: Anime[];
          upcomingTop: Anime[];
          popularityTop: Anime[];
          favoriteTop: Anime[];
        }>("http://localhost:4000/home");

        setTopAiringAnime(response.data.airingTop);
        setTopUpcomingAnime(response.data.upcomingTop);
        setTopPopularityAnime(response.data.popularityTop);
        setTopFavoriteAnime(response.data.favoriteTop);

        localStorage.setItem(
          CACHE_KEY,
          JSON.stringify({
            data: response.data,
            timestamp: Date.now(),
          })
        );
      } catch (error) {
        console.error("Error fetching anime:", error);
      }
    };

    fetchAnime();
  }, []);

return (
    <div className="h-screen">
      <div className="outline-amber-50 outline-1 w-full h-[60%] flex items-center justify-between pr-5 pl-5 text-3xl">
        <GrPrevious className="hover:text-[#854CE6] transition-colors duration-200 cursor-pointer" />
        <div className="flex flex-col h-full items-center">
          <span>Picture</span>
          <div className="flex flex-row gap-x-3 mt-auto mb-5">
            {[...Array(5)].map((_, idx) => (
              <button
                key={idx}
                className="bg-gray-300 size-[10px] rounded-sm"
              />
            ))}
          </div>
        </div>
        <GrNext className="hover:text-[#854CE6] transition-colors duration-200 cursor-pointer" />
      </div>

      <div className="mt-10 px-10">
        <div className="grid grid-cols-4 gap-6 text-center">
          <div>
            <h2 className="text-xl font-semibold mb-2">Top Airing</h2>
            <ul className="space-y-1 text-sm">
              {topAiringAnime.slice(0, 5).map((anime, i) => (
                <li key={i}>{anime.title}</li>
              ))}
            </ul>
          </div>

          <div>
            <h2 className="text-xl font-semibold mb-2">Top Upcoming</h2>
            <ul className="space-y-1 text-sm">
              {topUpcomingAnime.slice(0, 5).map((anime, i) => (
                <li key={i}>{anime.title}</li>
              ))}
            </ul>
          </div>

          <div>
            <h2 className="text-xl font-semibold mb-2">Top Popularity</h2>
            <ul className="space-y-1 text-sm">
              {topPopularityAnime.slice(0, 5).map((anime, i) => (
                <li key={i}>{anime.title}</li>
              ))}
            </ul>
          </div>

          <div>
            <h2 className="text-xl font-semibold mb-2">Top Favorites</h2>
            <ul className="space-y-1 text-sm">
              {topFavoriteAnime.slice(0, 5).map((anime, i) => (
                <li key={i}>{anime.title}</li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
