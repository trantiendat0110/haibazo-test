import { memo, useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { GameState, Point } from "../types/type";
import {
  movePoints,
  removePoint,
  updateOpacityAndTime,
} from "../redux/gamePlaySlice";
import { GameStatus, Level } from "../types/enum";
import { AppDispatch } from "../redux/store";
function GameArea() {
  const { points, gameStatus, level } = useSelector(
    (state: { game: GameState }) => state.game
  );
  const dispatch = useDispatch<AppDispatch>();
  const gameAreaRef = useRef(null);

  const handleClick = (point: Point) => {
    if (gameStatus === GameStatus.lost) return;
    if (point) {
      dispatch(removePoint(point.id));
      const intervalId = setInterval(() => {
        dispatch(
          updateOpacityAndTime({
            id: point.id,
            intervalId,
          })
        );
      }, 100);
    }
  };

  useEffect(() => {
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
        <button
          onClick={() => {
            handleClick(point);
          }}
          disabled={point.bgColor === "bg-red-500"}
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
        </button>
      ))}
    </div>
  );
}
export default memo(GameArea);
