const activeHash = `#invalid-unload`;

export default function() {
  describe(`invalid-unload app :`, () => {
    let myApp;

    beforeAll(() => {
      elrondSpa.registerApplication('./invalid-unload.app.js', () => System.import('./invalid-unload.app.js'), location => location.hash === activeHash);
    });

    beforeEach(done => {
      location.hash = '';

      System
      .import('./invalid-unload.app.js')
      .then(app => myApp = app)
      .then(() => elrondSpa.unloadApplication('./invalid-unload.app.js'))
      .then(() => elrondSpa.triggerAppChange())
      .then(() => myApp.reset())
      .then(done)
      .catch(err => console.error(err))
    });

    it(`throws an error if you call unloadApplication incorrectly`, () => {
      try {
        // The parameters are in the reverse order
        elrondSpa.unloadApplication({waitForUnmount}, './invalid-unload.app.js');
        fail("Calling unloadApplication with incorrect params should throw");
      } catch(err) {
        // expected
      }

      try {
        // Trying to unload an app that doesn't exist
        elrondSpa.unloadApplication("App that doesn't exist");
        fail("Calling unloadApplication on non-existent app should throw");
      } catch(err) {
        // expected
      }
    });

    it(`puts the app into SKIP_BECAUSE_BROKEN because it has an incorrect unload lifecycle`, done => {
      location.hash = activeHash;
      elrondSpa.triggerAppChange().then(() => {
        // The unload lifecycle hasn't been called yet, so elrond-spa doesn't know it is a bad impl yet.
        expect(elrondSpa.getAppStatus('./invalid-unload.app.js')).toBe('MOUNTED');
        return elrondSpa.unloadApplication('./invalid-unload.app.js');
      })
      .then(() => {
        fail(`unloadApplication() should have rejected the promise it returned because the app has a bad implementation of the unload lifecycle`);
        done();
      })
      .catch(err => {
        // Now the unload lifecycle has been called and has been determined to be invalid
        expect(elrondSpa.getAppStatus('./invalid-unload.app.js')).toBe('SKIP_BECAUSE_BROKEN');
        done();
      });
    });
  });
}
