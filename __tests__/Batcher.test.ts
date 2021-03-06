import Batcher from "../src/Batcher"


jest.useFakeTimers();


describe('batcher', () => {

    it('sends a batch when the max size is reached', () => {
        expect.assertions(2);
        let batcher = new Batcher({
            batchSize: 5
        });
        let flushed = false;
        batcher.on('flush', function () {
            flushed = true;
        });

        for (let i = 0; i < 4; i++) {
            batcher.write(i);
        }
        expect(flushed).toBe(false);
        batcher.write(1);
        expect(flushed).toBe(true);
    });

    it('sends a batch when the interval has passed', async () => {
        expect.assertions(2);
        let batcher = new Batcher({
            interval: 1
        });

        let flushed = false;
        batcher.on('flush', function () {
            flushed = true;
        });
        batcher.write(0);
        expect(flushed).toBe(false);

        jest.advanceTimersByTime(1000);

        expect(flushed).toBe(true);
        batcher.close();
    });
});
