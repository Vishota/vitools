import cluster from 'cluster';
import { cpus } from "os";

export async function testMultithread(
    callback: Function,
    options = {
        delay: 10000,
        threadCount: cpus().length - 1,
        logs: true
    }
) {
    if (cluster.isPrimary) {
        const time = new Date().getTime() + 15000;

        console.log('Running forks');

        let workers: ReturnType<typeof cluster.fork>[] = [];

        for (let i = 0; i < options.threadCount; i++) {
            workers.push(
                cluster.fork({
                    EXECTIME: time
                })
            );
            console.log(`${workers.length} workers running`);
        };
    }
    else {
        const execTime = parseInt( process.env.EXECTIME + '' );
        if(isNaN(execTime)) {
            throw 'No EXECTIME provided';
        }
        const timeLeft = execTime - new Date().getTime();
        if(timeLeft <= 0) {
            console.warn(`Delay should be longer: the flow is ${-timeLeft} ms late`);
        }
        console.log(`Waiting for ${execTime} (${timeLeft} ms left)`);
        while (new Date().getTime() < execTime);
        callback();
    }
}