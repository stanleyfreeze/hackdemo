class Timer {
    step: Function;
    seconds: number;
    minutes: number;
    hours: number;
    timerInterval: any;
    running: boolean;
    currentTime: string;

    constructor(step:Function = () => {}) {
        this.step = step; // Callback function to update timer display
        this.seconds = 0;
        this.minutes = 0;
        this.hours = 0;
        this.timerInterval = null;
        this.running = false;
        this.currentTime = `${this.minutes.toString().padStart(2, '0')}:${this.seconds.toString().padStart(2, '0')}`;
    }

    async updateTimer() {
        this.seconds++;
        if (this.seconds === 60) {
            this.seconds = 0;
            this.minutes++;
        }
        if (this.minutes === 60) {
            this.minutes = 0;
            this.hours++;
        }

        const formattedTime = `${this.minutes.toString().padStart(2, '0')}:${this.seconds.toString().padStart(2, '0')}`;
        this.currentTime = formattedTime;
        await this.step(formattedTime);
        return formattedTime;
    }

    start() {
        if (!this.running) {
            this.running = true;
            this.timerInterval = setInterval(async () => {
                await this.updateTimer();
            }, 1000);
        }
    }

    pause() {
        if (this.running) {
            clearInterval(this.timerInterval);
            this.running = false;
        }
    }

    stop() {
        if (this.running) {
            clearInterval(this.timerInterval);
            this.running = false;
        }
        this.seconds = 0;
        this.minutes = 0;
        this.hours = 0;
        const formattedTime = `${this.minutes.toString().padStart(2, '0')}:${this.seconds.toString().padStart(2, '0')}`;
        this.currentTime = formattedTime
        this.step(formattedTime);
    }
    reset() {
        this.seconds = 0;
        this.minutes = 0;
        this.hours = 0;
        const formattedTime = `${this.minutes.toString().padStart(2, '0')}:${this.seconds.toString().padStart(2, '0')}`;
        this.currentTime = formattedTime
    }

}
export default Timer