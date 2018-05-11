define(["Control", "Player", "Bullet"], function(Control, Player, Bullet){
    var PlayGround = function(){
        var scene = new THREE.Scene();
        var renderer = new THREE.WebGLRenderer({antialias:true});
        this.camera = new THREE.PerspectiveCamera( 45, width / height, 1, 6000 ); 
        var width = window.innerWidth;
        var height = window.innerHeight;
        var bullets = [];
        this.control = null;

        var camera = this.camera;
        this.init = function(){
            var _this = this;
            window.addEventListener('resize',this.resize,false);
            //document.addEventListener('mousedown', onMouseDown, false );        
            
            document.body.appendChild(renderer.domElement);
            renderer.setSize(width, height);
            
            var light = new THREE.HemisphereLight( 0xeeeeff, 0x777788, 0.75 );
            light.position.set( 0.5, 1, 0.75 );
            scene.add( light );
                
            this.camera.updateProjectionMatrix();
            scene.add( this.camera );
            /*            
            draw_view_finder();
            draw_gun();
            draw_play_area();*/

            this.control = new Control( this.camera );
            scene.add( this.control.getObject() );
            
            
            function render() {
                _this.control.update();
                for (var index = 0; index < bullets.length; index++) {
                    bullets[index].update();
                }
                requestAnimationFrame( render );
                renderer.render( scene, _this.camera );
            }

            var texture_placeholder = document.createElement( 'canvas' );
            texture_placeholder.width = 128;
            texture_placeholder.height = 128;

            function draw_enviornment(){
                function loadTexture( path ) {
                    var texture = new THREE.Texture( texture_placeholder );
                    var material = new THREE.MeshBasicMaterial( { map: texture, overdraw: 0.5, side: THREE.DoubleSide } );
                    var image = new Image();
                    image.onload = function () {
                        texture.image = this;
                        texture.needsUpdate = true;
                    };
                    image.crossOrigin="anonymous";
                    image.src = path;
                    return material;
                }

                var materialArray = [
                    loadTexture( 'texture/xpos.png' ), // right
                    loadTexture( 'texture/xneg.png' ), // left
                    loadTexture( 'texture/ypos.png' ), // top
                    loadTexture( 'texture/yneg.png' ), // bottom
                    loadTexture( 'texture/zpos.png' ), // back
                    loadTexture( 'texture/zneg.png' )  // front
                ];
                
                var mesh = new THREE.Mesh( new THREE.BoxGeometry( 5000, 5000, 5000), new THREE.MultiMaterial( materialArray ) );
                mesh.scale.x = - 1;
                scene.add( mesh );
            }

            function draw_play_area() {
                var side_length = 1000;
                var wall_height = 100;
                var floorTexture = new THREE.Texture( texture_placeholder );
                floorTexture.wrapS = floorTexture.wrapT = THREE.RepeatWrapping; 
                floorTexture.repeat.set( 50, 50 );
                    
                var grassImg = new Image()
                grassImg.onload = function(){
                    floorTexture.image = this;
                    floorTexture.needsUpdate = true;
                };
                grassImg.crossOrigin="anonymous";
                grassImg.src = 'texture/grass.png';
                
                var floorgeometry = new THREE.PlaneGeometry( side_length, side_length, 50,50);
                var floormaterial = new THREE.MeshBasicMaterial( {map: floorTexture, side: THREE.DoubleSide} );
                var floor = new THREE.Mesh( floorgeometry, floormaterial );
                floor.position.y = -10;
                floor.rotation.x = Math.PI / 2;
                scene.add( floor );
                
                var wallTexture = new THREE.Texture( texture_placeholder );
                wallTexture.wrapS = wallTexture.wrapT = THREE.RepeatWrapping; 
                wallTexture.repeat.set( 20, 2 );
                    
                var brickImg = new Image()
                brickImg.onload = function(){
                    wallTexture.image = this;
                    wallTexture.needsUpdate = true;
                };
                brickImg.crossOrigin="anonymous";
                brickImg.src = 'texture/brick2.png';
                
                var wallgeometry = new THREE.PlaneGeometry( side_length, wall_height, 20,2);
                var wallmaterial = new THREE.MeshBasicMaterial( {map: wallTexture, side: THREE.DoubleSide} );
                var wall = new THREE.Mesh( wallgeometry, wallmaterial );
                wall.position.z = -side_length / 2;
                wall.position.y = wall_height / 2 - 10;
                scene.add( wall );
                
                wall = new THREE.Mesh( wallgeometry, wallmaterial );
                wall.position.z = side_length / 2;
                wall.position.y = wall_height / 2 - 10;
                scene.add( wall );
                
                wall = new THREE.Mesh( wallgeometry, wallmaterial );
                wall.position.x = -side_length / 2;
                wall.position.y = wall_height / 2 - 10;
                wall.rotation.y = Math.PI / 2;
                scene.add( wall );
                
                wall = new THREE.Mesh( wallgeometry, wallmaterial );
                wall.position.x = side_length / 2;
                wall.position.y = wall_height / 2 - 10;
                wall.rotation.y = Math.PI / 2;
                scene.add( wall );
            }

            draw_enviornment();
            draw_play_area();
            this.resize();
            render();
        };

        this.AddBullet = function(){
            var dir = this.control.getDirection();
            var pos = this.control.getObject().position;
            pos.y -= 1;

            bullets.push(new Bullet(pos,dir,scene));
        };

        this.resize = function (){
            camera.aspect = window.innerWidth / window.innerHeight;
            camera.updateProjectionMatrix();
        
            renderer.setSize( window.innerWidth, window.innerHeight );
        };
    };

    return PlayGround;
});