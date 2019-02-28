export let Loader = null;

export function setLoader(loader) {
  if (!loader || typeof loader.import !== 'function') {
    throw new Error(`'loader' is not a real loader. Must have an import function that returns a Promise`);
  }
  Loader = loader;
  console.error("Warning: elrondSpa.setLoader is deprecated. Please declare apps with a loading function instead. See https://github.com/abeet/elrond-spa/blob/master/docs/elrond-spa-config.md#loading-function");
}
