type GameEvent =
  | { type: 1; line: string[]; time: number }                     // Start D Point
  | { type: 2; line: string[]; time: number }                     // Start O Point
  | { type: 3; line: string[] }                                   // Midpoint Timeout - recording team
  | { type: 4; line: string[] }                                   // Between Point Timeout - recording team
  | { type: 5; line: string[] }                                   // Midpoint Timeout - opposing team
  | { type: 6; line: string[] }                                   // Between Point Timeout - opposing team
  | { type: 7; puller: string; pullX: number; pullY: number; pullMs: number } // Pull - inbounds
  | { type: 8; puller: string }                                   // Pull - out of bounds
  | { type: 9; puller: string }                                   // Offsides - recording team
  | { type: 10; puller: string }                                  // Offsides - opposing team
  | { type: 11; defender: string }                                // Block
  | { type: 12; defender: string }                                // Callahan - thrown by opposing team
  | { type: 13 }                                                  // Throwaway - thrown by opposing team
  | { type: 14 }                                                  // Stall - against opposing team
  | { type: 15 }                                                  // Score - by opposing team
  | { type: 16 }                                                  // Penalty - on recording team
  | { type: 17 }                                                  // Penalty - on opposing team
  | { type: 18; thrower: string; throwerX: number; throwerY: number; receiver: string; receiverX: number; receiverY: number } // Pass
  | { type: 19; thrower: string; throwerX: number; throwerY: number; receiver: string; receiverX: number; receiverY: number } // Goal
  | { type: 20; thrower: string; throwerX: number; throwerY: number; receiver: string; receiverX: number; receiverY: number } // Drop
  | { type: 21; receiver: string; receiverX: number; receiverY: number } // Dropped Pull
  | { type: 22; thrower: string; throwerX: number; throwerY: number; turnoverX: number; turnoverY: number } // Throwaway - thrown by recording team
  | { type: 23; thrower: string; throwerX: number; throwerY: number; turnoverX: number; turnoverY: number } // Callahan - thrown by recording team
  | { type: 24; thrower: string; throwerX: number; throwerY: number } // Stall - against recording team
  | { type: 25; line: string[] }                                   // Injury
  | { type: 26; player: string }                                  // Player Misconduct Foul
  | { type: 27; player: string }                                  // Player Ejected
  | { type: 28 }                                                  // End of First Quarter
  | { type: 29 }                                                  // Halftime
  | { type: 30 }                                                  // End of Third Quarter
  | { type: 31 }                                                  // End of Regulation
  | { type: 32 }                                                  // End of First Overtime
  | { type: 33 }                                                  // End of Second Overtime
  | { type: 34 }                                                  // Delayed
  | { type: 35 };                                                 // Postponed

export default GameEvent;
