'use strict'

process.env.COMPANY = 'default'

const Lab = require('lab')
const Code = require('code')
const seneca = require('../seneca')
const Lodash = require('lodash')
const Async = require('async')

const lab = exports.lab = Lab.script()
const expect = Code.expect
const describe = lab.describe
const before = lab.before
const it = lab.it
const after = lab.after

var rowTasks = [
  { type: 'Todo', text: 'Todo', status: 'Todo', trading_type: 'Todo', trading_id: 'Todo_1', description: 'To do 1' },
  { type: 'Todo', text: 'Todo', status: 'Todo', trading_type: 'Todo', trading_id: 'Todo_2', description: 'To do 2' },
  {
    type: 'in-progress',
    text: 'in-progress',
    status: 'in-progress',
    trading_type: 'in-progress',
    trading_id: 'in-progress_1',
    description: 'In progress 1'
  },
  {
    type: 'in-progress',
    text: 'in-progress',
    status: 'in-progress',
    trading_type: 'in-progress',
    trading_id: 'in-progress_2',
    description: 'In progress 2'
  },
  { type: 'Done', text: 'Done', status: 'Done', trading_type: 'Done', trading_id: 'Done_1', description: 'Done 1' },
  { type: 'Done', text: 'Done', status: 'Done', trading_type: 'Done', trading_id: 'Done_2', description: 'Done 2' },
  {
    type: 'Close',
    text: 'Close',
    status: 'Close',
    trading_type: 'Close',
    trading_id: 'Close_1',
    description: 'Close 1'
  },
  {
    type: 'Close',
    text: 'Close',
    status: 'Close',
    trading_type: 'Close',
    trading_id: 'Close_2',
    description: 'Close 2'
  }
]

