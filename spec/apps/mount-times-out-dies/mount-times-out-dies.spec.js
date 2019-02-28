const activeHash = `#mount-times-out-dies`;

export default function() {
  describe(`mount-times-out-dies app`, () => {
    let myApp;

    beforeAll(() => {
      elrondSpa.registerApplication('./mount-times-out-dies.app.js', () => System.import('./mount-times-out-dies.app.js'), location => location.hash === activeHash);
    });

    beforeEach(done => {
      location.hash = activeHash;

      System
      .import('./mount-times-out-dies.app.js')
      .then(app => myApp = app)
      .then(app => app.reset())
      .then(done)
      .catch(err => {throw err})
    })

    it(`is put into SKIP_BECAUSE_BROKEN if dieOnTimeout is true`, (done) => {
      elrondSpa
      .triggerAppChange()
      .then(() => {
        expect(myApp.bootstraps()).toEqual(1);
        expect(myApp.mounts()).toEqual(1);
        expect(elrondSpa.getMountedApps()).toEqual([]);
        expect(elrondSpa.getAppStatus('./mount-times-out-dies.app.js')).toEqual('SKIP_BECAUSE_BROKEN');
        done();
      })
      .catch(ex => {
        fail(ex);
        done();
      });
    });
  });
}
