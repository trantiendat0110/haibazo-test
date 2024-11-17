import { Level } from "./enum";

export interface Point {
    id: number;
    x: number;
    y: number;
    number: number;
    opacity: number;
    bgColor: string;
    time: numer;
    zIndex: number;
}

export interface GameState {
    number: number;
    level: Level;
    points: Point[];
    isAutoPlay: boolean;
    gameStatus: GameStatus;
    nextExpectedNumber: number;
}
