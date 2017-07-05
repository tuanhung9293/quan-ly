'use strict'

import * as Types from '../lib/actionTypes'

export function toggleNav () {
  return { type: Types.CHANGE_NAV, open: 'toggle' }
}

export function openNav () {
  return { type: Types.CHANGE_NAV, open: true }
}

export function closeNav () {
  return { type: Types.CHANGE_NAV, open: false }
}

export function toggleSideOverlay () {
  return { type: Types.CHANGE_SIDE_OVERLAY, open: 'toggle' }
}

export function openSideOverlay () {
  return { type: Types.CHANGE_SIDE_OVERLAY, open: true }
}

export function closeSideOverlay () {
  return { type: Types.CHANGE_SIDE_OVERLAY, open: false }
}

export function setPageTitleTemplate (template) {
  return { type: Types.SET_PAGE_TITLE_TEMPLATE, template: template }
}

export function setPageReady (ready) {
  return { type: Types.SET_PAGE_READY, ready: ready }
}