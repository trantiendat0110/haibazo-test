import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { generateInitialPoints } from "../helper/generateInititalPoints";
import { GameState, Point } from "../types/type";
import { GameStatus, Level } from "../types/enum";

const gameSlice = createSlice({
    name: "game",
    initialState: {
        number: 0,
        level: Level.easy,
        points: [],
        isAutoPlay: false,
        gameStatus: GameStatus.paused,
        nextExpectedNumber: 1,
    } as GameState,
    reducers: {
        setPoints: (state, action: PayloadAction<Point[]>) => {
            state.points = action.payload;
        },
        setLevel: (state, action: PayloadAction<Level>) => {
            console.log(action.payload);

            state.level = action.payload;
        },
        removePoint: (state, action: PayloadAction<number>) => {

            const pointToRemove = state.points.find(
                (point) => point.id === action.payload
            );
            if (pointToRemove) {
                pointToRemove.bgColor = "bg-red-500";
            }
            if (pointToRemove && pointToRemove.number === state.nextExpectedNumber) {
                
                // state.points = state.points.filter(
                //     (point) => point.id !== action.payload
                // );
                state.nextExpectedNumber += 1;
                if (state.points.length === 0) {
                    state.gameStatus = GameStatus.cleared;
                }
            } else {
                state.gameStatus = GameStatus.lost;

            }
            if (state.points[state.points.length - 1].number === state.nextExpectedNumber - 1) {
                state.gameStatus = GameStatus.cleared;
            }
        },
        movePoints: (state) => {
            if (state.gameStatus === GameStatus.lost) return;

            state.points = state.points.map((point) => {
                let deltaX = (Math.random() - 0.5) * 2; // Random movement for x
                let deltaY = (Math.random() - 0.5) * 2; // Random movement for y

                return {
                    ...point,
                    x: Math.min(95, Math.max(3, point.x + deltaX)), // Clamp x to [3, 95]
                    y: Math.min(93, Math.max(8, point.y + deltaY)), // Clamp y to [8, 93]
                };
            });
        },


        updateOpacityAndTime: (state, action: PayloadAction<{ id: number, intervalId: any }>) => {

            if (state.gameStatus === GameStatus.lost) {
                clearInterval(action.payload.intervalId);
                return;
            };

            // Tạo một bản sao của mảng state.points
            const updatedPoints = state.points.map((point) => {
                if (point.id === action.payload.id) {
                    const updatedOpacity = Math.max(point.opacity - 0.04, 0);
                    const updatedTime = Math.max(point.time - 0.1, 0);

                    return {
                        ...point,
                        opacity: updatedOpacity,
                        time: updatedTime,
                    };
                }
                return point;
            });

            // Cập nhật state.points với bản sao mới
            state.points = updatedPoints;

            // Xử lý logic nếu cần khi opacity = 0
            const point = updatedPoints.find((p) => p.id === action.payload.id);

            if (point?.opacity === 0) {
                clearInterval(action.payload.intervalId);
                return;
            }
        },

        toggleAutoPlay: (state) => {
            state.isAutoPlay = !state.isAutoPlay;
        },
        resetGame: (state) => {
            state.points = generateInitialPoints(state.number);
            state.nextExpectedNumber = 1;
            state.gameStatus = GameStatus.playing;
        },
        startGame: (state, action: PayloadAction<number>) => {
            state.gameStatus = GameStatus.playing;
            state.points = generateInitialPoints(action.payload);
        },
        setNumber: (state, action: PayloadAction<number>) => {
            state.number = action.payload;
        },
    },
});

export const { toggleAutoPlay, setLevel, movePoints, resetGame, startGame, setNumber, setPoints, removePoint, updateOpacityAndTime } = gameSlice.actions;

export default gameSlice.reducer;
