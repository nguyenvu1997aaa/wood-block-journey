function initFbInstant() {
    let fbInstantLoadingCount = 1

    const waitSDK = setInterval(function () {
        if (!('FBInstant' in window)) return
        clearInterval(waitSDK)

        FBInstant.initializeAsync().then(function () {
            window.focus()

            const userId = FBInstant.player.getID()
            FBInstant.getEntryPointAsync()
                .then(function (entryPoint) {
                    initGoogleAnalytics(userId, entryPoint)
                })
                .catch(function () {
                    initGoogleAnalytics(userId, 'no_entry')
                })

            window.__fbInstantInitiated = true
            window.__fbInstantLoadingTimer = setInterval(function () {
                FBInstant.setLoadingProgress(fbInstantLoadingCount++)

                if (fbInstantLoadingCount >= 30) {
                    clearInterval(window.__fbInstantLoadingTimer)
                }
            }, 80)
        })
    }, 50)
}

function initGoogleAnalytics(userId, entryPoint) {
    const GAME_NAME = window.__GA_CONFIG.GAME_NAME,
        BUILD_VERSION = window.__GA_CONFIG.BUILD_VERSION,
        GA_MEASUREMENT_ID = window.__GA_CONFIG.GA_MEASUREMENT_ID

    if (GA_MEASUREMENT_ID == 'null') {
        window.__analyticsInitiated = true
        return
    }

    const _entryPointData = FBInstant.getEntryPointData() || {},
        adId = _entryPointData.fbig_ad_id,
        adSetId = _entryPointData.fbig_adset_id,
        campaignId = _entryPointData.fbig_campaign_id

    const gaScript = document.createElement('script')
    gaScript.async = true
    gaScript.src = 'https://www.googletagmanager.com/gtag/js?id=' + GA_MEASUREMENT_ID
    document.head.appendChild(gaScript)

    gtag('set', 'client_storage', 'none')
    gtag('set', 'client_id', `100.${userId}`)
    gtag('set', 'user_id', userId)
    gtag('set', 'send_page_view', false)

    gtag('js', new Date())

    // init google analytics GA4
    gtag('config', GA_MEASUREMENT_ID, {
        cookie_flags: 'SameSite=None;Secure',
        build: BUILD_VERSION,
        medium: entryPoint,
        campaign: campaignId,
        groups: 'GA',
    })

    gtag('set', 'user_properties', {
        user_id: userId,
        traffic_source: entryPoint,
        campaign_id: campaignId,
        adset_id: adSetId,
        ad_id: adId,
    })

    gtag('event', 'app_launch', {
        send_to: 'GA',
    })

    window.__analyticsInitiated = true
}

initFbInstant()
