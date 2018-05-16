define(function(require){
    function ReserControl(control){
        this.Paused = function(){
            return !control.enabled;
        };

        var resetRequired = false;
        var blocker = document.getElementById( 'blocker' );
        var instructions = document.getElementById( 'instructions' );
        var gameoverspan = document.getElementById( 'gameover' );
        var havePointerLock = 'pointerLockElement' in document || 'mozPointerLockElement' in document || 'webkitPointerLockElement' in document;

        if ( havePointerLock ) {
            var element = document.body;
            var pointerlockchange = function ( event ) {
                if ( document.pointerLockElement === element || document.mozPointerLockElement === element || document.webkitPointerLockElement === element ) {
                    control.enabled = true;
                    blocker.style.display = 'none';
                    gameoverspan.style.opacity = "0";
                    if(resetRequired){
                        resetRequired = false;                        
                        var resetevent = new Event('resetgame');
                        document.dispatchEvent(resetevent);
                    }
                } else {
                    control.enabled = false;
                    blocker.style.display = '-webkit-box';
                    blocker.style.display = '-moz-box';
                    blocker.style.display = 'box';
                    instructions.style.display = '';
                }
            };

            var pointerlockerror = function ( event ) {
                instructions.style.display = '';
            };

            var gameover = function(){    
                resetRequired = true;            
                gameoverspan.style.opacity = "1";
                
                document.exitPointerLock = document.exitPointerLock    ||
                           document.mozExitPointerLock;
                // Attempt to unlock
                document.exitPointerLock();
            };

            // Hook pointer lock state change events
            document.addEventListener( 'pointerlockchange', pointerlockchange, false );
            document.addEventListener( 'mozpointerlockchange', pointerlockchange, false );
            document.addEventListener( 'webkitpointerlockchange', pointerlockchange, false );

            document.addEventListener( 'pointerlockerror', pointerlockerror, false );
            document.addEventListener( 'mozpointerlockerror', pointerlockerror, false );
            document.addEventListener( 'webkitpointerlockerror', pointerlockerror, false );

            document.addEventListener( 'gameover', gameover, false );

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
        

        this.Reset = function(){
            gameoverspan.style.opacity = "1";
            if(pointerlockchange){
                pointerlockchange();
            }
        };
    }

    return ReserControl;
});