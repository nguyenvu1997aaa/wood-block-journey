            type XHRSettingsObject = {
                /**
                 * The response type of the XHR request, i.e. `blob`, `text`, etc.
                 */
                responseType: XMLHttpRequestResponseType;
                /**
                 * Should the XHR request use async or not?
                 */
                async?: boolean;
                /**
                 * Optional username for the XHR request.
                 */
                user?: string;
                /**
                 * Optional password for the XHR request.
                 */
                password?: string;
                /**
                 * Optional XHR timeout value.
                 */
                timeout?: number;
                /**
                 * This value is used to populate the XHR `setRequestHeader` and is undefined by default.
                 */
                headers?: object | undefined;
                /**
                 * This value is used to populate the XHR `setRequestHeader` and is undefined by default.
                 */
                header?: string | undefined;
                /**
                 * This value is used to populate the XHR `setRequestHeader` and is undefined by default.
                 */
                headerValue?: string | undefined;
                /**
                 * This value is used to populate the XHR `setRequestHeader` and is undefined by default.
                 */
                requestedWith?: string | undefined;
                /**
                 * Provide a custom mime-type to use instead of the default.
                 */
                overrideMimeType?: string | undefined;
                /**
                 * The withCredentials property indicates whether or not cross-site Access-Control requests should be made using credentials such as cookies, authorization headers or TLS client certificates. Setting withCredentials has no effect on same-site requests.
                 */
                withCredentials?: boolean;

                /**
                 * retries options, 0 as default
                 */
                retries?: number;
            };