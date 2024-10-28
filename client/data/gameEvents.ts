import { useEffect, useState } from 'react';
import api from '@/config/axios'; 
import Game from '@/types/game'; 
import GameEvent from '@/types/gameEvent'; 


const fetchGamesAndEvents = async (year: number): Promise<{ gameID: string; events: GameEvent[] }[]> => {
  try {
    // Fetch all games for the specified year
    const gamesResponse = await api.get<{ games: Game[] }>(`/games?date=${year}`);
    const games = gamesResponse.data.games;

    // Fetch events for each game
    const gamesWithEvents = await Promise.all(
      games.map(async (game) => {
        const eventsResponse = await api.get<{ events: GameEvent[] }>(`/gameEvents?gameId=${game.gameID}`);
        return { gameID: game.gameID, events: eventsResponse.data.events };
      })
    );

    return gamesWithEvents;
  } catch (error) {
    console.error("Error fetching games or events:", error);
    return [];
  }
};

const GamesComponent = () => {
  const [gamesData, setGamesData] = useState<{ gameID: string; events: GameEvent[] }[]>([]);

  useEffect(() => {
    const fetchAllData = async () => {
      const allGamesData: { gameID: string; events: GameEvent[] }[] = [];

      for (let i = 0; i < 5; i++) {
        const year = 2020 + i;
        const yearlyGamesData = await fetchGamesAndEvents(year);
        allGamesData.push(...yearlyGamesData);
      }

      setGamesData(allGamesData);
    };

    fetchAllData();
  }, []);

  return (
    <div>
      {gamesData.map((game) => (
        <div key={game.gameID}>
          <h3>Game ID: {game.gameID}</h3>
          <p>Events:</p>
          <ul>
            {game.events.map((event, index) => (
              <li key={index}>{JSON.stringify(event)}</li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
};

export default GamesComponent;
