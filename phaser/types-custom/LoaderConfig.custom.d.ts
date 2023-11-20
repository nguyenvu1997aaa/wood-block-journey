            type LoaderConfig = {
                /**
                 * A URL used to resolve paths given to the loader. Example: 'http://labs.phaser.io/assets/'.
                 */
                baseURL?: string;
                /**
                 * A URL path used to resolve relative paths given to the loader. Example: 'images/sprites/'.
                 */
                path?: string;
                /**
                 * The maximum number of resources the loader will start loading at once.
                 */
                maxParallelDownloads?: number;
                /**
                 * 'anonymous', 'use-credentials', or `undefined`. If you're not making cross-origin requests, leave this as `undefined`. See {@link https://developer.mozilla.org/en-US/docs/Web/HTML/CORS_settings_attributes}.
                 */
                crossOrigin?: string | undefined;
                /**
                 * The response type of the XHR request, e.g. `blob`, `text`, etc.
                 */
                responseType?: string;
                /**
                 * Should the XHR request use async or not?
                 */
                async?: boolean;
                /**
                 * Optional username for all XHR requests.
                 */
                user?: string;
                /**
                 * Optional password for all XHR requests.
                 */
                password?: string;
                /**
                 * Optional XHR timeout value, in ms.
                 */
                timeout?: number;

                /**
                 * Optional XHR retries, 0 as default.
                 */
                retries?: number;
            };