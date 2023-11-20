import { createSelector } from 'reselect'

const getMessagesState = (state: IState) => state.messages.data
const getOpponentIdProps = (_: unused, props: TObject) => props.opponentId

export const getMessages = createSelector([getMessagesState], (data) => data)

export const getMessagesSentStatus = createSelector(
    [getMessages, getOpponentIdProps],
    (data, opponentId) => {
        if (!GameCore.Utils.Valid.isString(opponentId)) return false
        if (!GameCore.Utils.Object.hasOwn(data, opponentId)) return false

        return data[opponentId].sent
    }
)
