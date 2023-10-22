export default async function testTime(callback:(...args: any) => any, times:number, ...args:Parameters<typeof callback>) {
    const start = new Date();
    for(let i = 0; i < times; i++) {
        await callback(...args);
    }
    const elapsed = new Date().getTime() - start.getTime();
    return {
        elapsed,
        average: elapsed / times
    }
}