/* eslint-disable @typescript-eslint/no-var-requires */

/**
 * @author       Richard Davey <rich@photonstorm.com> * @copyright    2020 Photon Storm Ltd.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

var MergeXHRSettings = require('phaser/loader/MergeXHRSettings')

/**
 * Creates a new XMLHttpRequest (xhr) object based on the given File and XHRSettings
 * and starts the download of it. It uses the Files own XHRSettings and merges them
 * with the global XHRSettings object to set the xhr values before download.
 *
 * @function Phaser.Loader.XHRLoader
 * @since 3.0.0
 *
 * @param {Phaser.Loader.File} file - The File to download.
 * @param {Phaser.Types.Loader.XHRSettingsObject} globalXHRSettings - The global XHRSettings object.
 *
 * @return {XMLHttpRequest} The XHR object.
 */
var XHRLoader = function (file, globalXHRSettings) {
    var config = MergeXHRSettings(globalXHRSettings, file.xhrSettings)

    var xhr = new XMLHttpRequest()

    xhr.open('GET', file.src, config.async, config.user, config.password)

    xhr.responseType = file.xhrSettings.responseType
    xhr.timeout = config.timeout

    if (config.headers) {
        for (var key in config.headers) {
            xhr.setRequestHeader(key, config.headers[key])
        }
    }

    if (config.header && config.headerValue) {
        xhr.setRequestHeader(config.header, config.headerValue)
    }

    if (config.requestedWith) {
        xhr.setRequestHeader('X-Requested-With', config.requestedWith)
    }

    if (config.overrideMimeType) {
        xhr.overrideMimeType(config.overrideMimeType)
    }

    if (config.withCredentials) {
        xhr.withCredentials = true
    }

    // After a successful request, the xhr.response property will contain the requested data as a DOMString, ArrayBuffer, Blob, or Document (depending on what was set for responseType.)

    xhr.onprogress = file.onProgress.bind(file)

    if (config.retries > 0) {
        xhr.onload = function (event) {
            // check if load success
            var isLocalFile =
                xhr.responseURL &&
                (xhr.responseURL.indexOf('file://') === 0 ||
                    xhr.responseURL.indexOf('capacitor://') === 0)

            var localFileOk = isLocalFile && event.target.status === 0

            var success = !(event.target && event.target.status !== 200) || localFileOk

            //  Handle HTTP status codes of 4xx and 5xx as errors, even if xhr.onerror was not called.
            if (xhr.readyState === 4 && xhr.status >= 400 && xhr.status <= 599) {
                success = false
            }

            if (!success) {
                file.xhrSettings.retries = config.retries - 1
                file.xhrLoader = XHRLoader(file, globalXHRSettings)
            } else {
                file.onLoad.bind(file)(xhr, event)
            }
        }

        xhr.onerror = function () {
            file.xhrSettings.retries = config.retries - 1
            file.xhrLoader = XHRLoader(file, globalXHRSettings)
        }
    } else {
        xhr.onload = file.onLoad.bind(file, xhr)

        xhr.onerror = file.onError.bind(file, xhr)
    }

    //  This is the only standard method, the ones above are browser additions (maybe not universal?)
    // xhr.onreadystatechange

    xhr.send()

    return xhr
}

module.exports = XHRLoader
