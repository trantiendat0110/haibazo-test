class IntervalManager {
    private intervals: Set<number>;

    constructor() {
        this.intervals = new Set();
    }

    add(intervalId: number) {
        this.intervals.add(intervalId);
    }

    remove(intervalId: number) {
        if (this.intervals.has(intervalId)) {
            clearInterval(intervalId);
            this.intervals.delete(intervalId);
        }
    }

    clearAll() {
        this.intervals.forEach((intervalId) => clearInterval(intervalId));
        this.intervals.clear();
    }
}

const intervalManager = new IntervalManager();

export default intervalManager;
