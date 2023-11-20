namespace GameCore {
    const Configs: IConfig

    namespace Utils {
        namespace Array {
            function chunk<A>(array: A[], size = 1): A[][]
            function difference<S>(source: S[], target: unknown[]): S[]
            function shuffle<A>(array: A[]): void
            function unique<A>(array: A[]): A[]
        }

        namespace Hash {
            function decodeMap<C extends TObject>(hash: string, codeMap: C): Record<number, C>
            function encodeMap(data: TObject, codeMap: TObject, isRecursive = false): string
            function hashToString(hash: string): string
            function stringToHash(hash: string): string
        }

        namespace Image {
            function drawBorder(payload: IPayloadBorder): boolean
            function drawCircle(payload: IPayloadCircle): boolean
            /**
             * Return `1` if game currently use texture 1x.
             *
             * Return `2` if game currently use texture 2x.
             * @returns {number} `1` or `2`
             */
            function getImageScale(): number
            function blobToHtmlImage(blob: Blob, forceNew = true): Promise<HTMLImageElement>
            function blobUrlToFile(blobUrl: string, fileName: string): Promise<File>
            function base64ToFile(base64: string, filename: string): File
        }

        namespace Json {
            function clone(object: unknown): unknown
            function decode(string: string): unknown
            function encode(data: unknown): string
        }

        namespace Object {
            function clear<O extends Record<string, unknown>>(object: O): O
            function hasOwn<O extends Object, K extends PropertyKey>(
                obj: O,
                key: K
            ): obj is O & Record<K, unknown>
            function invert(data: TObject): Record<string, string>
            function keyBy<O extends Record<string, unknown>>(
                list: O[],
                key: string
            ): { [key: string]: O }
        }

        namespace String {
            function capitalize(str: string): string
            function hashCode(str: string): number
            function params(payload: TObject): string
            function randomColor(prefix = '0x'): string
            function random(len: number, startWith?: string): string
            function removeDiacritics(str: string): string
            function getShortName(str: string, length: number): string
            function generateObjectId(radix?: number): string

            /**
             * convert a string to upper camel case without lower characters
             * separate with characters '-', '_', '.' and spaces
             * @param [string] str
             * @returns upper camel case values
             *
             * example: toUpperCamelCase('game scene') => GameScene
             *
             * WARNING: If you have a fully upper string, you need to lower it before call this method.
             */
            function toUpperCamelCase(str: string): string

            /**
             * convert a string to camel case without lower characters
             * separate with characters '-', '_', '.' and spaces
             * @param [string] str
             * @returns camel case values
             *
             * example: toUpperCamelCase('game scene') => gameScene
             *
             * WARNING: If you have a fully upper string, you need to lower it before call this method.
             */
            function toCamelCase(str: string): string

            function generateObjectId(radix?: number): string
        }

        namespace Valid {
            function isBoolean(data: unknown): data is boolean
            function isDebugger(): boolean
            function isFunction<F>(input: F): input is F
            function isNumber(data: unknown): data is number
            function isObject(data: unknown): data is TObject
            function isPropertyKey(key: unknown): key is PropertyKey
            function isString(data: unknown): data is string

            function isValueChangeAsync(
                from: TCheck,
                to: TCheck | Function,
                options?: IOptions
            ): Promise<boolean>
        }

        namespace Number {
            /**
             * @param value
             * @param maxLength
             * @param fillChar - a character - default is '0'
             * @returns
             * example: padEnd(15, 5) => '15000'
             */
            function padEnd(value: number, maxLength: number, fillChar = '0'): string
            /**
             * @param value
             * @param maxLength
             * @param fillChar - a character - default is '0'
             * @returns
             * example: padStart(15, 5) => '00015'
             */
            function padStart(value: number, maxLength: number, fillChar = '0'): string
            /**
             * @interface IAbbreviatedConfig
             * @param {number} fractionalDigits - number length in fraction digit - default is 0
             * @param {number} startAbbreviate - start calculate to abbreviated string, from 0 - 10000, default is 1000
             * @param {number} maxLength - max length of string
             * @param {boolean} removeLastZero - if you want to remove zero after dot, default is True
             * @param {number} suffixes - custom suffixes you want - default = ['', 'k', 'm', 'b', 't']
             */
            interface IAbbreviatedConfig {
                fractionalDigits?: number
                startAbbreviate?: number
                maxLength?: number
                removeLastZero?: boolean
                suffixes?: string[]
            }

            /**
             * Convert long number into abbreviated string
             *
             * 1234 -> 1k, 1000000 -> 1m
             *
             * default config:
             *```typescript
             *      {
             *          fractionalDigits: 0,
             *          startAbbreviate: 1000,
             *          maxLength: -1, // -1 is inf
             *          removeLastZero: true,
             *          suffixes: ['', 'k', 'm', 'b', 't'],
             *      }
             * ```
             * @param {number} value
             * @param {IAbbreviatedConfig} config
             * @returns abbreviated string of value
             *
             * @example
             * toAbbreviatedString(1234) => 1k
             * toAbbreviatedString(
             *      510000,
             *      {
             *          fractionalDigits: 5,
             *          startAbbreviate: 500,
             *          maxLength: 5,
             *          removeLastZero: true
             *      }
             * ) => 0.51m
             */
            function toAbbreviatedString(value: number, config?: IAbbreviatedConfig): string
        }

        namespace Time {
            function isToday(timestamp: number): boolean
            function sleepAsync(milliseconds: number): Promise<void>
        }

        namespace Device {
            function isDesktop(): boolean
            function isMobile(): boolean
            function isAndroid(): boolean
            function isIOS(): boolean
            function isMobileWeb(): boolean
            function pixelRatio(): number
        }
    }
}
