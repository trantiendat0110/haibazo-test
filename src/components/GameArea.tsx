import { useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { GameState, Point } from "../types/type";
import {
  movePoints,
  removePoint,
  updateOpacityAndTime,
} from "../redux/gamePlaySlice";
import { GameStatus, Level } from "../types/enum";
import { AppDispatch } from "../redux/store";

export default function GameArea() {
  const { points, gameStatus, level } = useSelector(
    (state: { game: GameState }) => state.game
  );
  const dispatch = useDispatch<AppDispatch>();
  const gameAreaRef = useRef(null);

  const handleClick = (point: Point) => {
    if (gameStatus === GameStatus.lost) return;

    dispatch(removePoint(point.id));

    const clikcUpdateInterval = setInterval(() => {
      dispatch(
        updateOpacityAndTime({ id: point.id, intervalId: clikcUpdateInterval })
      );
    }, 100);
  };

  useEffect(() => {
    console.log(level);

    if (gameStatus === "playing" && level !== Level.easy) {
      const intervalId = setInterval(() => {
        dispatch(movePoints());
      }, 2000);

      return () => clearInterval(intervalId);
    }
  }, [gameStatus, dispatch]);

  return (
    <div
      ref={gameAreaRef}
      className="relative w-full min-h-[600px] border border-black rounded-lg cursor-pointer"
    >
      {/* Points */}
      {points.map((point) => (
        <div
          onClick={() => {
            handleClick(point);
          }}
          key={point.id}
          className={`absolute w-14 h-14 rounded-full border-2 border-primary flex items-center justify-center text-sm font-bold transition-all top-0 left-0 duration-1000 ease-out ${point.bgColor}`}
          style={{
            left: `${point.x}%`,
            top: `${point.y}%`,
            transform: "translate(-50%, -50%)",
            opacity: point.opacity,
            zIndex: point.zIndex,
          }}
        >
          {point.number}
          <span className="absolute bottom-0 right-1/2 translate-x-1/2 text-[10px] text-white">
            {point.time.toFixed(1)}s
          </span>
        </div>
      ))}
    </div>
  );
}
