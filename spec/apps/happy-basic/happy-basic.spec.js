export default function() {
  describe(`happy-basic`, () => {
    let myApp;

    beforeAll(() => {
      elrondSpa.registerApplication('./happy-basic.app.js', () => System.import('./happy-basic.app.js'), location => location.hash === "#happy-basic");
    });

    beforeEach(done => {
      location.hash = '#happy-basic';

      System
      .import('./happy-basic.app.js')
      .then(app => myApp = app)
      .then(app => app.reset())
      .then(done)
      .catch(err => {throw err})
    })

    it(`goes through the whole lifecycle successfully`, (done) => {
      expect(myApp.isMounted()).toEqual(false);
      expect(elrondSpa.getMountedApps()).toEqual([]);

      location.hash = 'happy-basic';

      elrondSpa
      .triggerAppChange()
      .then(() => {
        expect(myApp.wasBootstrapped()).toEqual(true);
        expect(myApp.isMounted()).toEqual(true);
        expect(elrondSpa.getMountedApps()).toEqual(['./happy-basic.app.js']);

        location.hash = '#not-happy-basic';

        elrondSpa
        .triggerAppChange()
        .then(() => {
          expect(myApp.wasBootstrapped()).toEqual(true);
          expect(myApp.isMounted()).toEqual(false);
          expect(elrondSpa.getMountedApps()).toEqual([]);
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
      })
    });
  });
}
