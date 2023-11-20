import Emitter from '@/utils/emitter'
import TASKS from '../constants/Tasks'
import BaseListener from './BaseListener'

const { ID, EVENTS } = TASKS.INVITE_FRIENDS

class InviteFriendsListener extends BaseListener {
    private invitedFriends: string[]

    constructor(game: Phaser.Game) {
        super(game, ID)
        this.resetData()
    }

    protected initEvents(): void {
        Emitter.off(EVENTS.INVITED_FRIEND, this.process)
        Emitter.on(EVENTS.INVITED_FRIEND, this.process)

        Emitter.on(TASKS.EVENTS.TASKS_RESET, () => {
            this.resetData()
        })
    }

    protected resetData = (): void => {
        this.invitedFriends = []
    }

    protected processMore(payload: ITaskEventPayload & { opponentId: string }): boolean {
        const { opponentId } = payload

        if (!opponentId) return false

        if (this.invitedFriends.indexOf(opponentId) !== -1) return false

        this.invitedFriends.push(opponentId)

        return true
    }
}

export default InviteFriendsListener
