export default function asyncSafe<R extends (...args: any[]) => any>(func: R): (...args: Parameters<typeof func>) => Promise<ReturnType<R>> {
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
        try {
            const res = await func()
            return res
        }
        catch (e) {
            console.warn(e + ' catched in asyncSafe');
        }
        finally {
            busy = false;
        }
    }

    return safe
}