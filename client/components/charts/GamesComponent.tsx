"use client";
import { useEffect, useState } from "react";
import api from "@/config/axios";
import Game from "@/types/game";
import GameEvent from "@/types/gameEvent";

const fetchGamesAndEvents = async (year: number): Promise<Game[]> => {
  try {
    const gamesResponse = await api.get<{ data: Game[] }>(
      `/games?date=${year}`
    );
    const games = gamesResponse.data;

    const gamesWithEvents = await Promise.all(
      games.data.map(async (game: Game) => {
        const eventsResponse = await api.get<{
          data: { homeEvents: GameEvent[]; awayEvents: GameEvent[] };
        }>(`/gameEvents?gameID=${game.gameID}`);
        const actualGame = eventsResponse.data;
        game.homeEvents = actualGame.data.homeEvents;
        game.awayEvents = actualGame.data.awayEvents;

        return game; 
      })
    );

    return gamesWithEvents;
  } catch (error) {
    console.error("Error fetching games or events:", error);
    return [];
  }
};

const GamesComponent = () => {
  const [gamesData, setGamesData] = useState<Game[]>([]);
  const [loading, setLoading] = useState(true);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const fetchAllData = async () => {
      setLoading(true);
      setProgress(0);

      const allGamesData: Game[] = [];
      const totalYears = 5;

      for (let i = 0; i < 5; i++) {
        const year = 2020 + i;
        const yearlyGamesData = await fetchGamesAndEvents(year);
        allGamesData.push(...yearlyGamesData);
        setProgress(Math.round(((i + 1) / totalYears) * 100));
      }

      setGamesData(allGamesData);
      setLoading(false);
      console.log("Fetched games and events:", allGamesData);
    };
    console.log("Fetching games and events...");
    fetchAllData();
  }, []);

  return (
    <div>
      {loading ? (
        <div className="flex flex-col items-center h-32">
          <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent border-solid rounded-full animate-spin mb-4"></div>
          <p className="text-gray-700 font-medium">Loading... {progress}%</p>
        </div>
      ) : (
        gamesData.map((game) => (
          <div key={game.gameID} className="my-4">
            <h3 className="font-bold">Game ID: {game.gameID}</h3>
            <p>Events:</p>
            {/* <ul>
              {game.homeEvents?.map((event, index) => (
                <li key={`home-${game.gameID}-${index}`}>{JSON.stringify(event)}</li>
              ))}
              {game.awayEvents?.map((event, index) => (
                <li key={`away-${game.gameID}-${index}`}>{JSON.stringify(event)}</li>
              ))}
            </ul> */}
          </div>
        ))
      )}
    </div>
  );
};

export default GamesComponent;
