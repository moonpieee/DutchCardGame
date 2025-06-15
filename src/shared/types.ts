
// Add Player type and state typings
export interface Player {
  id: string;
  name: string;
}

export type Scores = {
  [playerId: string]: {
    [round: number]: number;
  };
};

export type CurrentRoundScores = {
  [playerId: string]: string;
};