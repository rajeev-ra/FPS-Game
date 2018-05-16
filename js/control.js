define(function(require){
    var Control = function ( scene, camera ) {
        // local variables
        var scope = this;
        var zoom = false;
        var controlsEnabled = false;
        var prevTime = performance.now();
        var velocity = new THREE.Vector3();
        var pitchObject = new THREE.Object3D();
        var yawObject = new THREE.Object3D();
        var PI_2 = Math.PI / 2;

        var moveForward = false;
        var moveBackward = false;
        var moveLeft = false;
        var moveRight = false;
        var canJump = false;
        var down = false;

        // public variables
        this.enabled = false;

        camera.rotation.set( 0, 0, 0 );    
        pitchObject.add( camera );    
        yawObject.position.y = 10;
        yawObject.add( pitchObject );
        scene.add(yawObject);

        
        document.addEventListener( 'resetgame', function(){
            zoom = false;
            prevTime = performance.now();
            velocity.set(0,0,0);
            pitchObject.rotation.set(0,0,0);
            yawObject.position.set(0,10,0);
            yawObject.rotation.set(0,0,0);

            moveForward = false;
            moveBackward = false;
            moveLeft = false;
            moveRight = false;
            canJump = false;
            down = false;
        }, false );


        // public methods
        this.onMouseMove = function ( event ) {
            if ( scope.enabled === false ) return;
    
            var movementX = event.movementX || event.mozMovementX || event.webkitMovementX || 0;
            var movementY = event.movementY || event.mozMovementY || event.webkitMovementY || 0;
    
            if(zoom === false){
                yawObject.rotation.y -= movementX * 0.004;
                pitchObject.rotation.x -= movementY * 0.004;
            }else{
                yawObject.rotation.y -= movementX * 0.001;
                pitchObject.rotation.x -= movementY * 0.001;        
            }
    
            pitchObject.rotation.x = Math.max( - PI_2, Math.min( PI_2, pitchObject.rotation.x ) );
        };    
    
        this.getObject = function () {
            return yawObject;
        };
    
        this.getDirection = function() {
            // assumes the camera itself is not rotated
            var direction = new THREE.Vector3( 0, 0, - 1 );
            var rotation = new THREE.Euler( 0, 0, 0, "YXZ" );
            
            var v = new THREE.Vector3( 0, 0, - 1 );
            rotation.set( pitchObject.rotation.x, yawObject.rotation.y, 0 );
            v.copy( direction ).applyEuler( rotation );
            return v;
        };

        this.update = function(){
            if ( this.enabled ) {
                var time = performance.now();
                var delta = ( time - prevTime ) / 1000;

                velocity.x -= velocity.x * 10.0 * delta;
                velocity.z -= velocity.z * 10.0 * delta;
        
                velocity.y -= 9.8 * 100.0 * delta; // 100.0 = mass

                if ( moveForward ) velocity.z -= 600.0 * delta;
                if ( moveBackward ) velocity.z += 600.0 * delta;

                if ( moveLeft ) velocity.x -= 600.0 * delta;
                if ( moveRight ) velocity.x += 600.0 * delta;

                yawObject.translateX( velocity.x * delta );
                yawObject.translateY( velocity.y * delta );
                yawObject.translateZ( velocity.z * delta );

                if( yawObject.position.x > 490 ){
                    yawObject.position.x = 490;
                }
                if( yawObject.position.x < -490 ){
                    yawObject.position.x = -490;
                }
                if( yawObject.position.z > 490 ){
                    yawObject.position.z = 490;
                }
                if( yawObject.position.z < -490 ){
                    yawObject.position.z = -490;
                }
                
                if ( yawObject.position.y < 10) {
                    velocity.y = 0;
                    yawObject.position.y = 10;
                    canJump = true;
                }   
                
                if(down && canJump){
                    velocity.y = 0;
                    yawObject.position.y = 0;
                }
                
                prevTime = time;
            }
        };
    
           
        this. onKeyDown = function( event ) {
            if(this.enabled === false){
                return;
            }

            switch ( event.keyCode ) {

                case 38: // up
                case 87: // w
                    moveForward = true;
                    break;

                case 37: // left
                case 65: // a
                    moveLeft = true; break;

                case 40: // down
                case 83: // s
                    moveBackward = true;
                    break;

                case 39: // right
                case 68: // d
                    moveRight = true;
                    break;

                case 32: // space
                    if ( canJump === true ) velocity.y += 300;
                    canJump = false;
                    break;
                    
                case 16:
                    down = true;
                    break;

            }

        };

        this.onKeyUp = function( event ) {

            switch( event.keyCode ) {

                case 38: // up
                case 87: // w
                    moveForward = false;
                    break;

                case 37: // left
                case 65: // a
                    moveLeft = false;
                    break;

                case 40: // down
                case 83: // s
                    moveBackward = false;
                    break;

                case 39: // right
                case 68: // d
                    moveRight = false;
                    break;
                    
                case 16:
                    down = false;
                    break;

            }

        };


        this.onMouseDown = function(e){
            if(this.enabled === false){
                return;
            }
            if(e.button === 2){	
                if(zoom === true){
                    zoom = false;
                    camera.fov = 45;
                }else{
                    zoom = true;
                    camera.fov = 10;
                }   
                camera.updateProjectionMatrix();
            }
        };

        this.dispose = function() {
            document.removeEventListener( 'mousemove', this.onMouseMove, false );
            document.removeEventListener( 'keydown', this.onKeyDown, false );
            document.removeEventListener( 'keyup', this.onKeyUp, false );
        };
    
        // register event listener
        document.addEventListener( 'mousemove', this.onMouseMove, false );
        document.addEventListener( 'keydown', this.onKeyDown, false );
        document.addEventListener( 'keyup', this.onKeyUp, false );
        document.addEventListener( 'mousedown', this.onMouseDown, false );
    };

    return Control;
});