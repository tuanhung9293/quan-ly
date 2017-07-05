'use strict'

const check = require('../../argument-validator').check
const Lodash = require('lodash')
var ObjectID = require('mongodb').ObjectID
const Constants = require('../lib/constants')

const STATUS_ACTIVE = Constants.STATUS_ACTIVE
const STATUS_INACTIVE = Constants.STATUS_INACTIVE
const STATUS_DELETED = Constants.STATUS_DELETED
const ENUM_STATUSES = Constants.ENUM_STATUSES

module.exports = function () {
  var si = this

  si.add('role:tag, cmd:has-tag', function (args, done) {
    var entity = make_tag_entity(process.env.COMPANY)
    entity.load$({ type: args.type, value: args.value }, function (err, respond) {
      if (err) throw err

      if (respond && (respond.status === STATUS_ACTIVE || respond.status === STATUS_INACTIVE) && args.status !== STATUS_DELETED) {
        return done(null, { ok: true, tag: respond })
      }

      return done(null, { ok: false })
    })
  })

  si.add('role:tag, cmd:add', function (args, done) {
    var self = this
    check(args, done)
      .arg('type').required().string().min(2)
      .arg('text').required().string().min(2)
      .arg('value').optional().string()
      .arg('status').optional().default(STATUS_ACTIVE).inArray(ENUM_STATUSES)
      .then(function (data, reply) {
        data.text = (data.text).trim()
        if (typeof data.value === 'undefined') {
          data.value = data.text.toLowerCase()
        }

        var entity = make_tag_entity(process.env.COMPANY)
        data.created_at = new Date
        data.updated_at = new Date
        if (data.status === STATUS_DELETED) data.deleted_at = new Date

        var checkData = { type: data.type, value: data.value, status: data.status }
        self.act('role:tag, cmd:has-tag', checkData, function (err, respond) {
          if (err||respond.ok) return done(err, { ok: false, why: 'tag-existing' })

          entity.data$(data).save$(function (err, tag) {
            if (err) throw err

            reply({ tag: tag })
          })
        })
      })
  })

  si.add('role:tag, cmd:update', function (args, done) {
    var self = this
    check(args, done)
      .arg('id').required()
      .arg('type').optional().string().min(2)
      .arg('text').optional().string().min(2)
      .arg('value').optional().string()
      .arg('status').optional().inArray(ENUM_STATUSES)
      .then(function (data, reply) {
        if (typeof data.text !== 'undefined') {
          data.text = (data.text).trim()
        }
        var entity = make_tag_entity(process.env.COMPANY)
        entity.load$({ id: data.id }, function (err, updatedTag) {
          if (err) throw err

          if (!updatedTag) return done(null, { ok: false, why: 'not-found' })

          data.updated_at = new Date
          updatedTag.data$(data)
          if (updatedTag.status === STATUS_DELETED) updatedTag.deleted_at = new Date

          var checkData = { type: updatedTag.type, value: updatedTag.value, status: data.status }
          self.act('role:tag, cmd:has-tag', checkData, function (err, respond) {
            if (err || (respond.ok && data.id !== respond.tag.id)){
              return done(err, { ok: false, why: 'tag-existing' })
            }

            updatedTag.save$(function (err, tag) {
              if (err) throw err

              reply({ tag: tag })
            })
          })
        })
      })
  })

  si.add('role:tag, cmd:delete', function (args, done) {
    this.act('role:tag, cmd:update', { id: args.id, status: STATUS_DELETED }, done)
  })

  si.add('role:tag, cmd:restore', function (args, done) {
    this.act('role:tag, cmd:update', { id: args.id, status: STATUS_ACTIVE }, done)
  })

  si.add('role:tag, cmd:find', function (args, done) {
    check(args, done)
      .arg('query').optional().default({}).object()
      .arg('id').optional()
      .arg('type').optional().string().min(2)
      .arg('text').optional().string().min(2)
      .arg('value').optional().string()
      .arg('status').optional().default(STATUS_ACTIVE).inArray(ENUM_STATUSES)
      .then(function (data, reply) {
        var entity = make_tag_entity(process.env.COMPANY)
        var query = Lodash.assign({}, data.query, data)
        delete query.query
        entity.load$(query, function (err, tag) {
          if (err) throw err

          reply({ tag: tag })
        })
      })
  })

  si.add('role:tag, cmd:get', function (args, done) {
    check(args, done)
      .arg('query').optional().default({}).object()
      .arg('id').optional()
      .arg('type').optional().string().min(2)
      .arg('text').optional().string().min(2)
      .arg('value').optional().string()
      .arg('status').optional().default(STATUS_ACTIVE).inArray(ENUM_STATUSES)
      .then(function (data, reply) {
        var entity = make_tag_entity(process.env.COMPANY)
        var query = Lodash.assign({}, data.query, data)
        delete query.query
        entity.list$(query, function (err, tags) {
          if (err) throw err

          reply({ tags: tags })
        })
      })
  })

  si.add('role:tag, cmd:get-by-ids', function (args, done) {
    check(args, done)
      .arg('ids').required().array()
      .then(function (data, reply) {
        if (data.ids.length === 0) return done(null, { ok: false, why: 'not-found' })

        var tagIds = data.ids
        var nativeMeta = { sort: [ [ 'text', 1 ] ] }
        var nativeQuery = {
          _id: {
            $in: tagIds.filter(function (id) {
              return ObjectID.isValid(id)
            }).map(function (id) {
              return ObjectID.createFromHexString(id)
            })
          }
        }
        var entity = make_tag_entity(process.env.COMPANY)
        entity.list$({ native$: [ nativeQuery, nativeMeta ] }, function (err, tags) {
          if (err) throw err

          reply({ tags: tags })
        })
      })
  })

  function make_tag_entity (company) {
    return si.make(company, 'company', 'tag')
  }

  return 'tag'
}