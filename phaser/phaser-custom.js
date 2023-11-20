/* eslint-disable @typescript-eslint/no-var-requires */

/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2019 Photon Storm Ltd.
 * @license      {@link https://github.com/photonstorm/phaser/blob/master/license.txt|MIT License}
 */

require('polyfills')

var CONST = require('const')
var Extend = require('utils/object/Extend')

/**
 * @namespace Phaser
 */

var Phaser = {
    Actions: require('actions'),
    Animations: require('animations'),
    Cache: require('cache'),
    Cameras: require('cameras'),
    Core: require('core'),
    Game: require('core/Game'),
    // Create: require('create'),
    Curves: require('curves'),
    Data: require('data'),
    Device: require('device'),
    Display: require('display'),
    // DOM: require('dom'),
    Events: require('events'),
    GameObjects: {
        Events: require('gameobjects/events'),

        DisplayList: require('gameobjects/DisplayList'),
        GameObjectCreator: require('gameobjects/GameObjectCreator'),
        GameObjectFactory: require('gameobjects/GameObjectFactory'),
        UpdateList: require('gameobjects/UpdateList'),

        Components: require('gameobjects/components'),
        GetCalcMatrix: require('gameobjects/GetCalcMatrix'),

        BuildGameObject: require('gameobjects/BuildGameObject'),
        BuildGameObjectAnimation: require('gameobjects/BuildGameObjectAnimation'),
        GameObject: require('gameobjects/GameObject'),
        BitmapText: require('gameobjects/bitmaptext/static/BitmapText'),
        // Blitter: require('gameobjects/blitter/Blitter'),
        // Bob: require('gameobjects/blitter/Bob'),
        Container: require('gameobjects/container/Container'),
        // DOMElement: require('gameobjects/domelement/DOMElement'),
        // DynamicBitmapText: require('gameobjects/bitmaptext/dynamic/DynamicBitmapText'),
        Extern: require('gameobjects/extern/Extern.js'),
        Graphics: require('gameobjects/graphics/Graphics.js'),
        Group: require('gameobjects/group/Group'),
        Image: require('gameobjects/image/Image'),
        // Layer: require('gameobjects/layer/Layer'),
        Particles: require('gameobjects/particles'),
        PathFollower: require('gameobjects/pathfollower/PathFollower'),
        // RenderTexture: require('gameobjects/rendertexture/RenderTexture'),
        // RetroFont: require('gameobjects/bitmaptext/RetroFont'),
        Rope: require('gameobjects/rope/Rope'),
        Sprite: require('gameobjects/sprite/Sprite'),

        Text: require('gameobjects/text/Text'),
        GetTextSize: require('gameobjects/text/GetTextSize'),
        MeasureText: require('gameobjects/text/MeasureText'),
        TextStyle: require('gameobjects/text/TextStyle'),

        // TileSprite: require('gameobjects/tilesprite/TileSprite'),
        Zone: require('gameobjects/zone/Zone'),
        // Video: require('gameobjects/video/Video'),

        //  Shapes

        // Shape: require('gameobjects/shape/Shape'),
        // Arc: require('gameobjects/shape/arc/Arc'),
        Curve: require('gameobjects/shape/curve/Curve'),
        // Ellipse: require('gameobjects/shape/ellipse/Ellipse'),
        Grid: require('gameobjects/shape/grid/Grid'),
        // IsoBox: require('gameobjects/shape/isobox/IsoBox'),
        // IsoTriangle: require('gameobjects/shape/isotriangle/IsoTriangle'),
        Line: require('gameobjects/shape/line/Line'),
        // Polygon: require('gameobjects/shape/polygon/Polygon'),
        Rectangle: require('gameobjects/shape/rectangle/Rectangle'),
        // Star: require('gameobjects/shape/star/Star'),
        // Triangle: require('gameobjects/shape/triangle/Triangle'),

        //  Game Object Factories

        Factories: {
            // Blitter: require('gameobjects/blitter/BlitterFactory'),
            Container: require('gameobjects/container/ContainerFactory'),
            // DOMElement: require('gameobjects/domelement/DOMElementFactory'),
            // DynamicBitmapText: require('gameobjects/bitmaptext/dynamic/DynamicBitmapTextFactory'),
            Extern: require('gameobjects/extern/ExternFactory'),
            Graphics: require('gameobjects/graphics/GraphicsFactory'),
            Group: require('gameobjects/group/GroupFactory'),
            Image: require('gameobjects/image/ImageFactory'),
            // Layer: require('gameobjects/layer/LayerFactory'),
            Particles: require('gameobjects/particles/ParticleManagerFactory'),
            // PathFollower: require('gameobjects/pathfollower/PathFollowerFactory'),
            RenderTexture: require('gameobjects/rendertexture/RenderTextureFactory'),
            Rope: require('gameobjects/rope/RopeFactory'),
            Sprite: require('gameobjects/sprite/SpriteFactory'),
            StaticBitmapText: require('gameobjects/bitmaptext/static/BitmapTextFactory'),
            Text: require('gameobjects/text/TextFactory'),
            // TileSprite: require('gameobjects/tilesprite/TileSpriteFactory'),
            Zone: require('gameobjects/zone/ZoneFactory'),
            // Video: require('gameobjects/video/VideoFactory'),

            //  Shapes
            // Arc: require('gameobjects/shape/arc/ArcFactory'),
            Curve: require('gameobjects/shape/curve/CurveFactory'),
            // Ellipse: require('gameobjects/shape/ellipse/EllipseFactory'),
            Grid: require('gameobjects/shape/grid/GridFactory'),
            // IsoBox: require('gameobjects/shape/isobox/IsoBoxFactory'),
            // IsoTriangle: require('gameobjects/shape/isotriangle/IsoTriangleFactory'),
            Line: require('gameobjects/shape/line/LineFactory'),
            // Polygon: require('gameobjects/shape/polygon/PolygonFactory'),
            Rectangle: require('gameobjects/shape/rectangle/RectangleFactory'),
            // Star: require('gameobjects/shape/star/StarFactory'),
            // Triangle: require('gameobjects/shape/triangle/TriangleFactory'),
        },

        Creators: {
            // Blitter: require('gameobjects/blitter/BlitterCreator'),
            Container: require('gameobjects/container/ContainerCreator'),
            // DynamicBitmapText: require('gameobjects/bitmaptext/dynamic/DynamicBitmapTextCreator'),
            Graphics: require('gameobjects/graphics/GraphicsCreator'),
            Group: require('gameobjects/group/GroupCreator'),
            Image: require('gameobjects/image/ImageCreator'),
            // Layer: require('gameobjects/layer/LayerCreator'),
            Particles: require('gameobjects/particles/ParticleManagerCreator'),
            RenderTexture: require('gameobjects/rendertexture/RenderTextureCreator'),
            Rope: require('gameobjects/rope/RopeCreator'),
            Sprite: require('gameobjects/sprite/SpriteCreator'),
            StaticBitmapText: require('gameobjects/bitmaptext/static/BitmapTextCreator'),
            Text: require('gameobjects/text/TextCreator'),
            // TileSprite: require('gameobjects/tilesprite/TileSpriteCreator'),
            Zone: require('gameobjects/zone/ZoneCreator'),
            // Video: require('gameobjects/video/VideoCreator'),
        },
    },
    Geom: {
        Circle: require('geom/circle'),
        // Ellipse: require('geom/ellipse'),
        Intersects: require('geom/intersects'),
        Line: require('geom/line'),
        // Mesh: require('geom/mesh'),
        // Point: require('geom/point'),
        // Polygon: require('geom/polygon'),
        Rectangle: require('geom/rectangle'),
        // Triangle: require('geom/triangle'),
    },
    Input: {
        CreatePixelPerfectHandler: require('input/CreatePixelPerfectHandler'),
        CreateInteractiveObject: require('input/CreateInteractiveObject'),
        Events: require('input/events'),
        // Gamepad: require('input/gamepad'),
        InputManager: require('input/InputManager'),
        InputPlugin: require('input/InputPlugin'),
        InputPluginCache: require('input/InputPluginCache'),
        Keyboard: require('input/keyboard'),
        Mouse: require('input/mouse'),
        Pointer: require('input/Pointer'),
        Touch: require('input/touch'),
    },
    Loader: {
        Events: require('loader/events'),
        File: require('loader/File'),
        FileTypesManager: require('loader/FileTypesManager'),
        GetURL: require('loader/GetURL'),
        LoaderPlugin: require('loader/LoaderPlugin'),
        // MergeXHRSettings: require('loader/MergeXHRSettings'),
        // MultiFile: require('loader/MultiFile'),
        // XHRLoader: require('loader/XHRLoader'),
        // XHRSettings: require('loader/XHRSettings'),

        FileTypes: {
            // AnimationJSONFile: require('loader/filetypes/AnimationJSONFile'),
            // AsepriteFile: require('loader/filetypes/AsepriteFile'),
            AtlasJSONFile: require('loader/filetypes/AtlasJSONFile'),
            // AtlasXMLFile: require('loader/filetypes/AtlasXMLFile'),
            // AudioFile: require('loader/filetypes/AudioFile'),
            AudioSpriteFile: require('loader/filetypes/AudioSpriteFile'),
            // BinaryFile: require('loader/filetypes/BinaryFile'),
            BitmapFontFile: require('loader/filetypes/BitmapFontFile'),
            // CSSFile: require('loader/filetypes/CSSFile'),
            // GLSLFile: require('loader/filetypes/GLSLFile'),
            // HTML5AudioFile: require('loader/filetypes/HTML5AudioFile'),
            // HTMLFile: require('loader/filetypes/HTMLFile'),
            // HTMLTextureFile: require('loader/filetypes/HTMLTextureFile'),
            ImageFile: require('loader/filetypes/ImageFile'),
            JSONFile: require('loader/filetypes/JSONFile'),
            MultiAtlasFile: require('loader/filetypes/MultiAtlasFile'),
            // MultiScriptFile: require('loader/filetypes/MultiScriptFile'),
            // OBJFile: require('loader/filetypes/OBJFile'),
            // PackFile: require('loader/filetypes/PackFile'),
            // PluginFile: require('loader/filetypes/PluginFile'),
            // SceneFile: require('loader/filetypes/SceneFile'),
            // ScenePluginFile: require('loader/filetypes/ScenePluginFile'),
            // ScriptFile: require('loader/filetypes/ScriptFile'),
            SpriteSheetFile: require('loader/filetypes/SpriteSheetFile'),
            SVGFile: require('loader/filetypes/SVGFile'),
            TextFile: require('loader/filetypes/TextFile'),
            // TilemapCSVFile: require('loader/filetypes/TilemapCSVFile'),
            // TilemapImpactFile: require('loader/filetypes/TilemapImpactFile'),
            TilemapJSONFile: require('loader/filetypes/TilemapJSONFile'),
            // UnityAtlasFile: require('loader/filetypes/UnityAtlasFile'),
            // VideoFile: require('loader/filetypes/VideoFile'),
            XMLFile: require('loader/filetypes/XMLFile'),
        },
    },
    Math: require('math'),
    // Physics: {
    // Arcade: require('physics/arcade'),
    // Matter: require('physics/matter-js'),
    // },
    Plugins: require('plugins'),
    Renderer: {
        // Canvas: require('renderer/canvas'),
        Events: require('renderer/events'),
        // Snapshot: require('renderer/snapshot'),
        WebGL: {
            // PipelineManager: require('renderer/webgl/PipelineManager'),
            // Pipelines: require('renderer/webgl/pipelines'),
            // RenderTarget: require('renderer/webgl/RenderTarget'),
            // Utils: require('renderer/webgl/Utils'),
            // WebGLPipeline: require('renderer/webgl/WebGLPipeline'),
            WebGLRenderer: require('renderer/webgl/WebGLRenderer'),
            // WebGLShader: require('renderer/webgl/WebGLShader'),
        },
    },
    // Scale: require('scale'),
    Scenes: require('scene'),
    Scene: require('scene/Scene'),
    Sound: {
        // SoundManagerCreator: require('sound/SoundManagerCreator'),

        Events: require('sound/events'),

        BaseSound: require('sound/BaseSound'),
        BaseSoundManager: require('sound/BaseSoundManager'),

        WebAudioSound: require('sound/webaudio/WebAudioSound'),
        WebAudioSoundManager: require('sound/webaudio/WebAudioSoundManager'),

        // HTML5AudioSound: require('sound/html5/HTML5AudioSound'),
        // HTML5AudioSoundManager: require('sound/html5/HTML5AudioSoundManager'),

        // NoAudioSound: require('sound/noaudio/NoAudioSound'),
        // NoAudioSoundManager: require('sound/noaudio/NoAudioSoundManager')
    },
    // Structs: require('structs'),
    Textures: {
        // CanvasTexture: require('textures/CanvasTexture'),
        Events: require('textures/events'),
        // FilterMode: require('textures/const'),
        // Frame: require('textures/Frame'),
        // Parsers: require('textures/parsers'),
        Texture: require('textures/Texture'),
        TextureManager: require('textures/TextureManager'),
        // TextureSource: require('textures/TextureSource'),
    },
    Tilemaps: require('tilemaps'),
    Time: require('time'),
    Tweens: {
        // Builders: require('tweens/builders'),
        Events: require('tweens/events'),

        TweenManager: require('tweens/TweenManager'),
        Tween: require('tweens/tween/Tween'),
        // TweenData: require('tweens/tween/TweenData'),
        // Timeline: require('tweens/Timeline')
    },
    Utils: require('utils'),
    // Class: require('utils/Class'),
}

//   Merge in the consts

Phaser = Extend(false, Phaser, CONST)

//  Export it

module.exports = Phaser

global.Phaser = Phaser
window.Phaser = Phaser

/*
 * "Documentation is like pizza: when it is good, it is very, very good;
 * and when it is bad, it is better than nothing."
 *  -- Dick Brandon
 */
