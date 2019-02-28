const activeHash = `#invalid-no-mount`;

export default function() {
  describe(`invalid-no-mount app`, () => {
    let myApp;

    beforeAll(() => {
      elrondSpa.registerApplication('./invalid-no-mount.app.js', System.import('./invalid-no-mount.app.js'), location => location.hash === activeHash);
    });

    beforeEach(done => {
      location.hash = activeHash;

      System
      .import('./invalid-no-mount.app.js')
      .then(app => myApp = app)
      .then(app => app.reset())
      .then(done)
      .catch(err => {throw err})
    })

    it(`is never bootstrapped`, (done) => {
      elrondSpa
      .triggerAppChange()
      .then(() => {
        expect(myApp.isBootstrapped()).toEqual(false);
        expect(elrondSpa.getMountedApps()).toEqual([]);
        expect(elrondSpa.getAppStatus('./invalid-no-mount.app.js')).toEqual('SKIP_BECAUSE_BROKEN');
        done();
      })
      .catch(ex => {
        fail(ex);
        done();
      });
    });

  });
}
