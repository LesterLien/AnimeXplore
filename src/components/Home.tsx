import { useEffect, useState } from "react";
import axios from "axios";
import { GrNext, GrPrevious } from "react-icons/gr";

type Anime = {
  images: string;
  title: string;
  type: string;
  episodes: number | null;
};

export default function Home() {
  const [topAiringAnime, setTopAiringAnime] = useState<Anime[]>([]);
  const [topUpcomingAnime, setTopUpcomingAnime] = useState<Anime[]>([]);
  const [topPopularityAnime, setTopPopularityAnime] = useState<Anime[]>([]);
  const [topFavoriteAnime, setTopFavoriteAnime] = useState<Anime[]>([]);
  const [topSeasonAnime, setTopSeasonAnime] = useState<Anime[]>([]);

  useEffect(() => {
    const fetchAnime = async () => {
      try {
        const response = await axios.get<{
          airingTop: Anime[];
          upcomingTop: Anime[];
          popularityTop: Anime[];
          favoriteTop: Anime[];
          seasonNow: Anime[];
        }>("http://localhost:4000/home");

        setTopAiringAnime(response.data.airingTop);
        setTopUpcomingAnime(response.data.upcomingTop);
        setTopPopularityAnime(response.data.popularityTop);
        setTopFavoriteAnime(response.data.favoriteTop);
        setTopSeasonAnime(response.data.seasonNow);
      } catch (error) {
        console.error("Error fetching anime:", error);
      }
    };

    fetchAnime();
  }, []);

  const animeCategories = [
    { title: "Top Airing", data: topAiringAnime },
    { title: "Top Upcoming", data: topUpcomingAnime },
    { title: "Top Popularity", data: topPopularityAnime },
    { title: "Top Favorites", data: topFavoriteAnime },
  ];

return (
  <div className="h-full">
    <div className="outline-amber-50 outline-1 w-full h-[60%] flex items-center justify-between px-5 text-3xl">
      <GrPrevious className="hover:text-[#854CE6] transition-colors duration-200 cursor-pointer" />
      <div className="flex flex-col h-full items-center">
        <span>Picture</span>
        <div className="flex flex-row gap-x-3 mt-auto mb-5">
          {[...Array(5)].map((_, idx) => (
            <button
              key={idx}
              className="bg-gray-300 w-2 h-2 rounded-sm"
            />
          ))}
        </div>
      </div>
      <GrNext className="hover:text-[#854CE6] transition-colors duration-200 cursor-pointer" />
    </div>

    <div className="px-8 pt-10 h-full w-full">

      <div className="w-full outline-amber-300 outline-1 mb-10">
        <h2 className="text-xl font-semibold mb-4">Top Current Season</h2>
        <div className="flex flex-nowrap justify-between gap-4 overflow-x-auto pb-2">
          {topSeasonAnime.map((anime, i) => (
            <div key={i} className="flex flex-col items-center min-w-[150px]">
              <img
                src={anime.images}
                alt={anime.title}
                className="w-28 h-38 object-fill rounded"
              />
              <span
                className="mt-2 text-center text-sm w-32 truncate"
                title={anime.title}
              >
                {anime.title}
              </span>
              <span className="text-xs">{anime.type}</span>
              <span className="text-xs">{anime.episodes ?? "N/A"}</span>
            </div>
          ))}
        </div>
      </div>


      <div className="outline-amber-700 outline-1">
        <div className="grid gap-6 
                        grid-cols-1 
                        sm:grid-cols-2 
                        md:grid-cols-2 
                        lg:grid-cols-4">
          {animeCategories.map(({ title, data }) => (
            <div key={title} className="flex flex-col items-center">
              <h2 className="text-xl font-semibold mb-2">{title}</h2>
              <ul className="space-y-2 text-sm w-full">
                {data.slice(0, 5).map((anime, i) => (
                  <li key={i} className="flex flex-col items-center mb-2">
                    <img
                      src={anime.images}
                      alt={anime.title}
                      className="w-32 h-48 object-fill rounded items-center "
                    />
                    <span
                      className="truncate w-full whitespace-nowrap overflow-hidden mt-2 text-center"
                      title={anime.title}
                    >
                      {anime.title}
                    </span>
                    <span>{anime.type}</span>
                    <span>{anime.episodes ?? "N/A"}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

    </div>
  </div>
);
}
