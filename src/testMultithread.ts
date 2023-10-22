import cluster from 'cluster';
import { cpus } from "os";
import { delay } from './common';

export async function testMultithread(
    callback: Function,
    options = {
        delay: 10000,
        threadCount: cpus().length,
        logs: true
    }
) {
    if (cluster.isPrimary) {
        const time = new Date().getTime() + 15000;

        console.log('Running forks');

        let workers: ReturnType<typeof cluster.fork>[] = [];

        for (let i = 0; i < cpus().length; i++) {
            workers.push(
                cluster.fork({
                    WAITFOR: time
                })
            );
            console.log(`${workers.length} workers running`);
        }
        const execTime = new Date().getTime() + options.delay;
        workers.forEach((w) => {
            w.send(execTime);
        })
    }
    else {
        let execTime = Infinity;
        process.on('message', (message: number) => {
            execTime = message;
            console.log(`Waiting for ${execTime} (${execTime - new Date().getTime()} ms left)`);
        });
        while (new Date().getTime() < execTime) await delay(0);
        callback();
    }
}

testMultithread(() => {
    console.log(new Date().getTime());
})