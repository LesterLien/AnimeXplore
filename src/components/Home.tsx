import { useEffect, useState } from "react"
import axios from "axios";

type Anime = {
  images: string;
  title: string;
  type: string;
  episodes: number;
};

export default function Home() {
  const [topAiringAnime, setTopAiringAnime] = useState<Anime[]>([]);


  useEffect(() => {
    const fetchAnime = async () => {
      try {
        const response = await axios.get<{ airingTop: Anime[] }>('http://localhost:4000/home');
        setTopAiringAnime(response.data.airingTop); 
      } catch (error) {
        console.error("Error fetching anime:", error);
      }
    };

    fetchAnime();
  }, []);

  return (
    <div>
      <span>Top Airing</span>
      {topAiringAnime.map((anime, index) => (
        <div key={index}> 
          <img src={anime.images} className="w-[150px]"/>
          <div className="flex flex-col ">
            <span>{anime.title ?? "N/A"}</span>
            <span>{anime.type ?? "N/A"}</span>
            <span>{anime.episodes ?? "N/A"}</span>
          </div>
        </div>
      ))}
    </div>

  )
}
