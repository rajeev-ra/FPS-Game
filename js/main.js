//define('THREE', ['js/three.min'], function ( THREE ) { window.THREE = THREE; return THREE; });

requirejs.config({
    baseUrl: '.',
    paths: {
            "Control" : "js/control",
            "Player": "js/player",
            "Bullet": "js/bullet",
            "PlayGround" : "js/playground",
            "ResetControl": "js/resetcontrol",
            "Target": "js/target",
            "CollisionMgr":"js/collisionmgr"
        }
});

var fontLoader = new Promise(function(resolve, reject){
    var loader = new THREE.FontLoader();
    loader.load( 'font/droid_serif_regular.typeface.json', function ( font ) {
        window.font = font;
        window.time_geoms = [];
        window.power_geoms = [];
        for(var i = 0; i < 61; i++){
            time_geoms.push(new THREE.TextGeometry(i.toString(),{font: window.font, size: 6, height:0.5, bevelEnabled:true, bevelSize: 0.5, bevelThickness: 1}));
            time_geoms[i].computeBoundingBox();
        }
        for(var i = 0; i < 101; i++){
            var pg = new THREE.BoxGeometry((i+0.1)/5, 1, 0.1);
            for(var j = 0; j < pg.vertices.length; j++){
                pg.vertices[j].x -= 10 - i / 10;
            }
            power_geoms.push(pg);
        }
        var loader = document.getElementById("loader");
        loader.parentNode.removeChild(loader);
        
        var blocker = document.getElementById('blocker');
        blocker.style.display = '-webkit-box';
        blocker.style.display = '-moz-box';
        blocker.style.display = 'box';

        resolve();
    });
});

fontLoader.then(function(){    
    require(["Control", "PlayGround", "Player", "Bullet", "ResetControl", "Target", "CollisionMgr"],
        function(Control, PlayGround, Player, Bullet, ResetControl, Target, CollisionMgr){        
            // Create scene, camera and renderer
            var scene = new THREE.Scene();
            var camera = new THREE.PerspectiveCamera( 45, window.innerWidth / window.innerHeight, 1, 6000 ); 
            var renderer = new THREE.WebGLRenderer({antialias:true});
            document.body.appendChild(renderer.domElement);
            renderer.setSize(window.innerWidth, window.innerHeight);

            // Create game objects
            var control = new Control( scene, camera );
            var playground = new PlayGround(scene);
            player = new Player(scene, camera, control);
            
            function addTarget(type){
                var pos = CollisionMgr.getNonCollidingPos(control.getObject().position);
                new Target(scene, control, pos, type);
            }

            var vTime = 0;
            function time(){
                if(control.enabled){
                    vTime += 1;
                }
                if(vTime === 1){
                    vTime = 2;
                    addTarget("default");
                }
                else if (vTime === 10){
                    vTime = 11;
                    addTarget("basic");
                }
                else if (vTime === 20){
                    vTime = 21;
                    addTarget("danger");
                }
                else if (vTime === 30){
                    vTime = 31;
                    addTarget("power");
                }
                else if (vTime === 40){
                    vTime = 0;
                    addTarget("safe");
                }
                setTimeout(time, 1000);
            }

            time();
            // Set reset for play / pause behavoiur 
            ResetControl(control);

            // Start render loop
            function render() {
                control.update();
                requestAnimationFrame( render );
                renderer.render( scene, camera );
            }
            render();
            

            // Set window resize callback
            function resize(){
                camera.aspect = window.innerWidth / window.innerHeight;
                camera.updateProjectionMatrix();    
                renderer.setSize( window.innerWidth, window.innerHeight );
            }
            window.addEventListener('resize',resize,false);  
        }
    );
});