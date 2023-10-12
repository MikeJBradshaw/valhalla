import { matchEvent } from '@marblejs/core'
import { Subject, of } from 'rxjs'
import { map, switchMap } from 'rxjs/operators'
import { ofType } from 'redux-observable'
import type { WsEffect } from '@marblejs/websockets'

import {
  MASTER_BATH_INIT,
  MASTER_BATH_UPDATE_PROFILE_MANUAL,
  MASTER_BATH_UPDATE_PROFILE_SENSOR,
  MASTER_BATH_UPDATE_PROFILE_SHOWER,
  wsUpdateMasterBathState,
  wsAck
} from 'websocket/translations'
import {
  CHANGE_GROUP_RED_LIGHT,
  CHANGE_GROUP_WHITE_LIGHT,
  UPDATE_STATE,
  changeGroupRedLight,
  changeGroupWhiteLight,
  updateManualProfile,
  updateSensorProfile,
  updateShowerTimer
} from 'actions/master'
import type { UpdateStateAction } from 'actions/master'
import store from 'store'

type WebsocketUpdateStateAction = UpdateStateAction
export const stateUpdateSubject = new Subject<WebsocketUpdateStateAction>()

export const init: WsEffect = event$ => event$.pipe(
  matchEvent(MASTER_BATH_INIT),
  switchMap(() => of(wsUpdateMasterBathState(store.getState().masterReducer)))
)

export const changeRedLight: WsEffect = event$ => event$.pipe(
  matchEvent(CHANGE_GROUP_RED_LIGHT),
  map(() => {
    store.dispatch(changeGroupRedLight())
    return wsAck()
  })
)

export const changeWhiteLight: WsEffect = event$ => event$.pipe(
  matchEvent(CHANGE_GROUP_WHITE_LIGHT),
  map(() => {
    store.dispatch(changeGroupWhiteLight())
    return wsAck()
  })
)

export const manualProfile: WsEffect = event$ => event$.pipe(
  matchEvent(MASTER_BATH_UPDATE_PROFILE_MANUAL),
  map(() => {
    store.dispatch(updateManualProfile())
    return wsAck()
  })
)

export const sensorProfile: WsEffect = event$ => event$.pipe(
  matchEvent(MASTER_BATH_UPDATE_PROFILE_SENSOR),
  map(() => {
    store.dispatch(updateSensorProfile())
    return wsAck()
  })
)

export const showerProfile: WsEffect = event$ => event$.pipe(
  matchEvent(MASTER_BATH_UPDATE_PROFILE_SHOWER),
  map(() => {
    store.dispatch(updateShowerTimer())
    return wsAck()
  })
)

export const updateState: WsEffect = event$ => event$.pipe(
  matchEvent(MASTER_BATH_INIT),
  switchMap(() => stateUpdateSubject.pipe(
    ofType(UPDATE_STATE),
    map(() => wsUpdateMasterBathState(store.getState().masterReducer))
  ))
)

export default [
  init,
  changeRedLight,
  changeWhiteLight,
  manualProfile,
  sensorProfile,
  showerProfile,
  updateState
]