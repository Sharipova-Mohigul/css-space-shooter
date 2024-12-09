/**
 * ALien class.
 *
 * @param el
 * @param x
 * @param y
 * @param config
 * @constructor
 */
function Alien(el, x, y, config) {
    var self = this;
    var zSpeed = 1000; // how fast it advances towards the player
    var range = -15000;
    self.el = el;
    self.el.classList.add(config.colorClass);
    self.x = x;
    self.y = y;
    self.z = range;
    self.actualX = x; // actual values include modifications made by the motion function, and should be
    self.actualY = y; // used by external methods to query the actual position of the alien.
    self.lastTimestamp = null;
    self.motionFunction = config.motionFunction;
    self.hit = false; // has the alien been hit by a shot?
    self.destroyed = false; // has it exploded from being hit?

    /**
     * The shipX and shipY is the position of the ship, which affects how the shots will be offset
     * @param shipX
     * @param shipY
     * @param timestamp
     * @returns {boolean}
     */
    self.updatePosition = function(shipX, shipY, timestamp) {
        var actualPosition = applyMotionFunction();
        var offsetX = self.x - shipX;
        var offsetY = self.y - shipY;
        var opacity =  Math.min(1 - self.z / range / 2, 1);

        self.actualX = actualPosition.x;
        self.actualY = actualPosition.y;

        if (self.lastTimestamp === null ||
            100 < timestamp - self.lastTimestamp) {
            self.lastTimestamp = timestamp;
        }
        self.z += (timestamp - self.lastTimestamp) / 1000 * zSpeed;
        self.lastTimestamp = timestamp;

        self.el.style.transform =
            'translateY(' + (actualPosition.y + offsetY) + 'px) ' +
            'translateX(' + (actualPosition.x + offsetX) + 'px) ' +
            'translateZ(' + self.z + 'px) ';
        self.el.style.opacity = opacity;
        self.el.style.display = 'block';

        if (self.hit) {
            destroy();
        }

        if (500 < self.z && self.hit === false) {
            emitMissEvent();
        }

        return 500 < self.z || self.destroyed;
    };

    function applyMotionFunction() {
        return self.motionFunction.call(self);
    }

    function destroy() {
        self.el.classList.add('hit');
        setTimeout(function() {
            self.destroyed = true;
        }, 1200);
    }

    function emitMissEvent() {
        var event = new CustomEvent('miss', { 'detail': -500 });
        document.dispatchEvent(event);
    }
}


var alienFactory = (function() {
    var alienElement;
    var aliens = [];
    var viewportWidth = document.documentElement.clientWidth;
    var viewportHeight = document.documentElement.clientHeight;

    return {

        setTemplate: function(el) {
            alienElement = el.cloneNode(true);
        },

        spawn: function(event) {
            if (event.type && event.type === 'spawn') {
                event.data.forEach(function (alienDefinition) {

                    var newElement = alienElement.cloneNode(true);
                    var spawnX = viewportWidth * (Math.random() - 0.5) * 0.7;
                    var spawnY = viewportHeight * (Math.random() - 0.5) * 0.5;
                    var sceneDiv = document.querySelector('.scene');
                    var config = getAlienConfig(alienDefinition);

                    sceneDiv.insertBefore(newElement, sceneDiv.children[0]);
                    aliens.push(new Alien(newElement, spawnX, spawnY, config));
                });
            }
        },

        updatePositions: function(ship, timestamp) {
            var el, remove, i, aliensToRemove = [];

            for(i = 0; i < aliens.length; i++) {
                remove = aliens[i].updatePosition(ship.x, ship.y, timestamp);
                if (remove) {
                    aliensToRemove.push(i);
                }
            }
