// import { useEffect, useState } from "react"
// import axios from "axios";
import { GrNext, GrPrevious } from "react-icons/gr";

// type Anime = {
//   images: string;
//   title: string;
//   type: string;
//   episodes: number;
// };

export default function Home() {
//   const [topAiringAnime, setTopAiringAnime] = useState<Anime[]>([]);
//   const [topUpcomingAnime, setTopUpcomingAnime] = useState<Anime[]>([]);
//   const [topPopularityAnime, setTopPopularityAnime] = useState<Anime[]>([]);
//   const [topFavoriteAnime, setTopFavoriteAnime] = useState<Anime[]>([]);


//   useEffect(() => {
//     const fetchAnime = async () => {
//       try {
//         const response = await axios.get<{ airingTop: Anime[], upcomingTop: Anime[], popularityTop: Anime[], favoriteTop: Anime[] }>('http://localhost:4000/home');
//         setTopAiringAnime(response.data.airingTop); 
//         setTopUpcomingAnime(response.data.upcomingTop);
//         setTopPopularityAnime(response.data.popularityTop); 
//         setTopFavoriteAnime(response.data.favoriteTop);
//       } catch (error) {
//         console.error("Error fetching anime:", error);
//       }
//     };

//     fetchAnime();
//   }, []);

  return (
    <div className="h-screen">
        <div className="outline-amber-50 outline-1 w-full h-[60%] flex items-center justify-between pr-5 pl-5 text-3xl">
            <GrPrevious className="hover:text-[#854CE6] transition-colors duration-200 cursor-pointer"/>
            <div className="flex flex-col h-full items-center">
                <span>Picture</span>
                <div className="flex flex-row gap-x-3 mt-auto mb-5">
                    <button className="bg-gray-300 size-[10px] rounded-sm">

                    </button>
                    <button className="bg-gray-300 size-[10px] rounded-sm">

                    </button>
                    <button className="bg-gray-300 size-[10px] rounded-sm">

                    </button>
                    <button className="bg-gray-300 size-[10px] rounded-sm">

                    </button>
                    <button className="bg-gray-300 size-[10px] rounded-sm">

                    </button>
                </div>
            </div>
            <GrNext className="hover:text-[#854CE6] transition-colors duration-200 cursor-pointer"/>
        </div>
        <div className="outline-amber-400 outline-1 h-[70%] flex justify-center p-5">
            <div className="h-[50px] outline flex flex-row justify-center items-center p-5 gap-x-5 text-[20px] font-bold">
                <div>
                    Top Airing
                </div>
                <div>
                    Top Upcoming
                </div>
                <div>
                    Top Popularity
                </div>
                <div>
                    Top Favorites
                </div>
            </div>
        </div>
    </div>

  )
}
