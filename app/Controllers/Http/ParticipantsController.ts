import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Participant from 'App/Models/Participant'

import Room from 'App/Models/Room'
import CreateParticipants from 'App/Validators/Room/CreateParticipantValidator'

export default class ParticipantsController {
  public async getRoomParticipants ({ params, bouncer } : HttpContextContract) {
    console.log('Get all participants of a '+ params.id +' Room')
    const room = await Room.findOrFail(params.id)
    await bouncer.with('RoomPolicy').authorize('view', room)
    const participants = await room.related('participants').query()
    return participants
  }

  public async addRoomParticipant ({ params, bouncer, request } : HttpContextContract) {
    console.log('Add a participant to a '+ params.id +' Room')
    const room = await Room.findOrFail(params.id)
    await bouncer.with('RoomPolicy').authorize('update', room)
    const payload = await request.validate(CreateParticipants)
    const participant = new Participant()
    // to do

    return participant
  }
}
