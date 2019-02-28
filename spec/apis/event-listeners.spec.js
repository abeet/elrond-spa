export function notStartedEventListeners() {
  describe(`event listeners before elrond-spa is started :`, () => {
    beforeEach(ensureCleanSlate)
    
    it(`calls hashchange and popstate event listeners even when elrond-spa is not started`, done => {
      let hashchangeCalled = false, popstateCalled = false;
      window.addEventListener("hashchange", () => {
        if (window.location.hash === '#/a-new-hash')
          hashchangeCalled = true;

        checkTestComplete();
      });
      window.addEventListener("popstate", () => {
        if (window.location.hash === '#/a-new-hash')
          popstateCalled = true;

        checkTestComplete();
      });

      window.location.hash = '#/a-new-hash';

      function checkTestComplete() {
        if (isIE()) {
          // https://developer.microsoft.com/en-us/microsoft-edge/platform/issues/3740423/
          done(); // popstate isn't ever going to be called
        } else if (hashchangeCalled && popstateCalled) {
          // Wait for both hashchange and popstate events
          done();
        }
      }
    });
  });
}

export function yesStartedEventListeners() {
  describe(`event listeners after elrond-spa is started`, () => {
    beforeEach(ensureCleanSlate);

    it(`calls all of the enqueued hashchange listeners even when the first event given to elrondSpa is a popstate event`, done => {
      let hashchangeCalled = false, popstateCalled = false;

      window.addEventListener("hashchange", () => {
        hashchangeCalled = true;
        checkTestComplete();
      });
      window.addEventListener("popstate", () => {
        popstateCalled = true;
        checkTestComplete();
      });

      /* This will first trigger a PopStateEvent, and then a HashChangeEvent. The
       * hashchange event will be queued and not actually given to any event listeners
       * until elrond-spa is sure that those event listeners won't screw anything up.
       * The bug described in https://github.com/abeet/elrond-spa/issues/74 explains
       * why this test is necessary.
       */
      window.location.hash = '#/a-hash-elrond-spa-is-started';

      function checkTestComplete() {
        if (isIE()) {
          // https://developer.microsoft.com/en-us/microsoft-edge/platform/issues/3740423/
          done(); // popstate isn't ever going to be called
        } else if (hashchangeCalled && popstateCalled) {
          // Wait for both hashchange and popstate events
          done();
        }
      }
    });

    /* This regression tests a bug fix. The bug was that elrond-spa used to removeEventListener by checking if functions' toString() resulted in the
     * same string. In (at least) Chrome, this is problematic because you whenever you do fn.bind(null), the fn.toString() turns into
     * `function() { [native code] }`. So if you have multiple hashchange/popstate listeners that are bound functions, then when you call removeEventListener
     * on one of the bound functions, it will remove all of the bound functions so that they are no longer listening to the hashchange or popstate events.
     *
     * This test ensures that elrond-spa is checking triple equals equality instead of string equality when comparing functions to removeEventListener
     */
    it(`window.removeEventListener only removes exactly one event listener, which must === the originally added listener. Even if the listener is a bound function`, done => {
      const boundListener1 = listener1.bind(null);
      const boundListener2 = listener2.bind(null);

      window.addEventListener('hashchange', boundListener1);
      window.addEventListener('hashchange', boundListener2);

      window.removeEventListener('hashchange', boundListener1);

      // This should trigger listener2 to be called
      window.location.hash = `#/nowhere`;

      function listener1() {
        fail("listener1 should not be called, since it was removed");
      }

      function listener2() {
        window.removeEventListener('hashchange', boundListener2); // cleanup after ourselves
        done();
      }
    });
  });
}


function ensureCleanSlate(done) {
  /* First we need to make sure we have a clean slate where elrond-spa is not queueing up events or app changes.
   * Otherwise, the event listeners might be called because of a different spec that causes hashchange and popstate
   * events
   */
  elrondSpa
  .triggerAppChange()
  .then(done)
  .catch(err => {
    fail(err);
    done();
  });
}

function isIE() {
  return /Trident.*rv[ :]*11\./.test(navigator.userAgent);
}