describe('role:task, cmd:find|get', function () {
  after(function (done) {
    seneca.make$('tasks').native$(function (err, db) {
      var collection = db.collection('tasks');
      collection.drop()
      done()
    })
  })

  var tasks = []

  var add_tasks = function (done) {
    Async.map(rowTasks, function (item, mapNext) {
      seneca.act('role:task, cmd:add', item, function (err, respond) {
        mapNext(null, respond.task.data$())
      })
    }, function (err, results) {
      tasks = results
      done()
    })
  }

  before(function (done) {
    Async.waterfall([
      add_tasks
    ], done)
  })

  function find_task (data, callback) {
    seneca.act('role:task, cmd:find', data, callback)
  }

  it('can find by single field', function (done) {
    find_task({ id: tasks[ 2 ].id }, function (err, respond) {
      expect(err).not.exist()
      expect(respond.ok).to.be.true()
      expect(respond.task.data$()).to.include(tasks[ 2 ])

      find_task({ trading_id: tasks[ 4 ].trading_id }, function (err, respond) {
        expect(err).not.exist()
        expect(respond.ok).to.be.true()
        expect(respond.task.data$()).to.include(tasks[ 4 ])

        find_task({ status: tasks[ 6 ].status, query: { sort$: { trading_id: 1 } } }, function (err, respond) {
          expect(err).not.exist()
          expect(respond.ok).to.be.true()
          expect(respond.task.data$()).to.include(tasks[ 6 ])
          done()
        })
      })
    })
  })

  it('can find by multiple fields', function (done) {
    find_task({ id: tasks[ 2 ].id, type: tasks[ 2 ].type }, function (err, respond) {
      expect(err).not.exist()
      expect(respond.ok).to.be.true()
      expect(respond.task.data$()).to.include(tasks[ 2 ])

      find_task(tasks[ 6 ], function (err, respond) {
        expect(err).not.exist()
        expect(respond.ok).to.be.true()
        expect(respond.task.data$()).to.include(tasks[ 6 ])
        done()
      })
    })
  })

  it('can find by query', function (done) {
    find_task({ query: { description: tasks[ 4 ].description } }, function (err, respond) {
      expect(err).not.exist()
      expect(respond.ok).to.be.true()
      expect(respond.task.data$()).to.include(tasks[ 4 ])
      done()
    })
  })

  it('can find with no result', function (done) {
    find_task({ id: tasks[ 1 ].id, text: tasks[ 2 ].text }, function (err, respond) {
      expect(err).not.exist()
      expect(respond.ok).to.be.true()
      expect(respond.task).to.not.exist()
      done()
    })
  })

  it('just returns one and only one entity', function (done) {
    find_task({ status: tasks[ 6 ].status }, function (err, respond) {
      expect(err).not.exist()
      expect(respond.ok).to.be.true()
      if (respond.task.id == tasks[ 6 ].id) {
        expect(respond.task.data$()).to.include(tasks[ 6 ])
      } else {
        expect(respond.task.data$()).to.include(tasks[ 7 ])
      }
      done()
    })
  })

  // //--------------------------------------------------------------------------------------------------------------------

  function get_tasks (data, callback) {
    seneca.act('role:task, cmd:get', data, callback)
  }

  it('can get tasks by single field', function (done) {
    get_tasks({ type: tasks[ 2 ].type, query: { sort$: { trading_id: 1 } } }, function (err, respond) {
      expect(err).not.exist()
      expect(respond.ok).to.be.true()
      expect(respond.tasks.length).to.equal(2)
      expect(respond.tasks[ 0 ].data$()).to.include(tasks[ 2 ])
      expect(respond.tasks[ 1 ].data$()).to.include(tasks[ 3 ])

      get_tasks({ status: tasks[ 5 ].status, query: { sort$: { trading_id: 1 } } }, function (err, respond) {
        expect(err).not.exist()
        expect(respond.ok).to.be.true()
        expect(respond.tasks.length).to.equal(2)
        expect(respond.tasks[ 0 ].data$()).to.include(tasks[ 4 ])
        expect(respond.tasks[ 1 ].data$()).to.include(tasks[ 5 ])

        get_tasks({ text: tasks[ 6 ].text, query: { sort$: { trading_id: 1 } } }, function (err, respond) {
          expect(err).not.exist()
          expect(respond.ok).to.be.true()
          expect(respond.tasks.length).to.equal(2)
          expect(respond.tasks[ 0 ].data$()).to.include(tasks[ 6 ])
          expect(respond.tasks[ 1 ].data$()).to.include(tasks[ 7 ])
          done()
        })
      })
    })
  })

  it('can get products active by multiple field', function (done) {
    get_tasks({ type: tasks[ 0 ].type, status: tasks[ 0 ].status }, function (err, respond) {
      expect(err).not.exist()
      expect(respond.ok).to.be.true()
      expect(respond.tasks.length).to.equal(2)

      get_tasks({ text: tasks[ 6 ].text, trading_id: tasks[ 6 ].trading_id }, function (err, respond) {
        expect(err).not.exist()
        expect(respond.ok).to.be.true()
        expect(respond.tasks[ 0 ].data$()).to.include(tasks[ 6 ])

        get_tasks(tasks[ 7 ], function (err, respond) {
          expect(err).not.exist()
          expect(respond.ok).to.be.true()
          expect(respond.tasks[ 0 ].data$()).to.include(tasks[ 7 ])
          done()
        })
      })
    })
  })

  it('can find by query use sort$', function (done) {
    get_tasks({ query: { type: 'Todo', sort$: { trading_id: -1 } } }, function (err, respond) {
      expect(err).not.exist()
      expect(respond.ok).to.be.true()
      expect(respond.tasks[ 0 ].data$()).to.include(tasks[ 1 ])
      expect(respond.tasks[ 1 ].data$()).to.include(tasks[ 0 ])
      done()
    })
  })

  it('can find by query use sort$ and limit$', function (done) {
    get_tasks({ query: { status: 'in-progress', sort$: { trading_id: -1 }, limit$: 1 } }, function (err, respond) {
      expect(err).not.exist()
      expect(respond.ok).to.be.true()
      expect(respond.tasks[ 0 ].data$()).to.include(tasks[ 3 ])
      done()
    })
  })
})