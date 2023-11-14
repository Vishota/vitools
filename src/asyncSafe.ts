export function asyncSafe<R extends (...args: any[]) => any>(func: R): (...args: Parameters<typeof func>) => Promise<ReturnType<R>> {
    let busy = false;
    const safe: ReturnType<typeof asyncSafe> = async (...args) => {
        // waiting for "busy" equal to false
        const freePromise = new Promise((resolver) => {
            const waiting = setInterval(() => {
                if (!busy) {
                    resolver(0)
                    busy = true
                    clearInterval(waiting)
                }
            }, 100)
        })
        await freePromise;
        const res = await func()
        busy = false;
        return res
    }

    return safe
}