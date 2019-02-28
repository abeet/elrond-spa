const activeHash = `#unmount-rejects`;

export default function() {
  describe(`mount-rejects app`, () => {
    let myApp;

    beforeAll(() => {
      elrondSpa.registerApplication('./unmount-rejects.app.js', () => System.import('./unmount-rejects.app.js'), location => location.hash === activeHash);
    });

    beforeEach(done => {
      location.hash = activeHash;

      System
      .import('./unmount-rejects.app.js')
      .then(app => myApp = app)
      .then(app => app.reset())
      .then(done)
      .catch(err => {throw err})
    })

    it(`bootstraps and mounts, but then is put into SKIP_BECAUSE_BROKEN once it unmounts`, (done) => {
      elrondSpa
      .triggerAppChange()
      .then(() => {
        expect(myApp.numBootstraps()).toEqual(1);
        expect(myApp.numMounts()).toEqual(1);
        expect(myApp.numUnmounts()).toEqual(0);
        expect(elrondSpa.getMountedApps()).toEqual(['./unmount-rejects.app.js']);
        expect(elrondSpa.getAppStatus('./unmount-rejects.app.js')).toEqual('MOUNTED');

        location.hash = '#not-unmount-rejects';
        elrondSpa
        .triggerAppChange()
        .then(() => {
          expect(myApp.numUnmounts()).toEqual(1);
          expect(elrondSpa.getMountedApps()).toEqual([]);
          expect(elrondSpa.getAppStatus('./unmount-rejects.app.js')).toEqual('SKIP_BECAUSE_BROKEN');

          location.hash = '#unmount-rejects';
          elrondSpa
          .triggerAppChange()
          .then(() => {
            // it shouldn't be mounted again
            expect(myApp.numMounts()).toEqual(1);
            expect(elrondSpa.getMountedApps()).toEqual([]);
            expect(elrondSpa.getAppStatus('./unmount-rejects.app.js')).toEqual('SKIP_BECAUSE_BROKEN');

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
