import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/shared/ui/card";

function GameRules() {
  return (
    // <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 flex items-center justify-center font-inter">
      <Card className="w-full max-w-4xl overflow-hidden bg-gray-900 border border-gray-700">
        <CardHeader className="bg-gradient-to-r from-blue-900 to-indigo-900 text-white border-b border-gray-800">
          <CardTitle className="text-4xl font-extrabold text-center text-yellow-300">
            Dutch Game Rules
          </CardTitle>
          <CardDescription className="text-gray-200 text-center text-lg mt-2">
            Get the lowest total card count or score of your hand.
            <br />A game of memory and quick thinking!
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-8 bg-gray-900">
          {/* Objective */}
          <section>
            <h4 className="text-xl font-bold mb-3 text-blue-300 border-b border-gray-700 pb-2">
              🏆 Objective
            </h4>
            <p className="text-gray-200 leading-relaxed">
              The goal is to achieve the lowest total count of cards or score in
              your hand compared to other players. Played in groups of two or
              more, this game hones your memory and strategic thinking.
            </p>
          </section>

          {/* Card Values */}
          <section>
            <h4 className="text-xl font-bold mb-3 text-blue-300 border-b border-gray-700 pb-2">
              🔢 Card Values
            </h4>
            <ul className="list-disc list-inside text-gray-200 space-y-1">
              <li>
                <span className="font-semibold text-yellow-200">Jokers:</span> 0 points
              </li>
              <li>
                <span className="font-semibold text-yellow-200">Ace:</span> 1 point
              </li>
              <li>
                <span className="font-semibold text-yellow-200">Numbered Cards:</span> Face
                value (e.g., 2 is 2 points, 10 is 10 points)
              </li>
              <li>
                <span className="font-semibold text-yellow-200">Jack:</span> 11 points
              </li>
              <li>
                <span className="font-semibold text-yellow-200">Queen:</span> 12 points
              </li>
              <li>
                <span className="font-semibold text-yellow-200">King:</span> 13 points
              </li>
            </ul>
          </section>

          {/* Game Setup */}
          <section>
            <h4 className="text-xl font-bold mb-3 text-blue-300 border-b border-gray-700 pb-2">
              🚀 Game Setup
            </h4>
            <ol className="list-decimal list-inside text-gray-200 space-y-2">
              <li>
                <span className="font-semibold">Dealer Selection:</span> The
                player who draws the lowest card from the deck becomes the
                dealer.
              </li>
              <li>
                <span className="font-semibold">Dealing Cards:</span> The dealer
                distributes four cards face down to each player, moving
                clockwise.
              </li>
              <li>
                <span className="font-semibold">Initial Card Peek:</span> Each
                player may look at any two of their four cards. After viewing,
                place them back face down with the other two unknown cards in
                any order, trying to remember their positions. This is the{" "}
                <span className="font-bold underline">only</span> time you can
                look at your cards before play begins.
              </li>
              <li>
                <span className="font-semibold">Starting the Round:</span> The
                dealer draws the top card from the closed deck and places it
                face up in an adjoining open pile.
              </li>
            </ol>
          </section>

          {/* Gameplay */}
          <section>
            <h4 className="text-xl font-bold mb-3 text-blue-300 border-b border-gray-700 pb-2">
              🎮 Gameplay
            </h4>
            <ul className="list-disc list-inside text-gray-200 space-y-2">
              <li>
                <span className="font-semibold">Matching Cards:</span> If one of
                your two initially known cards matches the card on the open
                pile, you can immediately put it down to reduce your score.
              </li>
              <li>
                <span className="font-semibold">
                  Player's Turn (Clockwise):
                </span>{" "}
                Starting with the player to the dealer's left, each player takes
                a turn.
              </li>
              <li>
                <span className="font-semibold">Picking a Card:</span> On your
                turn, you must pick one card, either from the closed deck or the
                open (face-up) pile. Consider taking a low card from the open
                pile if available.
              </li>
              <li>
                <span className="font-semibold">Actions After Picking:</span>
                <ul className="list-circle list-inside ml-4 mt-1 space-y-1">
                  <li>
                    <span className="font-semibold">Swap:</span> Look at the
                    picked card. You can swap it for one of your four face-down
                    cards, then place the new card face down in your hand.
                  </li>
                  <li>
                    <span className="font-semibold">Discard:</span>{" "}
                    Alternatively, you can immediately throw the picked card
                    into the face-up open pile for everyone to see.
                  </li>
                </ul>
              </li>
            </ul>
          </section>

          {/* Picture Card Privileges */}
          <section>
            <h4 className="text-xl font-bold mb-3 text-blue-300 border-b border-gray-700 pb-2">
              👑 Picture Card Privileges (If picked from the deck)
            </h4>
            <ul className="list-disc list-inside text-gray-200 space-y-2">
              <li>
                <span className="font-semibold">Jack:</span> Swap any one card
                of yours with any one card of another player (without looking).
              </li>
              <li>
                <span className="font-semibold">Queen:</span> You can look at
                ONE of your own face-down cards.
              </li>
              <li>
                <span className="font-semibold">King:</span> Give a card from
                the discard pile (the one you just picked and would normally
                discard) to any other player.
              </li>
            </ul>
          </section>

          {/* Calling Dutch */}
          <section>
            <h4 className="text-xl font-bold mb-3 text-blue-300 border-b border-gray-700 pb-2">
              🇳🇱 Calling Dutch
            </h4>
            <p className="text-gray-200 leading-relaxed">
              If you believe you have the lowest card count, you can skip your
              turn and "Call Dutch." When you do this, everyone else (except
              you) gets one final turn.
            </p>
          </section>

          {/* Penalties */}
          <section>
            <h4 className="text-xl font-bold mb-3 text-blue-300 border-b border-gray-700 pb-2">
              ⚠️ Penalties
            </h4>
            <ul className="list-disc list-inside text-gray-200 space-y-2">
              <li>
                <span className="font-semibold">
                  Looking at a card a second time:
                </span>{" "}
                If you peek at a card in your hand again during play, you
                receive an additional card (the top card from the face-down
                pile) which you must place face down in your hand without
                looking.
              </li>
              <li>
                <span className="font-semibold">Mis-matching discard:</span> If
                you incorrectly throw one of your cards onto the face-up pile,
                thinking it's a match but it isn't, you must take the
                non-matching card back and receive the top card from the
                face-down pile as a penalty.
              </li>
            </ul>
          </section>

          {/* Strategy Suggestion */}
          <section>
            <h4 className="text-xl font-bold mb-3 text-blue-300 border-b border-gray-700 pb-2">
              💡 Strategy Suggestion
            </h4>
            <p className="text-gray-200 leading-relaxed">
              When it's your turn, consider these options:
            </p>
            <ul className="list-disc list-inside text-gray-200 space-y-2 ml-4">
              <li>
                Replace a card with one of your two known cards if the new card
                is lower.
              </li>
              <li>
                If your two known cards are already low, take a risk! Replace
                one of your unknown cards with a very low picked card (like a
                Joker, Ace, or Two). This helps you gradually learn your unknown
                cards and work towards a low overall score.
              </li>
            </ul>
          </section>
        </CardContent>
      </Card>
    // </div>
  );
}

export default GameRules;
