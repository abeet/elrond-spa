const activeHash = `#mount-rejects`;

export default function() {
  describe(`mount-rejects app`, () => {
    let myApp;

    beforeAll(() => {
      elrondSpa.registerApplication('./mount-rejects.app.js', () => System.import('./mount-rejects.app.js'), location => location.hash === activeHash);
    });

    beforeEach(done => {
      location.hash = activeHash;

      System
      .import('./mount-rejects.app.js')
      .then(app => myApp = app)
      .then(app => app.reset())
      .then(done)
      .catch(err => {throw err})
    })

    it(`bootstraps and mounts, but then is put into SKIP_BECAUSE_BROKEN and never unmounts`, (done) => {
      elrondSpa
      .triggerAppChange()
      .then(() => {
        expect(myApp.wasBootstrapped()).toEqual(true);
        expect(myApp.wasMounted()).toEqual(true);
        expect(elrondSpa.getMountedApps()).toEqual([]);
        expect(elrondSpa.getAppStatus('./mount-rejects.app.js')).toEqual('SKIP_BECAUSE_BROKEN');

        location.hash = '#not-mount-rejects';
        elrondSpa
        .triggerAppChange()
        .then(() => {
          expect(myApp.wasUnmounted()).toEqual(false);
          expect(elrondSpa.getMountedApps()).toEqual([]);
          expect(elrondSpa.getAppStatus('./mount-rejects.app.js')).toEqual('SKIP_BECAUSE_BROKEN');

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
