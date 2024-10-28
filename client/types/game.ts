import GameEvent from "./gameEvent";

type Game = {
    gameID: string;
    awayTeamID: string;
    homeTeamID: string;
    awayScore: number;
    homeScore: number;
    status: 
      | "Upcoming" 
      | "Delayed" 
      | "First Quarter" 
      | "End of Q1" 
      | "Second Quarter" 
      | "End of Half" 
      | "Third Quarter" 
      | "End of Q3" 
      | "Fourth Quarter" 
      | "End of Q4" 
      | "First Overtime" 
      | "End of OT1" 
      | "Second Overtime" 
      | "Final" 
      | "Postponed" 
      | "Abandoned";
    startTimestamp: string; // ISO 8601 Date w/ offset
    startTimezone: string;
    streamingURL: string;
    updateTimestamp: string; // ISO 8601 Date in UTC
    week: string;
    homeEvents: GameEvent[] | null;
    awayEvents: GameEvent[] | null; 
  };

export default Game;