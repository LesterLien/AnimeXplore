import { useEffect, useState } from "react";
import axios from "axios";
import { GrNext, GrPrevious } from "react-icons/gr";
import { motion, AnimatePresence } from "framer-motion";

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
  const [topTrendingAnime, setTopTrendingAnime] = useState<Anime[]>([]);

  const [currentIndex, setCurrentIndex] = useState(0);
  const [direction, setDirection] = useState<"next" | "prev">("next");

  useEffect(() => {
    const fetchAnime = async () => {
      try {
        const response = await axios.get<{
          airingTop: Anime[];
          upcomingTop: Anime[];
          popularityTop: Anime[];
          favoriteTop: Anime[];
          seasonNow: Anime[];
          trendingTop: Anime[];
        }>("http://localhost:4000/home");

        setTopAiringAnime(response.data.airingTop);
        setTopUpcomingAnime(response.data.upcomingTop);
        setTopPopularityAnime(response.data.popularityTop);
        setTopFavoriteAnime(response.data.favoriteTop);
        setTopSeasonAnime(response.data.seasonNow);
        setTopTrendingAnime(response.data.trendingTop);
      } catch (error) {
        console.error("Error fetching anime:", error);
      }
    };

    fetchAnime();
  }, []);

  useEffect(() => {
    if (topTrendingAnime.length === 0) return;
    const interval = setInterval(() => {
      handleNext();
    }, 10000);

    return () => clearInterval(interval);
  }, [topTrendingAnime]);

  const handleNext = () => {
    setDirection("next");
    setCurrentIndex((prev) =>
      prev === topTrendingAnime.length - 1 ? 0 : prev + 1
    );
  };

  const handlePrev = () => {
    setDirection("prev");
    setCurrentIndex((prev) =>
      prev === 0 ? topTrendingAnime.length - 1 : prev - 1
    );
  };

  const variants = {
    enter: (dir: "next" | "prev") => ({
      x: dir === "next" ? 100 : -100,
      opacity: 0,
    }),
    center: { x: 0, opacity: 1 },
    exit: (dir: "next" | "prev") => ({
      x: dir === "next" ? -100 : 100,
      opacity: 0,
    }),
  };

  const animeCategories = [
    { title: "Top Airing", data: topAiringAnime },
    { title: "Top Upcoming", data: topUpcomingAnime },
    { title: "Top Popularity", data: topPopularityAnime },
    { title: "Top Favorites", data: topFavoriteAnime },
  ];

  return (
    <div className="h-full">
      <div className="outline-amber-50 outline-1 w-full h-[70%] relative flex items-center text-3xl overflow-hidden">
        <AnimatePresence mode="wait" custom={direction}>
          {topTrendingAnime.length > 0 && (
            <motion.div
              key={currentIndex}
              custom={direction}
              variants={variants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ duration: 0.4 }}
              className="flex w-full h-full flex-col md:flex-row items-center"
            >

              <div className="flex flex-col justify-center w-full md:w-[30%] max-w-[250px] pl-6 md:pl-10 z-10">
                <h2 className="text-xl font-bold line-clamp-2">
                  {topTrendingAnime[currentIndex].title}
                </h2>
                <span className="text-sm">{topTrendingAnime[currentIndex].type}</span>
                <span className="text-sm">
                  Episodes: {topTrendingAnime[currentIndex].episodes ?? "N/A"}
                </span>
              </div>

              <div className="flex-1 h-full flex items-center justify-center md:justify-end overflow-hidden">
                <img
                  src={topTrendingAnime[currentIndex].images}
                  alt={topTrendingAnime[currentIndex].title}
                  className="h-full w-auto max-w-full object-contain opacity-90
                            [mask-image:radial-gradient(circle,rgba(0,0,0,1)70%,rgba(0,0,0,0)100%)]
                            [mask-repeat:no-repeat] [mask-position:center] [mask-size:cover]
                            [-webkit-mask-image:radial-gradient(circle,rgba(0,0,0,1)70%,rgba(0,0,0,0)100%)]
                            [-webkit-mask-repeat:no-repeat] [-webkit-mask-position:center] [-webkit-mask-size:cover]"
                />

                <div className="right-3 top-1/2 flex flex-col z-20 p-3 gap-y-3">
                  <GrNext
                    onClick={handleNext}
                    className="hover:text-[#854CE6] transition-colors duration-200 cursor-pointer"
                  />
                  <GrPrevious
                    onClick={handlePrev}
                    className="hover:text-[#854CE6] transition-colors duration-200 cursor-pointer"
                  />
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
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
                <span className="text-xs">
                  {anime.episodes ?? "N/A"}
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="outline-amber-700 outline-1">
          <div
            className="grid gap-6 
                        grid-cols-1 
                        sm:grid-cols-2 
                        md:grid-cols-2 
                        lg:grid-cols-4"
          >
            {animeCategories.map(({ title, data }) => (
              <div key={title} className="flex flex-col items-center">
                <h2 className="text-xl font-semibold mb-2">{title}</h2>
                <ul className="space-y-2 text-sm w-full">
                  {data.slice(0, 5).map((anime, i) => (
                    <li key={i} className="flex flex-col items-center mb-2">
                      <img
                        src={anime.images}
                        alt={anime.title}
                        className="w-32 h-48 object-fill rounded items-center"
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
