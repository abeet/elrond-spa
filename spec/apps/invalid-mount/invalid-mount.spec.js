const activeHash = `#invalid-mount`;

export default function() {
  describe(`invalid-mount app`, () => {
    let myApp;

    beforeAll(() => {
      elrondSpa.registerApplication('./invalid-mount.app.js', () => System.import('./invalid-mount.app.js'), location => location.hash === activeHash);
    });

    beforeEach(done => {
      location.hash = activeHash;

      System
      .import('./invalid-mount.app.js')
      .then(app => myApp = app)
      .then(app => app.reset())
      .then(done)
      .catch(err => {throw err})
    })

    it(`is bootstrapped and mounted, but then put in a broken state and never unmounted`, (done) => {
      elrondSpa
      .triggerAppChange()
      .then(() => {
        expect(myApp.wasBootstrapped()).toEqual(true);
        expect(myApp.wasMounted()).toEqual(true);
        expect(elrondSpa.getMountedApps()).toEqual([]);
        expect(elrondSpa.getAppStatus('./invalid-mount.app.js')).toEqual('SKIP_BECAUSE_BROKEN');

        location.hash = 'not-invalid-mount';
        elrondSpa
        .triggerAppChange()
        .then(() => {
          // doesn't get unmounted because it's in a broken state.
          expect(myApp.wasUnmounted()).toEqual(false);
          expect(elrondSpa.getMountedApps()).toEqual([]);
          expect(elrondSpa.getAppStatus('./invalid-mount.app.js')).toEqual('SKIP_BECAUSE_BROKEN');
          done();
        })
        .catch(ex => {
          fail(ex);
          done();
        });
      })
      .catch(ex => {
        fail(ex);
        done();
      });
    });
  });
}
