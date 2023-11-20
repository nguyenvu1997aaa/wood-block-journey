# PHASER 3 DEBUGGER

## Statistics

### Config:

In files src\configs\config.development.custom.ts:

```typescript
    // src\configs\config.development.custom.ts
    Statistics: {
        Enable: true,
        DisplayMode: 0, // 0 or 1
        FPS: true,
        MS: false,
        MB: true,
        Opacity: 0.8,
    },
```

-   Enable: Active or inactive statistics
-   Display mode: 0 or 1, 0 is show 1 stats at a time. 1 is show all.
-   FPS Frames rendered in the last second. The higher the number the better.
-   MS Milliseconds needed to render a frame. The lower the number the better.
-   MB MBytes of allocated memory. (Run Chrome with --enable-precise-memory-info)
-   CUSTOM User-defined panel support.
-   Opacity: css style for opacity

## Debugger:

### Config:

In files src\configs\config.development.custom.ts:

```typescript
    // src\configs\config.development.custom.ts
    Debugger: {
        Enable: true,
        ShowInspector: true,
        ShowMonitoring: true,
        ShowConsole: true,
        Expanded: true,
        InspectorAutoUpdate: true,
        Opacity: 0.8,
    },
```

-   Enable: Active or inactive debugger
-   ShowInspector: showInspector (only show on browser)
-   ShowMonitoring: show SpectorJs capture to debug renderer (draw calls count, ...)
-   ShowConsole: show console on mobile
-   Expanded: auto expanded on browser, mobile never expanded
-   InspectorAutoUpdate: auto create new folder for new object
-   Opacity: css style for opacity

### Documents Inspectors:

Every things key shortcut must press shift key on key board

-   Shift + F, Shift + PointerLeft: Focus object
-   Shift + PointerRight: Move camera
-   Shift + Mouse Scroll: Zoom camera
-   Shift + S: Reset camera
-   Shift + A: Camera follow focused object
-   Shift + V: visble toggle focused object
-   Shift + D: go to detail focused object

Pointer mode (use function with Shift + PointerLeft):

-   Shift + Q: pointer move focused object
-   Shift + W: pointer scale focused object
-   Shift + E: pointer rotate focused object
-   Shift + R: default pointer (no effect)

### Documents for Monitoring:

Enable ShowMonitoring, then in tab default in debug will have button "Start Capture" for debug renderer
