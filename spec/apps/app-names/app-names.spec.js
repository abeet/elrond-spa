export default function () {
  describe(`app-names`, () => {
    let app;

    beforeAll(() => {
      elrondSpa.registerApplication('./app-names.app.js', () => System.import('./app-names.app.js'), location => location.hash === '#app-names')
    })

    it(`should return all registered app names up to this point regardless of activity`, (done) => {
      expect(elrondSpa.getAppNames()).toEqual(['./app-names.app.js'])
    })
  })
}
