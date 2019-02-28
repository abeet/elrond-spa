export default function() {
  describe(`bootstrap-times-out`, () => {
    let myApp;

    beforeAll(() => {
      elrondSpa.registerApplication('./bootstrap-times-out.app.js', () => System.import('./bootstrap-times-out.app.js'), location => location.hash === "#bootstrap-times-out");
    });

    beforeEach(done => {
      location.hash = '#bootstrap-times-out';

      System
      .import('./bootstrap-times-out.app.js')
      .then(app => myApp = app)
      .then(app => app.reset())
      .then(done)
      .catch(err => {throw err})
    })

    it(`is just waited for if dieOnTimeout is false`, (done) => {
      elrondSpa
      .triggerAppChange()
      .then(() => {
        expect(myApp.wasBootstrapped()).toEqual(true);
        expect(myApp.wasMounted()).toEqual(true);
        expect(elrondSpa.getMountedApps()).toEqual(['./bootstrap-times-out.app.js']);
        expect(elrondSpa.getAppStatus('./bootstrap-times-out.app.js')).toEqual(elrondSpa.MOUNTED);
        done();
      })
      .catch(ex => {
        fail(ex);
        done();
      });
    });
  });
}
