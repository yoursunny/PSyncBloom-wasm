/* global processListeners, Module */
for (const [eventName, oldFns] of Object.entries(processListeners)) {
  processListeners[eventName] = process.listeners(eventName).filter((fn) => !oldFns.includes(fn));
}
Module.dispose = () => {
  // emcc 2.0.18 throws error on outer for-of loop, so use forEach instead
  // eslint-disable-next-line unicorn/no-array-for-each
  Object.entries(processListeners).forEach(([eventName, fns]) => {
    for (const fn of fns) {
      process.off(eventName, fn);
    }
  });
};
