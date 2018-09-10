const assert = require('assert')
const { createTestProviderTools } = require('../../../../stub/provider')
const PendingTransactionTracker = require('../../../../../app/scripts/controllers/transactions/pending-tx-tracker')
const MockTxGen = require('../../../../lib/mock-tx-gen')
const sinon = require('sinon')


describe('PendingTransactionTracker', function () {
  let pendingTxTracker, txMeta, txMetaNoHash, providerResultStub,
  provider, txMeta3, txList, knownErrors
  this.timeout(10000)
  beforeEach(function () {
    txMeta = {
      id: 1,
      hash: '0x0593ee121b92e10d63150ad08b4b8f9c7857d1bd160195ee648fb9a0f8d00eeb',
      status: 'signed',
      txParams: {
        from: '0x1678a085c290ebd122dc42cba69373b5953b831d',
        nonce: '0x1',
        value: '0xfffff',
      },
      rawTx: '0xf86c808504a817c800827b0d940c62bb85faa3311a998d3aba8098c1235c564966880de0b6b3a7640000802aa08ff665feb887a25d4099e40e11f0fef93ee9608f404bd3f853dd9e84ed3317a6a02ec9d3d1d6e176d4d2593dd760e74ccac753e6a0ea0d00cc9789d0d7ff1f471d',
    }
    txMetaNoHash = {
      id: 2,
      status: 'signed',
      txParams: { from: '0x1678a085c290ebd122dc42cba69373b5953b831d'},
    }

    providerResultStub = {}
    provider = createTestProviderTools({ scaffold: providerResultStub }).provider

    pendingTxTracker = new PendingTransactionTracker({
      provider,
      nonceTracker: {
        getGlobalLock: async () => {
          return { releaseLock: () => {} }
        },
      },
      getPendingTransactions: () => { return [] },
      getCompletedTransactions: () => { return [] },
      publishTransaction: () => {},
    })
  })

  describe('_checkPendingTx state management', function () {
    let stub

    afterEach(function () {
      if (stub) {
        stub.restore()
      }
    })

    it('should become failed if another tx with the same nonce succeeds', async function () {

      // SETUP
      const txGen = new MockTxGen()

      txGen.generate({
        id: '456',
        value: '0x01',
        hash: '0xbad',
        status: 'confirmed',
        nonce: '0x01',
      }, { count: 1 })

      const pending = txGen.generate({
        id: '123',
        value: '0x02',
        hash: '0xfad',
        status: 'submitted',
        nonce: '0x01',
      }, { count: 1 })[0]

      stub = sinon.stub(pendingTxTracker, 'getCompletedTransactions')
      .returns(txGen.txs)

      // THE EXPECTATION
      const spy = sinon.spy()
      pendingTxTracker.on('tx:failed', (txId, err) => {
        assert.equal(txId, pending.id, 'should fail the pending tx')
        assert.equal(err.name, 'NonceTakenErr', 'should emit a nonce taken error.')
        spy(txId, err)
      })

      // THE METHOD
      await pendingTxTracker._checkPendingTx(pending)

      // THE ASSERTION
      assert.ok(spy.calledWith(pending.id), 'tx failed should be emitted')
    })
  })

  describe('#checkForTxInBlock', function () {
    it('should return if no pending transactions', function () {
      // throw a type error if it trys to do anything on the block
      // thus failing the test
      const block = Proxy.revocable({}, {}).revoke()
      pendingTxTracker.checkForTxInBlock(block)
    })
    it('should emit \'tx:failed\' if the txMeta does not have a hash', function (done) {
      const block = Proxy.revocable({}, {}).revoke()
      pendingTxTracker.getPendingTransactions = () => [txMetaNoHash]
      pendingTxTracker.once('tx:failed', (txId, err) => {
        assert(txId, txMetaNoHash.id, 'should pass txId')
        done()
      })
      pendingTxTracker.checkForTxInBlock(block)
    })
    it('should emit \'txConfirmed\' if the tx is in the block', function (done) {
      const block = { transactions: [txMeta]}
      pendingTxTracker.getPendingTransactions = () => [txMeta]
      pendingTxTracker.once('tx:confirmed', (txId) => {
        assert(txId, txMeta.id, 'should pass txId')
        done()
      })
      pendingTxTracker.once('tx:failed', (_, err) => { done(err) })
      pendingTxTracker.checkForTxInBlock(block)
    })
  })
  describe('#queryPendingTxs', function () {
    it('should call #_checkPendingTxs if their is no oldBlock', function (done) {
      let oldBlock
      const newBlock = { number: '0x01' }
      pendingTxTracker._checkPendingTxs = done
      pendingTxTracker.queryPendingTxs({ oldBlock, newBlock })
    })
    it('should call #_checkPendingTxs if oldBlock and the newBlock have a diff of greater then 1', function (done) {
      const oldBlock = { number: '0x01' }
      const newBlock = { number: '0x03' }
      pendingTxTracker._checkPendingTxs = done
      pendingTxTracker.queryPendingTxs({ oldBlock, newBlock })
    })
    it('should not call #_checkPendingTxs if oldBlock and the newBlock have a diff of 1 or less', function (done) {
      const oldBlock = { number: '0x1' }
      const newBlock = { number: '0x2' }
      pendingTxTracker._checkPendingTxs = () => {
        const err = new Error('should not call #_checkPendingTxs if oldBlock and the newBlock have a diff of 1 or less')
        done(err)
      }
      pendingTxTracker.queryPendingTxs({ oldBlock, newBlock })
      done()
    })
  })

  describe('#_checkPendingTx', function () {
    it('should emit \'tx:failed\' if the txMeta does not have a hash', function (done) {
      pendingTxTracker.once('tx:failed', (txId, err) => {
        assert(txId, txMetaNoHash.id, 'should pass txId')
        done()
      })
      pendingTxTracker._checkPendingTx(txMetaNoHash)
    })

    it('should should return if query does not return txParams', function () {
      providerResultStub.eth_getTransactionByHash = null
      pendingTxTracker._checkPendingTx(txMeta)
    })

    it('should emit \'txConfirmed\'', function (done) {
      providerResultStub.eth_getTransactionByHash = {blockNumber: '0x01'}
      pendingTxTracker.once('tx:confirmed', (txId) => {
        assert(txId, txMeta.id, 'should pass txId')
        done()
      })
      pendingTxTracker.once('tx:failed', (_, err) => { done(err) })
      pendingTxTracker._checkPendingTx(txMeta)
    })
  })

  describe('#_checkPendingTxs', function () {
    beforeEach(function () {
      const txMeta2 = txMeta3 = txMeta
      txMeta2.id = 2
      txMeta3.id = 3
      txList = [txMeta, txMeta2, txMeta3].map((tx) => {
        tx.processed = new Promise((resolve) => { tx.resolve = resolve })
        return tx
      })
    })

    it('should warp all txMeta\'s in #_checkPendingTx', function (done) {
      pendingTxTracker.getPendingTransactions = () => txList
      pendingTxTracker._checkPendingTx = (tx) => { tx.resolve(tx) }
      Promise.all(txList.map((tx) => tx.processed))
      .then((txCompletedList) => done())
      .catch(done)

      pendingTxTracker._checkPendingTxs()
    })
  })

  describe('#resubmitPendingTxs', function () {
    const blockStub = { number: '0x0' }
    beforeEach(function () {
    const txMeta2 = txMeta3 = txMeta
    txList = [txMeta, txMeta2, txMeta3].map((tx) => {
        tx.processed = new Promise((resolve) => { tx.resolve = resolve })
        return tx
      })
    })

    it('should return if no pending transactions', function () {
      pendingTxTracker.resubmitPendingTxs()
    })
    it('should call #_resubmitTx for all pending tx\'s', function (done) {
      pendingTxTracker.getPendingTransactions = () => txList
      pendingTxTracker._resubmitTx = async (tx) => { tx.resolve(tx) }
      Promise.all(txList.map((tx) => tx.processed))
      .then((txCompletedList) => done())
      .catch(done)
      pendingTxTracker.resubmitPendingTxs(blockStub)
    })
    it('should not emit \'tx:failed\' if the txMeta throws a known txError', function (done) {
      knownErrors = [
        // geth
        '     Replacement transaction Underpriced            ',
        '       known transaction',
        // parity
        'Gas price too low to replace     ',
        '     transaction with the sAme hash was already imported',
        // other
        '       gateway timeout',
        '         noncE too low       ',
      ]
      const enoughForAllErrors = txList.concat(txList)

      pendingTxTracker.on('tx:failed', (_, err) => done(err))

      pendingTxTracker.getPendingTransactions = () => enoughForAllErrors
      pendingTxTracker._resubmitTx = async (tx) => {
        tx.resolve()
        throw new Error(knownErrors.pop())
      }
      Promise.all(txList.map((tx) => tx.processed))
      .then((txCompletedList) => done())
      .catch(done)

      pendingTxTracker.resubmitPendingTxs(blockStub)
    })
    it('should emit \'tx:warning\' if it encountered a real error', function (done) {
      pendingTxTracker.once('tx:warning', (txMeta, err) => {
        if (err.message === 'im some real error') {
          const matchingTx = txList.find(tx => tx.id === txMeta.id)
          matchingTx.resolve()
        } else {
          done(err)
        }
      })

      pendingTxTracker.getPendingTransactions = () => txList
      pendingTxTracker._resubmitTx = async (tx) => { throw new TypeError('im some real error') }
      Promise.all(txList.map((tx) => tx.processed))
      .then((txCompletedList) => done())
      .catch(done)

      pendingTxTracker.resubmitPendingTxs(blockStub)
    })
  })
  describe('#_resubmitTx', function () {
    const mockFirstRetryBlockNumber = '0x1'
    let txMetaToTestExponentialBackoff, enoughBalance

    beforeEach(() => {
      pendingTxTracker.getBalance = (address) => {
        assert.equal(address, txMeta.txParams.from, 'Should pass the address')
        return enoughBalance
      }
      pendingTxTracker.publishTransaction = async (rawTx) => {
        assert.equal(rawTx, txMeta.rawTx, 'Should pass the rawTx')
      }
      sinon.spy(pendingTxTracker, 'publishTransaction')

      txMetaToTestExponentialBackoff = Object.assign({}, txMeta, {
        retryCount: 4,
        firstRetryBlockNumber: mockFirstRetryBlockNumber,
      })
    })

    afterEach(() => {
      pendingTxTracker.publishTransaction.restore()
    })

    it('should publish the transaction', function (done) {
      enoughBalance = '0x100000'

      // Stubbing out current account state:
      // Adding the fake tx:
      pendingTxTracker._resubmitTx(txMeta)
      .then(() => done())
      .catch((err) => {
       assert.ifError(err, 'should not throw an error')
       done(err)
      })

      assert.equal(pendingTxTracker.publishTransaction.callCount, 1, 'Should call publish transaction')
    })

    it('should not publish the transaction if the limit of retries has been exceeded', function (done) {
      enoughBalance = '0x100000'
      const mockLatestBlockNumber = '0x5'

      pendingTxTracker._resubmitTx(txMetaToTestExponentialBackoff, mockLatestBlockNumber)
      .then(() => done())
      .catch((err) => {
       assert.ifError(err, 'should not throw an error')
       done(err)
      })

      assert.equal(pendingTxTracker.publishTransaction.callCount, 0, 'Should NOT call publish transaction')
    })

    it('should publish the transaction if the number of blocks since last retry exceeds the last set limit', function (done) {
      enoughBalance = '0x100000'
      const mockLatestBlockNumber = '0x11'

      pendingTxTracker._resubmitTx(txMetaToTestExponentialBackoff, mockLatestBlockNumber)
      .then(() => done())
      .catch((err) => {
       assert.ifError(err, 'should not throw an error')
       done(err)
      })

      assert.equal(pendingTxTracker.publishTransaction.callCount, 1, 'Should call publish transaction')
    })
  })

  describe('#_checkIfNonceIsTaken', function () {
    beforeEach(function () {
      const confirmedTxList = [{
        id: 1,
        hash: '0x0593ee121b92e10d63150ad08b4b8f9c7857d1bd160195ee648fb9a0f8d00eeb',
        status: 'confirmed',
        txParams: {
          from: '0x1678a085c290ebd122dc42cba69373b5953b831d',
          nonce: '0x1',
          value: '0xfffff',
        },
        rawTx: '0xf86c808504a817c800827b0d940c62bb85faa3311a998d3aba8098c1235c564966880de0b6b3a7640000802aa08ff665feb887a25d4099e40e11f0fef93ee9608f404bd3f853dd9e84ed3317a6a02ec9d3d1d6e176d4d2593dd760e74ccac753e6a0ea0d00cc9789d0d7ff1f471d',
      }, {
        id: 2,
        hash: '0x0593ee121b92e10d63150ad08b4b8f9c7857d1bd160195ee648fb9a0f8d00eeb',
        status: 'confirmed',
        txParams: {
          from: '0x1678a085c290ebd122dc42cba69373b5953b831d',
          nonce: '0x2',
          value: '0xfffff',
        },
        rawTx: '0xf86c808504a817c800827b0d940c62bb85faa3311a998d3aba8098c1235c564966880de0b6b3a7640000802aa08ff665feb887a25d4099e40e11f0fef93ee9608f404bd3f853dd9e84ed3317a6a02ec9d3d1d6e176d4d2593dd760e74ccac753e6a0ea0d00cc9789d0d7ff1f471d',
      }]
      pendingTxTracker.getCompletedTransactions = (address) => {
        if (!address) throw new Error('unless behavior has changed #_checkIfNonceIsTaken needs a filtered list of transactions to see if the nonce is taken')
        return confirmedTxList
      }
    })

    it('should return false if nonce has not been taken', function (done) {
      pendingTxTracker._checkIfNonceIsTaken({
        txParams: {
          from: '0x1678a085c290ebd122dc42cba69373b5953b831d',
          nonce: '0x3',
          value: '0xfffff',
        },
      })
      .then((taken) => {
        assert.ok(!taken)
        done()
      })
      .catch(done)
    })

    it('should return true if nonce has been taken', function (done) {
      pendingTxTracker._checkIfNonceIsTaken({
        txParams: {
          from: '0x1678a085c290ebd122dc42cba69373b5953b831d',
          nonce: '0x2',
          value: '0xfffff',
        },
      }).then((taken) => {
        assert.ok(taken)
        done()
      })
      .catch(done)
    })
  })
})
