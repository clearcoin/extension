const reactTriggerChange = require('../../lib/react-trigger-change')
const {
  timeout,
  queryAsync,
  findAsync,
} = require('../../lib/util')

QUnit.module('currency localization')

QUnit.test('renders localized currency', (assert) => {
  const done = assert.async()
  runCurrencyLocalizationTest(assert).then(done).catch((err) => {
    assert.notOk(err, `Error was thrown: ${err.stack}`)
    done()
  })
})

async function runCurrencyLocalizationTest (assert, done) {
  console.log('*** start runCurrencyLocalizationTest')
  const selectState = await queryAsync($, 'select')
  selectState.val('currency localization')
  await timeout(1000)
  reactTriggerChange(selectState[0])
  await timeout(1000)
  const txView = await queryAsync($, '.tx-view')
  const heroBalance = await findAsync($(txView), '.hero-balance')
  const fiatAmount = await findAsync($(heroBalance), '.fiat-amount')
  assert.equal(fiatAmount[0].textContent, '₱102,707.97')
}
