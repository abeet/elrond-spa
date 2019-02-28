export default function() {
  describe(`bootstrap-times-out-dies`, () => {
    let myApp;

    beforeAll(() => {
      elrondSpa.registerApplication('./bootstrap-times-out-dies.app.js', () => System.import('./bootstrap-times-out-dies.app.js'), location => location.hash === "#bootstrap-times-out-dies");
    });

    beforeEach(done => {
      location.hash = '#bootstrap-times-out-dies';

      System
      .import('./bootstrap-times-out-dies.app.js')
      .then(app => myApp = app)
      .then(app => app.reset())
      .then(done)
      .catch(err => {throw err})
    })

    it(`is put into SKIP_BECAUSE_BROKEN if dieOnTimeout is true`, (done) => {
      elrondSpa
      .triggerAppChange()
      .then(() => {
        expect(myApp.wasBootstrapped()).toEqual(true);
        expect(myApp.wasMounted()).toEqual(false);
        expect(elrondSpa.getMountedApps()).toEqual([]);
        expect(elrondSpa.getAppStatus('./bootstrap-times-out-dies.app.js')).toEqual('SKIP_BECAUSE_BROKEN');
        done();
      })
      .catch(ex => {
        fail(ex);
        done();
      });
    });
  });
}
