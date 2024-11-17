import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { GameState } from "../types/type";
import {
  removePoint,
  resetGame,
  setLevel,
  setNumber,
  startGame,
  toggleAutoPlay,
  updateOpacityAndTime,
} from "../redux/gamePlaySlice";
import { GameStatus, Level } from "../types/enum";
import { AppDispatch } from "../redux/store";

export default function ControllGame() {
  const [numberInput, setNumberInput] = useState(0);
  const { points, isAutoPlay, gameStatus, nextExpectedNumber, level } =
    useSelector((state: { game: GameState }) => state.game);
  const [time, setTime] = useState(0);
  const dispatch = useDispatch<AppDispatch>();
  const handleResetGame = () => {
    if (numberInput < 1) {
      alert("Please set number first");
      return;
    }
    setTime(0);
    dispatch(setNumber(numberInput));
    dispatch(resetGame());
  };
  const handleStartGame = () => {
    if (numberInput < 1) {
      alert("Please set number first");
      return;
    }
    dispatch(setNumber(numberInput));
    dispatch(startGame(numberInput));
  };
  // timer
  useEffect(() => {
    const timer = setInterval(() => {
      if (gameStatus === GameStatus.playing) {
        setTime((t) => t + 0.1);
      }
    }, 100); // 100ms for 0.1s increments
    return () => clearInterval(timer);
  }, [gameStatus]);

  useEffect(() => {
    if (isAutoPlay && points.length > 0 && gameStatus === GameStatus.playing) {
      const intervalId = setInterval(() => {
        if (gameStatus === GameStatus.lost) return;
        const targetPoint = points.find(
          (point) => point.number === nextExpectedNumber
        );
        if (targetPoint) {
          dispatch(removePoint(targetPoint.id));
          const intervalId = setInterval(() => {
            // Dispatch action để cập nhật opacity và time
            dispatch(
              updateOpacityAndTime({
                id: targetPoint.id,
                intervalId: intervalId,
              })
            );
          }, 100);
        }
      }, 500);

      return () => clearInterval(intervalId);
    }
  }, [isAutoPlay, points, dispatch, nextExpectedNumber, gameStatus]);
  return (
    <div className="flex justify-between items-center mb-4">
      <div className="space-y-2">
        <div className="font-bold">
          {(gameStatus == GameStatus.paused ||
            gameStatus == GameStatus.playing) && <p>LET'S PLAY</p>}
          {gameStatus == GameStatus.cleared && (
            <p className="text-green-500">ALL CLEARED</p>
          )}
          {gameStatus == "lost" && <p className="text-red-500">GAME OVER</p>}
        </div>
        <div>
          Points:{" "}
          <input
            value={numberInput == 0 || isNaN(numberInput) ? "" : numberInput}
            onChange={(e) => {
              setNumberInput(parseInt(e.target.value));
            }}
            type="text"
            className="border border-black outline-none px-2 rounded-md ml-2"
          />
        </div>
        <div>Time: {time.toFixed(1)}s</div>
        {gameStatus === GameStatus.paused && (
          <div>
            Level: you can setting level for game! For Hard level you can't use
            Auto Play
            <br />
            <select
              className="mt-4 border border-black outline-none px-4 rounded-md bg-red-50 py-2"
              onChange={(e) => {
                dispatch(setLevel(e.target.value as Level));
              }}
              name=""
              id=""
            >
              {(Object.keys(Level) as Array<keyof typeof Level>).map((key) => {
                return (
                  <option key={key} value={Level[key]}>
                    {Level[key]}
                  </option>
                );
              })}
            </select>
          </div>
        )}
      </div>
      <div className="space-x-2">
        {gameStatus !== GameStatus.paused && (
          <button
            className="bg-blue-500 text-white px-4 py-2 rounded-md"
            onClick={handleResetGame}
          >
            Restart
          </button>
        )}
        {gameStatus === GameStatus.playing && level !== Level.hard && (
          <>
            <button
              className="bg-blue-500 text-white px-4 py-2 rounded-md"
              onClick={() => dispatch(toggleAutoPlay())}
              disabled={gameStatus !== GameStatus.playing}
            >
              Auto Play {isAutoPlay ? "ON" : "OFF"}
            </button>
          </>
        )}
        {gameStatus === GameStatus.paused && (
          <button
            className="bg-blue-500 text-white px-4 py-2 rounded-md"
            onClick={() => handleStartGame()}
          >
            Start
          </button>
        )}
      </div>
    </div>
  );
}