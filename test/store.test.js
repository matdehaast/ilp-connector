'use strict'
const PluginStore = require('../src/lib/plugin-store')
const assert = require('chai').assert
const logger = require('../src/common/log')
const logHelper = require('./helpers/log')

describe('PluginStore', function () {
  logHelper(logger)

  beforeEach(async function () {
    this.obj = new PluginStore('sqlite://:memory:', 'test')
  })

  it('should create an object', function () {
    assert.isObject(this.obj)
  })

  it('should support deletion', function (done) {
    this.obj.put('k', 'v').then(() => {
      return this.obj.del('k')
    }).then(() => {
      return this.obj.get('k')
    }).then((value) => {
      assert(value === undefined)
      done()
    })
  })

  it('should support adding elements', function (done) {
    this.obj.put('k', 'v').then(() => {
      return this.obj.get('k')
    }).then((value) => {
      assert(value === 'v')
      done()
    }).catch((err) => { console.error(err) })
  })

  it('should store a long string', async function () {
    const str = ('long string. another ').repeat(1000)
    await this.obj.put('k', str)
    assert.equal(await this.obj.get('k'), str)
  })

  it('should not create a store with an invalid name', async function () {
    const name = ('"; drop table "Users; --')
    try {
      const store = new PluginStore('sqlite://:memory:', name)
      assert(!store, 'constructor should have thrown an error')
    } catch (e) {
      assert.match(e.message, new RegExp(name))
    }
  })

  it('should create a store with dashes in the name', async function () {
    const name = ('a-name-with-dashes')
    const store = new PluginStore('sqlite://:memory:', name)
    assert.isOk(store)
  })
})
