var Rectangle = PIXI.Rectangle;
var TextureCache = PIXI.utils.TextureCache;
let type = "WebGL";
if (!PIXI.utils.isWebGLSupported()) {
    type = "canvas";
}
PIXI.utils.sayHello(type);
let Application = PIXI.Application, loader = PIXI.loader, resources = PIXI.loader.resources, Sprite = PIXI.Sprite;
let rectangle = PIXI.Rectangle;
let app = new PIXI.Application({
    antialias: true,
    transparent: false,
    resolution: 1
});
app.renderer.view.style.position = "absolute";
app.renderer.view.style.display = "block";
app.renderer.autoResize = true;
app.renderer.resize(window.innerWidth, window.innerHeight);
app.renderer.backgroundColor = 0x87CEEB;
document.body.appendChild(app.view);
loader
    .add("./../style/knight iso char_idle_2.png")
    .add("./../style/foodies.png")
    .load(setup);
//This `setup` function will run when the image has loaded
let knight, state;
function setup() {
    //Keyboard functions
    function keyboard(keyCode) {
        let key = {};
        key.code = keyCode;
        key.isDown = false;
        key.isUp = true;
        key.press = undefined;
        key.release = undefined;
        //The `downHandler`
        key.downHandler = event => {
            if (event.keyCode === key.code) {
                if (key.isUp && key.press)
                    key.press();
                key.isDown = true;
                key.isUp = false;
            }
            event.preventDefault();
        };
        key.upHandler = event => {
            if (event.keyCode === key.code) {
                if (key.isDown && key.release)
                    key.release();
                key.isDown = false;
                key.isUp = true;
            }
            event.preventDefault();
        };
        //Attach event listeners
        window.addEventListener("keydown", key.downHandler.bind(key), false);
        window.addEventListener("keyup", key.upHandler.bind(key), false);
        return key;
    }
    //Create the knight sprite
    knight = new Sprite(resources["./../style/knight iso char_idle_2.png"].texture);
    knight.x = 1200;
    knight.y = 950;
    knight.vx = 0;
    knight.vy = 0;
    knight.height = 215;
    knight.width = 170;
    app.stage.addChild(knight);
    //Create Food Mix
    let texture = TextureCache["./../style/foodies.png"];
    let rectangle = new Rectangle(112, 112, 16, 16);
    texture.frame = rectangle;
    let foodMix = new Sprite(texture);
    foodMix.x = 900;
    foodMix.y = 0;
    foodMix.scale.set(3, 3);
    app.stage.addChild(foodMix);
    let left = keyboard(37), right = keyboard(39);
    left.press = () => {
        knight.vx = -15;
        knight.vy = 0;
    };
    left.release = () => {
        if (!right.isDown && knight.vy === 0) {
            knight.vx = 0;
        }
    };
    right.press = () => {
        knight.vx = 15;
        knight.vy = 0;
    };
    right.release = () => {
        if (!left.isDown && knight.vy === 0) {
            knight.vx = 0;
        }
    };
    state = play;
    app.ticker.add(delta => gameLoop());
    function gameLoop() {
        state();
    }
    function play() {
        knight.x += knight.vx;
    }
}
