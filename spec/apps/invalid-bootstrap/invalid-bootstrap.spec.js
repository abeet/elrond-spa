const activeHash = `#invalid-bootstrap`;

export default function() {
  describe(`invalid-bootstrap app`, () => {
    let myApp;

    beforeAll(() => {
      elrondSpa.registerApplication('./invalid-bootstrap.app.js', () => System.import('./invalid-bootstrap.app.js'), location => location.hash === activeHash);
    });

    beforeEach(done => {
      location.hash = activeHash;

      System
      .import('./invalid-bootstrap.app.js')
      .then(app => myApp = app)
      .then(app => app.reset())
      .then(done)
      .catch(err => {throw err})
    })

    it(`is never bootstrapped, mounted, or unmounted`, (done) => {
      elrondSpa
      .triggerAppChange()
      .then(() => {
        expect(myApp.mountWasCalled()).toEqual(false);
        expect(myApp.unmountWasCalled()).toEqual(false);
        expect(elrondSpa.getMountedApps()).toEqual([]);
        expect(elrondSpa.getAppStatus('./invalid-bootstrap.app.js')).toEqual('SKIP_BECAUSE_BROKEN');
        done();
      })
      .catch(ex => {
        fail(ex);
        done();
      });
    });

  });
}
