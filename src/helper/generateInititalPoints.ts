import { Point } from "../types/type";

export function generateInitialPoints(number: number): Point[] {
    const points: Point[] = [];
    const numbers = Array.from({ length: number }, (_, i) => i + 1);

    for (let i = 0; i < numbers.length; i++) {
        points.push({
            id: i,
            x: Math.random() * 92 + 3,
            y: Math.random() * 85 + 8,
            number: numbers[i],
            opacity: 1,
            bgColor: "bg-white",
            time: 3.0,
            zIndex: numbers.length - 1 - i,
        });
    }

    return points;
}
