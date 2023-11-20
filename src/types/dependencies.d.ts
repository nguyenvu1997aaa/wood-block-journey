/// <reference path="../../node_modules/phaser/types/SpineGameObject.d.ts" />
/// <reference path="../../node_modules/phaser/types/SpinePlugin.d.ts" />

module '*.htm' {
    const content: string
    export default content
}

type TSentryUser = {
    id: string
    username: string
}

module 'eruda'

interface ImportMeta {
    env: TObject
    hot?: {
        accept: Function
        invalidate: Function
    }
}
