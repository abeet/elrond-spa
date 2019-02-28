import { reroute } from './navigation/reroute.js';
import { setLoader } from './loader.js';

export let started = false;

export function start() {
  started = true;
  reroute();
}

export function isStarted() {
  return started;
}

const startWarningDelay = 5000;

setTimeout(() => {
  if (!started) {
    console.warn(`elrondSpa.start() has not been called, ${startWarningDelay}ms after elrond-spa was loaded. Before start() is called, apps can be declared and loaded, but not bootstrapped or mounted. See https://github.com/abeet/elrond-spa/blob/master/docs/elrond-spa-api.md#start`);
  }
}, startWarningDelay)
