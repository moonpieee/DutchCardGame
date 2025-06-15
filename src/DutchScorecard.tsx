import { useState, useRef, useEffect } from "react";

// Define the joker sequence for 13 rounds
const JOKERS = [
  "King",
  "Queen",
  "Jack",
  "10",
  "9",
  "8",
  "7",
  "6",
  "5",
  "4",
  "3",
  "2",
  "Ace",
];

// Add Player type and state typings
interface Player {
  id: string;
  name: string;
}

type Scores = {
  [playerId: string]: {
    [round: number]: number;
  };
};

type CurrentRoundScores = {
  [playerId: string]: string;
};

function DutchScorecard() {
  const [players, setPlayers] = useState<Player[]>([]);
  const [scores, setScores] = useState<Scores>({}); // { playerId: { round: score, ... }, ... }
  const [currentRound, setCurrentRound] = useState<number>(0); // 0-indexed, so 0 to 12 for 13 rounds
  const [newPlayerName, setNewPlayerName] = useState<string>("");
  const [currentRoundScores, setCurrentRoundScores] =
    useState<CurrentRoundScores>({}); // { playerId: currentRoundScoreInput }
  const [showConfirmation, setShowConfirmation] = useState<boolean>(false);
  const [confirmationMessage, setConfirmationMessage] = useState<string>("");
  const [confirmAction, setConfirmAction] = useState<(() => void) | null>(null);

  const playerInputRef = useRef<HTMLInputElement>(null);
  const scoreInputRefs = useRef<{
    [playerId: string]: HTMLInputElement | null;
  }>({});

  useEffect(() => {
    const savedPlayers = localStorage.getItem("dutch_players");
    const savedScores = localStorage.getItem("dutch_scores");
    const savedCurrentRound = localStorage.getItem("dutch_currentRound");
    const savedCurrentRoundScores = localStorage.getItem(
      "dutch_currentRoundScores"
    );
    if (savedPlayers) setPlayers(JSON.parse(savedPlayers));
    if (savedScores) setScores(JSON.parse(savedScores));
    if (savedCurrentRound) setCurrentRound(Number(savedCurrentRound));
    if (savedCurrentRoundScores)
      setCurrentRoundScores(JSON.parse(savedCurrentRoundScores));
  }, []);

  useEffect(() => {
    localStorage.setItem("dutch_players", JSON.stringify(players));
  }, [players]);
  useEffect(() => {
    localStorage.setItem("dutch_scores", JSON.stringify(scores));
  }, [scores]);
  useEffect(() => {
    localStorage.setItem("dutch_currentRound", currentRound.toString());
  }, [currentRound]);
  useEffect(() => {
    localStorage.setItem(
      "dutch_currentRoundScores",
      JSON.stringify(currentRoundScores)
    );
  }, [currentRoundScores]);

  const addPlayer = () => {
    if (newPlayerName.trim() === "") {
      return;
    }
    const newPlayer = { id: crypto.randomUUID(), name: newPlayerName.trim() };
    const updatedPlayers = [...players, newPlayer];
    setPlayers(updatedPlayers);
    setScores((prevScores) => ({
      ...prevScores,
      [newPlayer.id]: { ...prevScores[newPlayer.id] },
    }));
    setCurrentRoundScores((prev) => ({ ...prev, [newPlayer.id]: "" }));
    setNewPlayerName("");
    playerInputRef.current?.focus();
  };

  const handleScoreChange = (playerId: string, value: string) => {
    if (value === "" || /^\d+$/.test(value)) {
      setCurrentRoundScores((prev) => ({
        ...prev,
        [playerId]: value,
      }));
    }
  };

  const submitRoundScores = () => {
    if (currentRound >= JOKERS.length) {
      setConfirmationMessage(
        "All rounds are complete! Please reset the game to start a new one."
      );
      setShowConfirmation(true);
      return;
    }

    const newScores = { ...scores };
    let allPlayersHaveScore = true;

    players.forEach((player) => {
      const score = parseInt(currentRoundScores[player.id], 10);
      if (isNaN(score) && players.length > 0) {
        allPlayersHaveScore = false;
        return;
      }
      if (!newScores[player.id]) {
        newScores[player.id] = {};
      }
      newScores[player.id][currentRound] = score;
    });

    if (!allPlayersHaveScore && players.length > 0) {
      setConfirmationMessage(
        "Please enter scores for all players before moving to the next round."
      );
      setShowConfirmation(true);
      return;
    }

    setScores(newScores);
    const nextRound = currentRound + 1;
    setCurrentRound(nextRound);

    const nextRoundInputs: CurrentRoundScores = {};
    players.forEach((player) => {
      nextRoundInputs[player.id] = "";
    });
    setCurrentRoundScores(nextRoundInputs);

    if (players.length > 0 && scoreInputRefs.current[players[0].id]) {
      const input = scoreInputRefs.current[players[0].id];
      if (input) input.focus();
    }
  };

  const calculateTotalScore = (playerId: string) => {
    let total = 0;
    if (scores[playerId]) {
      for (let i = 0; i < JOKERS.length; i++) {
        const score = scores[playerId][i];
        if (typeof score === "number" && !isNaN(score)) {
          total += score;
        }
      }
    }
    return total;
  };

  const getWinners = (): string[] => {
    if (currentRound < JOKERS.length || players.length === 0) {
      return [];
    }

    let lowestScore = Infinity;
    let winners: string[] = [];

    players.forEach((player) => {
      const totalScore = calculateTotalScore(player.id);
      if (totalScore < lowestScore) {
        lowestScore = totalScore;
        winners = [player.name];
      } else if (totalScore === lowestScore && lowestScore !== Infinity) {
        winners.push(player.name);
      }
    });

    return winners;
  };

  const resetGame = () => {
    setConfirmationMessage(
      "Are you sure you want to reset the game? This will clear all players and scores."
    );
    setConfirmAction(() => () => {
      setPlayers([]);
      setScores({});
      setCurrentRound(0);
      setNewPlayerName("");
      setCurrentRoundScores({});
      setShowConfirmation(false);
      localStorage.removeItem("dutch_players");
      localStorage.removeItem("dutch_scores");
      localStorage.removeItem("dutch_currentRound");
      localStorage.removeItem("dutch_currentRoundScores");
    });
    setShowConfirmation(true);
  };

  const cancelConfirmation = () => {
    setShowConfirmation(false);
    setConfirmAction(null);
  };

  const proceedConfirmation = () => {
    if (confirmAction) {
      confirmAction();
    }
  };

  const currentJoker = JOKERS[currentRound];
  const isGameOver = currentRound >= JOKERS.length;
  const winners = getWinners();

  const defaultPlayers = [
    "Mayur",
    "Mona",
    "Sumit",
    "Vibha",
    "Amit",
    "Sabnam",
    "Sujit",
    "Sayo",
    "Sangam",
    "Riya",
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 text-gray-100 font-inter p-4 sm:p-6 lg:p-8 rounded-lg shadow-xl">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-4xl sm:text-5xl font-extrabold text-center mb-6 text-yellow-300 drop-shadow-lg">
          Dutch Game Scorecard
        </h1>

        <div className="flex flex-col lg:flex-row gap-8 mb-8">
          <div className="bg-gray-800 p-6 rounded-xl shadow-inner border border-gray-700 flex-1">
            <h2 className="text-2xl font-bold mb-4 text-purple-300">
              Add Players
            </h2>

            <div className="flex flex-wrap gap-2 mb-4">
              {defaultPlayers.map((name) => (
                <button
                  key={name}
                  type="button"
                  className="px-4 py-1 rounded-full bg-purple-700 text-white font-semibold shadow hover:bg-purple-500 transition-all text-sm"
                  onClick={() => {
                    if (!players.some((p) => p.name === name)) {
                      const newPlayer = { id: crypto.randomUUID(), name };
                      setPlayers((prev) => [...prev, newPlayer]);
                      setScores((prevScores) => ({
                        ...prevScores,
                        [newPlayer.id]: { ...prevScores[newPlayer.id] },
                      }));
                      setCurrentRoundScores((prev) => ({
                        ...prev,
                        [newPlayer.id]: "",
                      }));
                    }
                  }}
                  disabled={players.some((p) => p.name === name)}
                >
                  {name}
                </button>
              ))}
            </div>
            <div className="flex flex-col sm:flex-row gap-4">
              <input
                type="text"
                placeholder="Player Name"
                value={newPlayerName}
                onChange={(e) => setNewPlayerName(e.target.value)}
                onKeyPress={(e) => e.key === "Enter" && addPlayer()}
                className="flex-grow p-3 rounded-md bg-gray-700 text-gray-100 placeholder-gray-400 border border-gray-600 focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200"
                ref={playerInputRef}
              />
              <button
                onClick={addPlayer}
                className="bg-purple-600 hover:bg-purple-700 text-white font-bold py-3 px-6 rounded-md shadow-lg transition-transform transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 focus:ring-offset-gray-800 disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={newPlayerName.trim() === ""}
              >
                Add Player
              </button>
            </div>
          </div>

          <div className="bg-gray-800 p-6 rounded-xl shadow-inner border border-gray-700 text-center flex-1">
            {isGameOver ? (
              <h2 className="text-3xl font-bold text-green-400">Game Over!</h2>
            ) : (
              <h2 className="text-3xl font-bold text-orange-400">
                Round {currentRound + 1} / {JOKERS.length}: Joker is{" "}
                <span className="text-yellow-300">{currentJoker}</span>
              </h2>
            )}
          </div>
        </div>

        {!isGameOver && players.length > 0 && (
          <div className="bg-gray-800 p-6 rounded-xl shadow-inner mb-8 border border-gray-700">
            <h2 className="text-2xl font-bold mb-4 text-cyan-300">
              Enter Round {currentRound + 1} Scores
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mb-6">
              {players.map((player) => (
                <div key={player.id} className="flex flex-col">
                  <label
                    htmlFor={`score-${player.id}`}
                    className="text-gray-300 font-medium mb-1"
                  >
                    {player.name}
                  </label>
                  <input
                    id={`score-${player.id}`}
                    type="text"
                    value={currentRoundScores[player.id] || ""}
                    onChange={(e) =>
                      handleScoreChange(player.id, e.target.value)
                    }
                    onKeyPress={(e) => e.key === "Enter" && submitRoundScores()}
                    className="p-3 rounded-md bg-gray-700 text-gray-100 placeholder-gray-400 border border-gray-600 focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-all duration-200"
                    ref={(el) => {
                      scoreInputRefs.current[player.id] = el;
                    }}
                    autoFocus={players.indexOf(player) === 0}
                  />
                </div>
              ))}
            </div>
            <button
              onClick={submitRoundScores}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-md shadow-lg transition-transform transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-gray-800 disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={players.length === 0}
            >
              {currentRound < JOKERS.length - 1 ? "Next Round" : "Finish Game"}
            </button>
          </div>
        )}

        {players.length > 0 && (
          <div className="bg-gray-800 p-6 rounded-xl shadow-inner border border-gray-700 overflow-x-auto mb-8">
            <h2 className="text-2xl font-bold mb-4 text-green-300">
              Scoreboard
            </h2>
            <table className="min-w-full divide-y divide-gray-700 rounded-lg overflow-hidden">
              <thead className="bg-gray-700">
                <tr>
                  <th
                    scope="col"
                    className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider rounded-tl-lg"
                  >
                    Player
                  </th>
                  {JOKERS.map((joker, index) => (
                    <th
                      key={index}
                      scope="col"
                      className="px-4 py-3 text-center text-xs font-medium text-gray-400 uppercase tracking-wider"
                    >
                      R{index + 1} ({joker})
                    </th>
                  ))}
                  <th
                    scope="col"
                    className="px-4 py-3 text-center text-sm font-bold text-yellow-300 uppercase tracking-wider rounded-tr-lg"
                  >
                    Total
                  </th>
                </tr>
              </thead>
              <tbody className="bg-gray-800 divide-y divide-gray-700">
                {players.map((player) => (
                  <tr
                    key={player.id}
                    className="hover:bg-gray-700 transition-colors duration-150"
                  >
                    <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-gray-200">
                      {player.name}
                    </td>
                    {JOKERS.map((_, index) => (
                      <td
                        key={index}
                        className="px-4 py-3 whitespace-nowrap text-sm text-gray-300 text-center"
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
        )}

        {isGameOver && winners.length > 0 && (
          <div className="bg-gray-800 p-6 rounded-xl shadow-inner mb-8 border border-gray-700 text-center">
            <h2 className="text-3xl font-bold text-green-400 mb-2">
              Winner{winners.length > 1 ? "s" : ""}:
            </h2>
            <p className="text-4xl font-extrabold text-yellow-300 animate-pulse">
              {winners.join(" & ")}!
            </p>
          </div>
        )}

        <div className="flex justify-center mt-8">
          <button
            onClick={resetGame}
            className="bg-red-600 hover:bg-red-700 text-white font-bold py-3 px-8 rounded-md shadow-lg transition-transform transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 focus:ring-offset-gray-800"
          >
            Reset Game
          </button>
        </div>

        {showConfirmation && (
          <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center p-4 z-50">
            <div className="bg-gray-800 rounded-xl p-8 shadow-2xl border border-gray-700 max-w-sm w-full text-center">
              <h3 className="text-2xl font-bold mb-4 text-yellow-300">
                {confirmAction ? "Confirm Action" : "Notice"}
              </h3>
              <p className="text-gray-300 mb-6">{confirmationMessage}</p>
              <div className="flex justify-center gap-4">
                {confirmAction && (
                  <button
                    onClick={cancelConfirmation}
                    className="bg-gray-600 hover:bg-gray-700 text-white font-bold py-2 px-5 rounded-md transition-transform transform hover:scale-105"
                  >
                    Cancel
                  </button>
                )}
                <button
                  onClick={proceedConfirmation}
                  className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-5 rounded-md transition-transform transform hover:scale-105"
                >
                  {confirmAction ? "Confirm" : "OK"}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default DutchScorecard;
