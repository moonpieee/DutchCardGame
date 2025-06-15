interface Player {
  id: string;
  name: string;
}

const ScoreCardTable = ({
  players,
  scores,
  JOKERS,
  isGameOver,
  winners,
  calculateTotalScore,
}: {
  players: Player[];
  scores: { [playerId: string]: { [round: number]: number } };
  JOKERS: string[];
  isGameOver: boolean;
  winners: string[];
  calculateTotalScore: (playerId: string) => number;
}) => {
  if (players.length === 0) return null;

  // Mobile Card View
  const mobileScoreCards = (
    <div className="md:hidden w-full">
      <div className="grid grid-cols-1 xs:grid-cols-2 gap-3 sm:gap-4">
        {players.map((player) => (
          <div
            key={player.id}
            className="bg-gray-700/80 backdrop-blur-sm rounded-xl shadow-xl p-4 border border-gray-600/50"
          >
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-bold text-yellow-200 text-base sm:text-lg truncate">
                {player.name}
              </h3>
              <span
                className={`text-lg sm:text-xl font-bold px-2 py-1 rounded-lg ${
                  isGameOver && winners.includes(player.name)
                    ? "text-green-400 bg-green-400/10"
                    : "text-purple-300 bg-purple-300/10"
                }`}
              >
                {calculateTotalScore(player.id)}
              </span>
            </div>
            <div className="grid grid-cols-4 xs:grid-cols-5 gap-1 sm:gap-2">
              {JOKERS.map((joker, idx) => (
                <div
                  key={idx}
                  className="flex flex-col items-center p-1.5 sm:p-2 bg-gray-800/80 rounded-lg border border-gray-600/30 text-center"
                >
                  <span className="text-xs font-semibold text-gray-400">
                    R{idx + 1}
                  </span>
                  <span
                    className="text-xs text-yellow-300 truncate"
                    title={joker}
                  >
                    {joker.length > 3 ? joker.substring(0, 3) : joker}
                  </span>
                  <span className="text-sm sm:text-base font-bold text-cyan-300">
                    {typeof scores[player.id]?.[idx] === "number"
                      ? scores[player.id][idx]
                      : "-"}
                  </span>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  // Desktop Table View
  const desktopTable = (
    <div className="hidden md:block overflow-x-auto">
      <div className="inline-block min-w-full align-middle">
        <div className="overflow-hidden border border-gray-600 rounded-xl shadow-2xl">
          <table className="min-w-full divide-y divide-gray-600">
            <thead className="bg-gray-700/80 backdrop-blur-sm">
              <tr>
                <th
                  scope="col"
                  className="sticky left-0 z-10 bg-gray-700/90 backdrop-blur-sm px-4 py-3 text-left text-sm font-semibold text-gray-300 uppercase tracking-wider border-r border-gray-600"
                >
                  Player
                </th>
                {JOKERS.map((joker, index) => (
                  <th
                    key={index}
                    scope="col"
                    className="px-3 py-3 text-center text-xs font-medium text-gray-400 uppercase tracking-wider whitespace-nowrap"
                  >
                    <div className="flex flex-col items-center">
                      <span>R{index + 1}</span>
                      <span className="text-yellow-300 font-semibold">
                        ({joker})
                      </span>
                    </div>
                  </th>
                ))}
                <th
                  scope="col"
                  className="px-4 py-3 text-center text-sm font-bold text-yellow-300 uppercase tracking-wider"
                >
                  Total
                </th>
              </tr>
            </thead>
            <tbody className="bg-gray-800/80 backdrop-blur-sm divide-y divide-gray-600">
              {players.map((player) => (
                <tr
                  key={player.id}
                  className="hover:bg-gray-700/50 transition-colors duration-200"
                >
                  <td className="sticky left-0 z-10 bg-gray-800/90 backdrop-blur-sm px-4 py-3 whitespace-nowrap text-sm font-semibold text-gray-200 border-r border-gray-600">
                    {player.name}
                  </td>
                  {JOKERS.map((_, index) => (
                    <td
                      key={index}
                      className="px-3 py-3 whitespace-nowrap text-sm text-gray-300 text-center font-medium"
                    >
                      {typeof scores[player.id]?.[index] === "number"
                        ? scores[player.id][index]
                        : "-"}
                    </td>
                  ))}
                  <td
                    className={`px-4 py-3 whitespace-nowrap text-lg font-bold text-center ${
                      isGameOver && winners.includes(player.name)
                        ? "text-green-400"
                        : "text-purple-300"
                    }`}
                  >
                    {calculateTotalScore(player.id)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );

  return (
    <>
      {mobileScoreCards}
      {desktopTable}
    </>
  );
};

export default ScoreCardTable;
