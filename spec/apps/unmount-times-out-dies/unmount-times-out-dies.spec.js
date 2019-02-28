const activeHash = `#unmount-times-out-dies`;

export default function() {
  describe(`unmount-times-out app`, () => {
    let myApp;

    beforeAll(() => {
      elrondSpa.registerApplication('./unmount-times-out-dies.app.js', () => System.import('./unmount-times-out-dies.app.js'), location => location.hash === activeHash);
    });

    beforeEach(done => {
      location.hash = activeHash;

      System
      .import('./unmount-times-out-dies.app.js')
      .then(app => myApp = app)
      .then(app => app.reset())
      .then(done)
      .catch(err => {throw err})
    })

    it(`is put into SKIP_BECAUSE_BROKEN when dieOnTimeout is true`, (done) => {
      elrondSpa
      .triggerAppChange()
      .then(() => {
        expect(myApp.numBootstraps()).toEqual(1);
        expect(myApp.numMounts()).toEqual(1);
        expect(elrondSpa.getMountedApps()).toEqual(['./unmount-times-out-dies.app.js']);
        expect(elrondSpa.getAppStatus('./unmount-times-out-dies.app.js')).toEqual('MOUNTED');

        location.hash = '#not-unmount-times-out';
        elrondSpa
        .triggerAppChange()
        .then(() => {
          expect(myApp.numUnmounts()).toEqual(1);
          expect(elrondSpa.getMountedApps()).toEqual([]);
          expect(elrondSpa.getAppStatus('./unmount-times-out-dies.app.js')).toEqual('SKIP_BECAUSE_BROKEN');
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
