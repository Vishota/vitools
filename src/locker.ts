import * as l from 'proper-lockfile'
import { delay } from './common';

export async function release(name: string) {
    await l.unlock(`./_${name}.lock`, {
        realpath: false
    });
}
export async function acquire(name:string, updateDelay:number = 50) {
    while (true) {
        try {
            await l.lock(`_${name}.lock`, {
                realpath: false
            });
            break;
        } catch {
            await delay(updateDelay);
        }
    }
}