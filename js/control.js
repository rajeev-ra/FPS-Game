var controlsEnabled = false;

var moveForward = false;
var moveBackward = false;
var moveLeft = false;
var moveRight = false;
var canJump = false;
var down = false;

var prevTime = performance.now();
var velocity = new THREE.Vector3();

var controls;
var zoom = false;


function init_control(scene, camera){    
    document.addEventListener( 'keydown', onKeyDown, false );
    document.addEventListener( 'keyup', onKeyUp, false );
	document.addEventListener('mousedown', onDocumentMouseDown, false );
    
    controls = new THREE.PointerLockControls( camera );
    scene.add( controls.getObject() );
    
    var blocker = document.getElementById( 'blocker' );
    var instructions = document.getElementById( 'instructions' );
    var havePointerLock = 'pointerLockElement' in document || 'mozPointerLockElement' in document || 'webkitPointerLockElement' in document;

    if ( havePointerLock ) {

        var element = document.body;

        var pointerlockchange = function ( event ) {

            if ( document.pointerLockElement === element || document.mozPointerLockElement === element || document.webkitPointerLockElement === element ) {

                controlsEnabled = true;
                controls.enabled = true;

                blocker.style.display = 'none';

            } else {

                controls.enabled = false;

                blocker.style.display = '-webkit-box';
                blocker.style.display = '-moz-box';
                blocker.style.display = 'box';

                instructions.style.display = '';

            }

        };

        var pointerlockerror = function ( event ) {

            instructions.style.display = '';

        };

        // Hook pointer lock state change events
        document.addEventListener( 'pointerlockchange', pointerlockchange, false );
        document.addEventListener( 'mozpointerlockchange', pointerlockchange, false );
        document.addEventListener( 'webkitpointerlockchange', pointerlockchange, false );

        document.addEventListener( 'pointerlockerror', pointerlockerror, false );
        document.addEventListener( 'mozpointerlockerror', pointerlockerror, false );
        document.addEventListener( 'webkitpointerlockerror', pointerlockerror, false );

        instructions.addEventListener( 'click', onClick, false );
        
        function onClick( event ) {
            instructions.style.display = 'none';

            // Ask the browser to lock the pointer
            element.requestPointerLock = element.requestPointerLock || element.mozRequestPointerLock || element.webkitRequestPointerLock;

            if ( /Firefox/i.test( navigator.userAgent ) ) {

                var fullscreenchange = function ( event ) {

                    if ( document.fullscreenElement === element || document.mozFullscreenElement === element || document.mozFullScreenElement === element ) {

                        document.removeEventListener( 'fullscreenchange', fullscreenchange );
                        document.removeEventListener( 'mozfullscreenchange', fullscreenchange );

                        element.requestPointerLock();
                    }

                };

                document.addEventListener( 'fullscreenchange', fullscreenchange, false );
                document.addEventListener( 'mozfullscreenchange', fullscreenchange, false );

                element.requestFullscreen = element.requestFullscreen || element.mozRequestFullscreen || element.mozRequestFullScreen || element.webkitRequestFullscreen;

                element.requestFullscreen();

            } else {

                element.requestPointerLock();

            }

        }

    } else {

        instructions.innerHTML = 'Your browser doesn\'t seem to support Pointer Lock API';

    }
        
    function onKeyDown( event ) {
        if(controls.enabled === false){
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

    function onKeyUp( event ) {

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
    
    function onDocumentMouseDown(e){
        if(controls.enabled === false){
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
    }
}


function update_control(){
    if ( controlsEnabled ) {
        var time = performance.now();
        var delta = ( time - prevTime ) / 1000;

        velocity.x -= velocity.x * 10.0 * delta;
        velocity.z -= velocity.z * 10.0 * delta;

        velocity.y -= 9.8 * 100.0 * delta; // 100.0 = mass
        
        if ( moveForward ) velocity.z -= 600.0 * delta;
        if ( moveBackward ) velocity.z += 600.0 * delta;

        if ( moveLeft ) velocity.x -= 600.0 * delta;
        if ( moveRight ) velocity.x += 600.0 * delta;

        controls.getObject().translateX( velocity.x * delta );
        controls.getObject().translateY( velocity.y * delta );
        controls.getObject().translateZ( velocity.z * delta );

		if( controls.getObject().position.x > 490 ){
			controls.getObject().position.x = 490;
		}
		if( controls.getObject().position.x < -490 ){
			controls.getObject().position.x = -490;
		}
		if( controls.getObject().position.z > 490 ){
			controls.getObject().position.z = 490;
		}
		if( controls.getObject().position.z < -490 ){
			controls.getObject().position.z = -490;
		}
		
        if ( controls.getObject().position.y < 10) {
            velocity.y = 0;
            controls.getObject().position.y = 10;
            canJump = true;
        }   
        
        if(down && canJump){
            velocity.y = 0;
            controls.getObject().position.y = 0;
        }
        
        prevTime = time;
    }
}

THREE.PointerLockControls = function ( camera ) {
	var scope = this;

	camera.rotation.set( 0, 0, 0 );

	var pitchObject = new THREE.Object3D();
	pitchObject.add( camera );

	var yawObject = new THREE.Object3D();
	yawObject.position.y = 10;
	yawObject.add( pitchObject );

	var PI_2 = Math.PI / 2;

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

	this.dispose = function() {
		document.removeEventListener( 'mousemove', this.onMouseMove, false );
	};

	document.addEventListener( 'mousemove', this.onMouseMove, false );

	this.enabled = false;

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
};

