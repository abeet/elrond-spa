export default function() {
  describe(`bootstrap-rejects`, () => {
    let myApp;

    beforeAll(() => {
      elrondSpa.registerApplication('./bootstrap-rejects.app.js', () => System.import('./bootstrap-rejects.app.js'), location => location.hash === "#bootstrap-rejects");
    });

    beforeEach(done => {
      System
      .import('./bootstrap-rejects.app.js')
      .then(app => myApp = app)
      .then(app => app.reset())
      .then(done)
      .catch(err => {throw err});
    })

    it(`puts the app into SKIP_BECAUSE_BROKEN, fires a window event, and doesn't mount it`, done => {
      window.addEventListener("elrond-spa:application-broken", applicationBroken);
      let applicationBrokenCalled = false;

      location.hash = "#bootstrap-rejects";

      function applicationBroken(evt) {
        applicationBrokenCalled = true;
        expect(evt.detail.appName).toBe('./bootstrap-rejects.app.js');
      }

      elrondSpa
      .triggerAppChange()
      .then(() => {
        window.removeEventListener("elrond-spa:application-broken", applicationBroken);
        expect(applicationBrokenCalled).toBe(true);
        expect(myApp.wasBootstrapped()).toEqual(true);
        expect(myApp.wasMounted()).toEqual(false);
        expect(elrondSpa.getMountedApps()).toEqual([]);
        expect(elrondSpa.getAppStatus('./bootstrap-rejects.app.js')).toEqual(elrondSpa.SKIP_BECAUSE_BROKEN);
        done();
      })
      .catch(err => {
        window.removeEventListener("elrond-spa:application-broken", applicationBroken);
        fail(err);
        done();
      });
    });
  });
}
