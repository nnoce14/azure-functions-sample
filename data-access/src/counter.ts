
export class Counter {
    static #instance: Counter;
    static #startupTime: Date = new Date();
    static #count: number = 0;

    public static getInstance(): Counter {
        if (!Counter.#instance) {
            Counter.#instance = new Counter();
        }
        return Counter.#instance;
    }

    get count(): number {
        console.log('Counter getter called');
        return Counter.#count;
    }

    get startupTime(): Date {
        console.log('Counter startupTime getter called');
        return Counter.#startupTime;
    }

    public increment(): void {
        console.log('Counter increment called');
        Counter.#count = Counter.#count + 1;
    }

    static {
        console.log('Counter static constructor called');
    }
}