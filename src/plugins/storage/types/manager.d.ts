type IAction =
    | Function
    | {
          type: string
          payload: TObject
      }

function Dispatch(action: IAction): Promise<void> | void
function GetSate(): IState

type IDispatch = typeof Dispatch
type IGetSate = typeof GetSate

interface IStorage {
    setInitiator(initiator: IStateInitiator): void
    syncStore(): Promise<void>
    dispatch: IDispatch
    getState: IGetSate
    subscribe(callback: Function): void
    watch(selector: Function, callback: Function): Function
}

interface ReduxStore {
    dispatch: Function
    getState: Function
    subscribe: Function
}

interface SelectorProps {
    [key: string]: string | number
}
