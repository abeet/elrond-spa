const activeHash = `#invalid-unmount`;

export default function() {
  describe(`invalid-unmount app`, () => {
    let myApp;

    beforeAll(() => {
      elrondSpa.registerApplication('./invalid-unmount.app.js', () => System.import('./invalid-unmount.app.js'), location => location.hash === activeHash);
    });

    beforeEach(done => {
      location.hash = activeHash;

      System
      .import('./invalid-unmount.app.js')
      .then(app => myApp = app)
      .then(app => app.reset())
      .then(done)
      .catch(err => {throw err})
    })

    it(`is bootstrapped, mounted, and unmounted, but then put in a broken state and never again mounted`, (done) => {
      elrondSpa
      .triggerAppChange()
      .then(() => {
        expect(myApp.numBootstraps()).toEqual(1);
        expect(myApp.numMounts()).toEqual(1);
        expect(elrondSpa.getMountedApps()).toEqual(['./invalid-unmount.app.js']);
        expect(elrondSpa.getAppStatus('./invalid-unmount.app.js')).toEqual('MOUNTED');

        // now unmount, which will be the first time it enters a broken state
        location.hash = '#not-invalid-unmount';
        elrondSpa
        .triggerAppChange()
        .then(() => {
          expect(myApp.numBootstraps()).toEqual(1);
          expect(myApp.numMounts()).toEqual(1);
          expect(myApp.numUnmounts()).toEqual(1);
          expect(elrondSpa.getMountedApps()).toEqual([]);
          expect(elrondSpa.getAppStatus('./invalid-unmount.app.js')).toEqual('SKIP_BECAUSE_BROKEN');

          // now remount and check if it tries to mount despite being in a broken state
          location.hash = activeHash;
          elrondSpa
          .triggerAppChange()
          .then(() => {
            expect(myApp.numBootstraps()).toEqual(1);
            expect(myApp.numMounts()).toEqual(1); // hasn't increased
            expect(myApp.numUnmounts()).toEqual(1);
            expect(elrondSpa.getMountedApps()).toEqual([]);
            expect(elrondSpa.getAppStatus('./invalid-unmount.app.js')).toEqual('SKIP_BECAUSE_BROKEN');
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
      })
      .catch(ex => {
        fail(ex);
        done();
      });
    });
  });
}
