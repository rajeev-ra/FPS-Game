define(function(require){
    var Player = function(playground){
        document.addEventListener('mousedown', onMouseDown, false );

        function draw_gun(){
            var material = new THREE.MeshLambertMaterial({color:0x666666});
            var geometry = new THREE.CylinderGeometry(0.25, 0.25, 6, 20);
            var mesh = new THREE.Mesh(geometry, material);
            mesh.position.set(0, -1, -4);
            mesh.rotation.x = Math.PI / 2;
            playground.camera.add(mesh);
        }
        
        function draw_view_finder(){
            var material1 = new THREE.MeshBasicMaterial( { color: 0x000000 } );
            var material2 = new THREE.MeshBasicMaterial( { color: 0x44ff44 } );
            
            var t_geometry1 = new THREE.TorusGeometry( 0.1, 0.005, 2, 50 );
            var torus1 = new THREE.Mesh( t_geometry1, material1 );
            torus1.position.set(0,0,-1.5);
            playground.camera.add( torus1 );
            
            var t_geometry2 = new THREE.TorusGeometry( 0.1, 0.007, 2, 50 );
            var torus2 = new THREE.Mesh( t_geometry2, material2 );
            torus2.position.set(0,0,-1.5001);
            playground.camera.add( torus2 );
            
            var p_geometry1 = new THREE.PlaneGeometry( 0.15, 0.01);
            var plane = new THREE.Mesh( p_geometry1, material1 );
            plane.position.set(0.1, 0, -1.5);
            playground.camera.add( plane );
            
            plane = new THREE.Mesh( p_geometry1, material1 );
            plane.position.set(-0.1, 0, -1.5);
            playground.camera.add( plane );
            
            var p_geometry2 = new THREE.PlaneGeometry( 0.01, 0.15);
            plane = new THREE.Mesh( p_geometry2, material1 );
            plane.position.set(0, 0.1, -1.5);
            playground.camera.add( plane );
            
            plane = new THREE.Mesh( p_geometry2, material1 );
            plane.position.set(0, -0.1, -1.5);
            playground.camera.add( plane );
            
            var p_geometry3 = new THREE.PlaneGeometry( 0.154, 0.014);
            plane = new THREE.Mesh( p_geometry3, material2 );
            plane.position.set(0.1, 0, -1.5001);
            playground.camera.add( plane );
            
            plane = new THREE.Mesh( p_geometry3, material2 );
            plane.position.set(-0.1, 0, -1.5001);
            playground.camera.add( plane );
            
            var p_geometry4 = new THREE.PlaneGeometry( 0.014, 0.154);
            plane = new THREE.Mesh( p_geometry4, material2 );
            plane.position.set(0, 0.1, -1.5001);
            playground.camera.add( plane );
            
            plane = new THREE.Mesh( p_geometry4, material2 );
            plane.position.set(0, -0.1, -1.5001);
            playground.camera.add( plane );
        }

        draw_view_finder();
	    draw_gun();

        function onMouseDown(e){
            if(playground.control.enabled === false){
                return;
            }
            if(e.button === 0){	
                playground.AddBullet();
            }
        }
    };

    return Player;
});