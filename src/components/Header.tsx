import { Dialog, DialogContent, DialogTrigger } from "@/shared/ui/dialog";
import GameRules from "./GameRules";

function Header() {
  return (
    <header className="w-full bg-gray-900 text-gray-100 p-4 flex justify-between items-center shadow-lg z-10 font-inter mb-4">
      <div className="flex-grow text-center">
        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-yellow-300 drop-shadow-lg break-words">
          Dutch Game Scorecard
        </h1>
      </div>
      <Dialog>
        <DialogTrigger asChild>
          <div className="flex items-center cursor-pointer ml-4 text-gray-300 hover:text-yellow-300 transition-colors">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <span className="ml-1 text-sm hidden sm:inline">Game Rules</span>{" "}
            {/* Hide text on very small screens */}
          </div>
        </DialogTrigger>
        <DialogContent className="max-w-xl md:max-w-2xl lg:max-w-3xl max-h-[90vh] overflow-y-auto p-0 rounded-b-none">
          <GameRules /> {/* Render the rules content here */}
        </DialogContent>
      </Dialog>
    </header>
  );
}

export default Header;
