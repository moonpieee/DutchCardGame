import { useState, useRef, useEffect } from "react";
import confetti from "canvas-confetti";
import ScoreInput from "./ScoreInput";
import ScoreCardTable from "./ScoreCardTable";
import { Button } from "../shared/ui/button";
import { Input } from "../shared/ui/input";
import { Card } from "../shared/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "../shared/ui/dialog";
import { Separator } from "../shared/ui/separator";
import { DEFAULTPLAYERS, JOKERS } from "../shared/constants";
import type { CurrentRoundScores, Player, Scores } from "@/shared/types";
import Header from "./Header";
import Footer from "./Footer";

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
  const [showJoker, setShowJoker] = useState<boolean>(false);

  const playerInputRef = useRef<HTMLInputElement>(null);
  const scoreInputRefs = useRef<{
    [playerId: string]: HTMLInputElement | null;
  }>({});
  const roundInfoRef = useRef<HTMLDivElement>(null);

  // Load data from localStorage on component mount
  useEffect(() => {
    try {
      const savedPlayers = localStorage.getItem("dutch_players");
      const savedScores = localStorage.getItem("dutch_scores");
      const savedCurrentRound = localStorage.getItem("dutch_currentRound");
      const savedCurrentRoundScores = localStorage.getItem(
        "dutch_currentRoundScores"
      );

      let hasData = false;
      let roundToRestore: number | null = null;
      let parsedPlayers: Player[] = [];
      let parsedScores: Scores = {};
      let parsedCurrentRoundScores: CurrentRoundScores = {};

      // First, restore players
      if (savedPlayers) {
        parsedPlayers = JSON.parse(savedPlayers) as Player[];
        if (Array.isArray(parsedPlayers) && parsedPlayers.length > 0) {
          setPlayers(parsedPlayers);
          hasData = true;
        }
      }

      // Then restore scores
      if (savedScores) {
        parsedScores = JSON.parse(savedScores) as Scores;
        if (parsedScores && Object.keys(parsedScores).length > 0) {
          setScores(parsedScores);
          hasData = true;
        }
      }

      // Determine the correct round based on scores
      if (savedCurrentRound) {
        const round = Number(savedCurrentRound);
        if (!isNaN(round) && round >= 0 && round <= JOKERS.length) {
          // Validate round against scores
          let maxRoundInScores = -1;
          Object.values(parsedScores).forEach((playerScores) => {
            const playerMaxRound = Math.max(
              ...Object.keys(playerScores).map(Number),
              -1
            );
            maxRoundInScores = Math.max(maxRoundInScores, playerMaxRound);
          });

          // Make sure round is consistent with scores
          roundToRestore = Math.max(maxRoundInScores + 1, round);
          if (roundToRestore <= JOKERS.length) {
            setCurrentRound(roundToRestore);
            hasData = true;
          }
        }
      }

      // Finally restore current round scores
      if (savedCurrentRoundScores) {
        parsedCurrentRoundScores = JSON.parse(
          savedCurrentRoundScores
        ) as CurrentRoundScores;
        if (
          parsedCurrentRoundScores &&
          Object.keys(parsedCurrentRoundScores).length > 0
        ) {
          // Only restore current round scores if they're for the current round
          if (roundToRestore !== null) {
            setCurrentRoundScores(parsedCurrentRoundScores);
          } else {
            // Initialize empty scores for the current round
            const emptyScores: CurrentRoundScores = {};
            parsedPlayers.forEach((player) => {
              emptyScores[player.id] = "";
            });
            setCurrentRoundScores(emptyScores);
          }
          hasData = true;
        }
      }

      if (!hasData) {
        // Initialize fresh game state
        setPlayers([]);
        setScores({});
        setCurrentRound(0);
        setCurrentRoundScores({});
      }
    } catch (error) {
      // Reset to initial state if there's an error
      setPlayers([]);
      setScores({});
      setCurrentRound(0);
      setCurrentRoundScores({});
    }
  }, []); // Only run once on mount

  // Ensure we save state changes to localStorage
  useEffect(() => {
    if (players.length > 0) {
      localStorage.setItem("dutch_players", JSON.stringify(players));
    }
  }, [players]);

  useEffect(() => {
    if (Object.keys(scores).length > 0) {
      localStorage.setItem("dutch_scores", JSON.stringify(scores));
    }
  }, [scores]);

  useEffect(() => {
    localStorage.setItem("dutch_currentRound", currentRound.toString());
  }, [currentRound]);

  useEffect(() => {
    if (Object.keys(currentRoundScores).length > 0) {
      localStorage.setItem(
        "dutch_currentRoundScores",
        JSON.stringify(currentRoundScores)
      );
    }
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

  const handleScoreChange: (playerId: string, value: string) => void = (
    playerId,
    value
  ) => {
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
      // Clear all game data from localStorage
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

  // Add confetti effect when winners are shown (scoped to Round Info Section)
  useEffect(() => {
    if (isGameOver && winners.length > 0 && roundInfoRef.current) {
      const canvas = document.createElement("canvas");
      canvas.style.position = "absolute";
      canvas.style.top = "0";
      canvas.style.left = "0";
      canvas.style.width = "100%";
      canvas.style.height = "100%";
      canvas.style.pointerEvents = "none";
      canvas.style.zIndex = "10";
      roundInfoRef.current.appendChild(canvas);
      const myConfetti = confetti.create(canvas, { resize: true, useWorker: true });
      const duration = 4000; // 4 seconds for a smoother effect
      const animationEnd = Date.now() + duration;
      const randomInRange = (min: number, max: number) => Math.random() * (max - min) + min;
      const interval: number = window.setInterval(function () {
        const timeLeft = animationEnd - Date.now();
        if (timeLeft <= 0) {
          clearInterval(interval);
          setTimeout(() => {
            if (canvas.parentNode) canvas.parentNode.removeChild(canvas);
          }, 500);
          return;
        }
        const particleCount = 35; // fewer particles per burst for smoothness
        myConfetti({
          particleCount,
          startVelocity: randomInRange(12, 22), // lower velocity for smoother fall
          spread: 70,
          ticks: 120, // longer time per particle
          gravity: 0.7, // slightly slower fall
          origin: { x: randomInRange(0.1, 0.3), y: 0.5 },
          colors: ["#FFD700", "#FFA500", "#FF4500", "#9370DB", "#BA55D3"],
        });
        myConfetti({
          particleCount,
          startVelocity: randomInRange(12, 22),
          spread: 70,
          ticks: 120,
          gravity: 0.7,
          origin: { x: randomInRange(0.7, 0.9), y: 0.5 },
          colors: ["#FFD700", "#FFA500", "#FF4500", "#9370DB", "#BA55D3"],
        });
      }, 350); // slightly slower interval
      return () => {
        clearInterval(interval);
        if (canvas.parentNode) canvas.parentNode.removeChild(canvas);
      };
    }
  }, [isGameOver, winners.length]);

  return (
    <div className="flex flex-col min-h-screen bg-gray-900 text-gray-100 font-inter p-4 sm:p-6 lg:p-8">
      <Header />
      <main className="min-h-screen">
        <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 lg:gap-8 mb-4 sm:mb-6 lg:mb-8 w-full min-w-0">
          {/* Player Addition Section */}
          <Card className="flex-2 bg-gray-800/60 backdrop-blur-sm p-4 sm:p-4 lg:p-6 rounded-xl border border-gray-600/50">
            <h2 className="text-lg sm:text-xl lg:text-2xl font-bold mb-4 sm:mb-5 text-purple-300 text-center sm:text-left">
              Add Players
            </h2>
            <div className="flex flex-wrap gap-2 mb-4 justify-center sm:justify-start">
              {DEFAULTPLAYERS.map((name) => (
                <Button
                  key={name}
                  type="button"
                  className={`px-3 py-1.5 text-xs sm:text-sm rounded-full font-semibold transition-all duration-300 ${
                    players.some((p) => p.name === name)
                      ? "bg-gray-600 text-gray-400 cursor-not-allowed"
                      : "bg-purple-600 hover:bg-purple-500 text-white shadow-lg hover:shadow-purple-500/25 transform hover:scale-105"
                  }`}
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
                  variant="secondary"
                >
                  {name}
                </Button>
              ))}
            </div>
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
              <Input
                type="text"
                placeholder="Enter player name"
                value={newPlayerName}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  setNewPlayerName(e.target.value)
                }
                onKeyPress={(e: React.KeyboardEvent<HTMLInputElement>) =>
                  e.key === "Enter" && addPlayer()
                }
                className="flex-1 p-3 sm:p-3.5 rounded-lg bg-gray-700/80 backdrop-blur-sm text-gray-100 placeholder-gray-400 border border-gray-600 focus:ring-2 focus:ring-purple-400 focus:border-purple-400 transition-all duration-300 text-base"
                ref={playerInputRef}
              />
              <Button
                onClick={addPlayer}
                className="bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-500 hover:to-purple-600 text-white font-bold py-3 sm:py-3.5 px-6 sm:px-8 rounded-lg shadow-lg transition-all duration-300 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-purple-400 focus:ring-offset-2 focus:ring-offset-gray-900 disabled:opacity-50 disabled:cursor-not-allowed text-base"
                disabled={newPlayerName.trim() === ""}
              >
                Add Player
              </Button>
            </div>
          </Card>

          {/* Round Info Section */}
          <div ref={roundInfoRef} className="relative flex-1">
            <Card className="bg-gray-800 p-4 sm:p-4 lg:p-6 rounded-xl border border-gray-600/50 text-center w-full min-w-0">
              {isGameOver ? (
                <>
                  <h2 className="text-3xl font-bold text-green-400">
                    Game Over!
                  </h2>
                  {winners.length > 0 && (
                    <h2 className="text-2xl sm:text-3xl font-bold text-green-400">
                      Winner{winners.length > 1 ? "s" : ""}:{" "}
                      <span className="text-3xl sm:text-4xl font-extrabold text-yellow-300 animate-pulse">
                        {winners.join(" & ")}!
                      </span>
                    </h2>
                  )}
                </>
              ) : (
                <>
                  <h2 className="text-3xl font-bold text-orange-400">
                    Round {currentRound + 1} / {JOKERS.length}
                  </h2>
                  {currentJoker && (
                    <h2 className="text-3xl font-bold text-orange-400 my-2">
                      Joker is{" "}
                      <span
                        onClick={() => setShowJoker((prev) => !prev)}
                        className={`inline-flex items-center cursor-pointer transition-transform transform hover:scale-110 ${
                          !showJoker ? "align-middle" : ""
                        }`}
                        title="Click to toggle Joker visibility"
                      >
                        {showJoker ? (
                          <span className="text-yellow-300">{currentJoker}</span>
                        ) : (
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-6 w-6 text-yellow-300"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                            />
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                            />
                          </svg>
                        )}
                      </span>
                    </h2>
                  )}
                </>
              )}

              <div className="flex justify-center mt-4 sm:mt-6 lg:mt-8">
                <Button
                  onClick={resetGame}
                  className="bg-red-600 hover:bg-red-700 text-white font-bold py-2 sm:py-3 px-6 sm:px-8 rounded-md shadow-lg transition-transform transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 focus:ring-offset-gray-800 text-sm sm:text-base"
                  variant="destructive"
                >
                  Reset Game
                </Button>
              </div>
            </Card>
          </div>
        </div>

        {/* Score Input Section */}
        <ScoreInput
          players={players}
          currentRoundScores={currentRoundScores}
          handleScoreChange={handleScoreChange}
          submitRoundScores={submitRoundScores}
          scoreInputRefs={scoreInputRefs}
          currentRound={currentRound}
          isGameOver={isGameOver}
        />

        {/* Scoreboard Section */}
        {players.length > 0 && (
          <Card className="bg-gray-800 p-3 sm:p-4 lg:p-6 rounded-xl shadow-inner border border-gray-700 mb-4 sm:mb-6 lg:mb-8 w-full min-w-0">
            <h2 className="text-xl sm:text-2xl font-bold mb-3 sm:mb-4 text-green-300 w-full break-words">
              Scoreboard
            </h2>
            <Separator className="mb-3 sm:mb-4" />
            <ScoreCardTable
              players={players}
              scores={scores}
              JOKERS={JOKERS}
              isGameOver={isGameOver}
              winners={winners}
              calculateTotalScore={calculateTotalScore}
            />
          </Card>
        )}

        {/* Confirmation Modal */}
        <Dialog open={showConfirmation} onOpenChange={setShowConfirmation}>
          <DialogContent className="bg-gray-800 rounded-xl p-8 border border-gray-700 max-w-sm w-full text-center">
            <DialogHeader>
              <DialogTitle className="text-2xl font-bold mb-4 text-yellow-300">
                {confirmAction ? "Confirm Action" : "Notice"}
              </DialogTitle>
            </DialogHeader>
            <DialogDescription className="text-gray-300 mb-6">
              {confirmationMessage}
            </DialogDescription>
            <div className="flex justify-center gap-4">
              {confirmAction && (
                <Button
                  onClick={cancelConfirmation}
                  className="bg-gray-600 hover:bg-gray-700 text-white font-bold py-2 px-5 rounded-md transition-transform transform hover:scale-105"
                  variant="secondary"
                >
                  Cancel
                </Button>
              )}
              <Button
                onClick={
                  confirmAction
                    ? proceedConfirmation
                    : () => setShowConfirmation(false)
                }
                className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-5 rounded-md transition-transform transform hover:scale-105"
              >
                {confirmAction ? "Confirm" : "OK"}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </main>

      <Footer />
    </div>
  );
}

export default DutchScorecard;
