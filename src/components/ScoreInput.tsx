import React from "react";

interface Player {
  id: string;
  name: string;
}

const ScoreInput = ({
  players,
  currentRoundScores,
  handleScoreChange,
  submitRoundScores,
  scoreInputRefs,
  currentRound,
  isGameOver,
}: {
  players: Player[];
  currentRoundScores: { [playerId: string]: string };
  handleScoreChange: (playerId: string, value: string) => void;
  submitRoundScores: () => void;
  scoreInputRefs: React.MutableRefObject<{
    [playerId: string]: HTMLInputElement | null;
  }>;
  currentRound: number;
  isGameOver: boolean;
}) => {
  if (isGameOver || players.length === 0) return null;

  return (
    <div className="bg-gray-800/90 backdrop-blur-sm p-3 sm:p-4 lg:p-6 rounded-xl shadow-2xl mb-4 sm:mb-6 lg:mb-8 border border-gray-600 w-full">
      <h2 className="text-lg sm:text-xl lg:text-2xl font-bold mb-4 sm:mb-6 text-cyan-300 text-left">
        Enter Round {currentRound + 1} Scores
      </h2>

      <div className="grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 sm:gap-4 mb-6">
        {players.map((player, index) => (
          <div
            key={player.id}
            className="bg-gray-700/80 backdrop-blur-sm rounded-lg p-3 sm:p-4 border border-gray-600/50 hover:border-cyan-400/50 transition-all duration-300 hover:shadow-lg hover:shadow-cyan-400/10"
          >
            <div className="flex flex-col space-y-2">
              <label
                htmlFor={`score-${player.id}`}
                className="text-gray-200 font-medium text-sm sm:text-base truncate text-center"
                title={player.name}
              >
                {player.name}
              </label>
              <input
                id={`score-${player.id}`}
                type="number"
                inputMode="numeric"
                pattern="[0-9]*"
                placeholder="0"
                value={currentRoundScores[player.id] || ""}
                onChange={(e) => handleScoreChange(player.id, e.target.value)}
                onKeyPress={(e) => e.key === "Enter" && submitRoundScores()}
                className="w-full p-3 sm:p-2.5 rounded-lg bg-gray-800/80 text-gray-100 placeholder-gray-500 border border-gray-600 focus:ring-2 focus:ring-cyan-400 focus:border-cyan-400 transition-all duration-200 text-base sm:text-sm text-center font-medium backdrop-blur-sm"
                ref={(el) => {
                  scoreInputRefs.current[player.id] = el;
                }}
                autoFocus={index === 0}
                min="0"
                max="999"
              />
            </div>
          </div>
        ))}
      </div>

      <div className="flex justify-center">
        <button
          onClick={submitRoundScores}
          className="w-full max-w-md bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white font-bold py-3.5 sm:py-3 px-8 rounded-lg shadow-lg transition-all duration-300 transform hover:scale-[1.02] active:scale-[0.98] focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:ring-offset-2 focus:ring-offset-gray-900 disabled:opacity-50 disabled:cursor-not-allowed text-base sm:text-lg"
          disabled={players.length === 0}
        >
          <span className="flex items-center justify-center">
            {currentRound < 12 ? "Next Round" : "Finish Game"}
            <svg
              className="ml-2 w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 5l7 7-7 7"
              />
            </svg>
          </span>
        </button>
      </div>
    </div>
  );
};
export default ScoreInput;
