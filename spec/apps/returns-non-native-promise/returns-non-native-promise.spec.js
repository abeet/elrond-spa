export default function() {
  describe(`returns-non-native-promise`, () => {
    let myApp;

    beforeAll(() => {
      elrondSpa.registerApplication('./returns-non-native-promise.app.js', () => System.import('./returns-non-native-promise.app.js'), location => location.hash === "#returns-non-native-promise");
    });

    beforeEach(done => {
      location.hash = '#returns-non-native-promise';

      System
      .import('./returns-non-native-promise.app.js')
      .then(app => myApp = app)
      .then(app => app.reset())
      .then(done)
      .catch(err => {throw err})
    });

    it(`goes through the whole lifecycle successfully`, done => {
      expect(myApp.wasMounted()).toEqual(false);
      expect(elrondSpa.getMountedApps()).toEqual([]);

      location.hash = '#returns-non-native-promise';

      elrondSpa
      .triggerAppChange()
      .then(() => {
        expect(myApp.wasBootstrapped()).toEqual(true);
        expect(myApp.wasMounted()).toEqual(true);
        expect(elrondSpa.getMountedApps()).toEqual(['./returns-non-native-promise.app.js']);

        location.hash = '#something-else';

        elrondSpa
        .triggerAppChange()
        .then(() => {
          expect(myApp.wasBootstrapped()).toEqual(true);
          expect(myApp.wasUnmounted()).toEqual(true);
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

    })
  });
}
