export function throttle(fn: Function, time: number) {
  let isWaiting = false;
  return function (...args: any[]) {
    if (isWaiting) return;
    fn(...args);
    isWaiting = true;
    setTimeout(() => {
      isWaiting = false;
    }, time);
  };
}
