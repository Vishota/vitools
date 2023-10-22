import crypto from 'crypto';
import { acquire, release } from './locker';

function getUniqueFunctionHash(func: Function): string {
    const functionString = func.toString();
    const hash = crypto.createHash('sha256').update(functionString).digest('hex');
    return hash;
}

export function multithreadSafe<T, R extends (...args: any[]) => T>(func: R): (...args:Parameters<typeof func>) => Promise<T> {
    return async (...args) => {
        const funchash = getUniqueFunctionHash(func)
        await acquire(funchash);
        const r = await func(...args);
        await release(funchash);
        return r;
    }
}
