const processListeners = {};
if (typeof process === "object" && typeof process.listeners === "function" && typeof process.off === "function") {
  for (const eventName of ["uncaughtException", "unhandledRejection"]) {
    processListeners[eventName] = process.listeners(eventName);
  }
}
