//define('THREE', ['js/three.min'], function ( THREE ) { window.THREE = THREE; return THREE; });

requirejs.config({
    baseUrl: '.',
    paths: {
            "Control" : "js/control",
            "Player": "js/player",
            "Bullet": "js/bullet",
            "PlayGround" : "js/playground",
            "ResetControl": "js/resetcontrol"
        }
});

require(["Control", "PlayGround", "Player", "ResetControl"], function(Control, PlayGround, Player, ResetControl){
    var playground = new PlayGround();
    var player = new Player(playground);
    playground.init();
    ResetControl(playground.control);
});