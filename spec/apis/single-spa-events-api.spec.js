import {resetSingleSpa} from '../root-apps/root-app.helpers.js';

export default function elrondSpaEventsApi() {
  const dummyApp = {
    bootstrap() {return Promise.resolve()},
    mount() {return Promise.resolve()},
    unmount() {return Promise.resolve()},
    unload() {return Promise.resolve()},
  };

  describe(`events api :`, () => {
    beforeAll(() => {
      elrondSpa.registerApplication('russell', () => Promise.resolve(dummyApp), () => window.location.hash.indexOf("#/russell") === 0);
    });

    describe(`elrond-spa:routing-event`, () => {
      beforeEach(() => {
        window.location.hash = ``;
      });

      it(`is fired on the window whenever the hash changes`, done => {
        elrondSpa
        .triggerAppChange() // start with a clean slate (no previous tests doing anything)
        .then(() => {
          window.addEventListener("elrond-spa:routing-event", finishTest);
          window.location.hash = `#/hash-was-changed`;

          function finishTest() {
            window.removeEventListener("elrond-spa:routing-event", finishTest);
            done();
          }
        })
        .catch(err => {
          fail(err);
          done();
        });
      });

      it(`is fired on the window whenever the url changes`, done => {
        elrondSpa
        .triggerAppChange() // start with a clean slate (no previous tests doing anything)
        .then(() => {
          window.addEventListener("elrond-spa:routing-event", finishTest);
          window.history.pushState({}, null, `#/push-state-called`);

          function finishTest() {
            window.removeEventListener("elrond-spa:routing-event", finishTest);
            done();
          }
        })
        .catch(err => {
          fail(err);
          done();
        });
      });

      it(`doesn't destroy elrond-spa when you throw an error inside of an event listener`, done => {
        const ogOnError = window.onerror;
        window.onerror = function(err) {
          // We expect this to be called exactly once when we throw the error
          console.error(err);
          window.onerror = ogOnError;
        }

        function listener() {
          window.removeEventListener("elrond-spa:routing-event", listener);
          throw Error("Mwahaha I threw an error in an event listener");
        }

        window.addEventListener("elrond-spa:routing-event", listener);

        elrondSpa
        .triggerAppChange()
        .then(() => window.onerror = ogOnError)
        .then(done)
        .catch(err => {
          // If elrond-spa died because of the thrown error above, we've got a problem
          window.removeEventListener("elrond-spa:routing-event", listener);
          window.onerror = ogOnError;
          fail(err);
          done();
        });
      });
    });

    describe(`elrond-spa:app-change`, () => {
      it(`is fired when an app is unmounted`, done => {
        // console.log('starting app change')

        window.location.hash = `#`;

        elrondSpa
        .triggerAppChange() // start with a clean slate (no previous tests doing anything)
        .then(() => {
          window.addEventListener("elrond-spa:app-change", finishTest);
          window.location.hash = `#/russell`;

          function finishTest() {
            // console.log("finishing test")
            window.removeEventListener("elrond-spa:app-change", finishTest);
            done();
          }

          return elrondSpa.triggerAppChange();
        })
        .catch(err => {
          fail(err);
          done();
        });
      });

      it(`is not fired when no app is mounted`, done => {
        function failTest() {
          fail(`elrond-spa:app-change should not be called when no apps change`);
          window.removeEventListener("elrond-spa:app-change", failTest);
          done();
        }

        window.location.hash = ``;

        console.log("starting app change")

        elrondSpa
        .triggerAppChange() 
        .then(() => {
          window.addEventListener("elrond-spa:app-change", failTest);
          window.location.hash = `#/not-a-real-app`;

          return elrondSpa.triggerAppChange();
        })
        .then(() => {
          console.log("Trigger app change finished")
          window.removeEventListener("elrond-spa:app-change", failTest);

          // If failTest wasn't called, then we're good
          done();
        })
        .catch(err => {
          fail(err);
          done();
        });
      })
    });

    describe(`elrond-spa:no-app-change`, () => {
      it(`is fired when no app is loaded, bootstrapped, mounted, unmounted, or unloaded`, done => {
        window.location.hash = `#`;

        elrondSpa
        .triggerAppChange()
        .then(() => {
          window.addEventListener("elrond-spa:no-app-change", finishTest);
          window.location.hash = `#not-a-real-app`;

          function finishTest() {
            window.removeEventListener("elrond-spa:no-app-change", finishTest);
            done();
          }
        })
        .catch(err => {
          fail(err);
          done();
        });
      });
    });
  });

  describe(`elrond-spa:first-mount events`, () => {
    beforeEach(done => {
      resetSingleSpa()
        .then(() => window.location.hash = '#/')
        .then(() => elrondSpa.triggerAppChange())
        .then(() => elrondSpa.start())
        .then(done)
        .catch(err => {
          fail(err);
          done();
        });
    });

    it(`fires first-mount exactly once when the first app is mounted`, done => {
      elrondSpa.registerApplication('firstMount', () => Promise.resolve(dummyApp), () => {
        return window.location.hash.indexOf('#/firstMount') === 0;
      });
      let numEventsFired = 0;

      window.addEventListener('elrond-spa:first-mount', () => {
        numEventsFired++;
      });

      window.location.hash = `#/firstMount`;

      elrondSpa
        .triggerAppChange()
        .then(() => {
          // Unmount
          window.location.hash = `#/`;
          return elrondSpa.triggerAppChange();
        })
        .then(() => {
          // Remount (shouldn't trigger an event)
          window.location.hash = `#/firstMount`;
          return elrondSpa.triggerAppChange();
        })
        .then(() => {
          expect(numEventsFired).toBe(1);
          done();
        })
        .catch(err => {
          fail(err);
          done();
        });
    });

    it(`fires before-first-mount exactly once before the first mount is fired`, done => {
      elrondSpa.registerApplication('beforeFirstMount', () => Promise.resolve(dummyApp), () => {
        return window.location.hash.indexOf('#/beforeFirstMount') === 0;
      });

      let firstMountFired = false, beforeFirstMountFired = false;

      window.addEventListener('elrond-spa:first-mount', () => {
        firstMountFired = true;
      });

      window.addEventListener('elrond-spa:before-first-mount', () => {
        expect(firstMountFired).toBe(false);
        beforeFirstMountFired = true;
      });

      window.location.hash = `#/beforeFirstMount`;

      elrondSpa
        .triggerAppChange()
        .then(() => {
          expect(beforeFirstMountFired).toBe(true);
          expect(firstMountFired).toBe(true);
          done();
        })
        .catch(err => {
          fail(err);
          done();
        });
    });
  });
}
