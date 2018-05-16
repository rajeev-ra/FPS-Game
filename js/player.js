define(["CollisionMgr", "Bullet"], function(CollisionMgr, Bullet){
    var Player = function(scene, camera, control){
        document.addEventListener('mousedown', onMouseDown, false );
        var power = 100;
        var power_mesh;
        var dv = 0.1;
        var blood_mat = new THREE.MeshBasicMaterial({color:0xff2222, transparent: true, opacity:0});

        function draw_gun(){
            var material = new THREE.MeshLambertMaterial({color:0x666666});
            var geometry = new THREE.CylinderGeometry(0.25, 0.25, 6, 20);
            var mesh = new THREE.Mesh(geometry, material);
            mesh.position.set(0, -1, -4);
            mesh.rotation.x = Math.PI / 2;
            camera.add(mesh);
        }
        
        function draw_view_finder(){
            var material1 = new THREE.MeshBasicMaterial( { color: 0x000000 } );
            var material2 = new THREE.MeshBasicMaterial( { color: 0x44ff44 } );
            
            var t_geometry1 = new THREE.TorusGeometry( 0.1, 0.005, 2, 50 );
            var torus1 = new THREE.Mesh( t_geometry1, material1 );
            torus1.position.set(0,0,-1.5);
            camera.add( torus1 );
            
            var t_geometry2 = new THREE.TorusGeometry( 0.1, 0.007, 2, 50 );
            var torus2 = new THREE.Mesh( t_geometry2, material2 );
            torus2.position.set(0,0,-1.5001);
            camera.add( torus2 );
            
            var p_geometry1 = new THREE.PlaneGeometry( 0.15, 0.01);
            var plane = new THREE.Mesh( p_geometry1, material1 );
            plane.position.set(0.1, 0, -1.5);
            camera.add( plane );
            
            plane = new THREE.Mesh( p_geometry1, material1 );
            plane.position.set(-0.1, 0, -1.5);
            camera.add( plane );
            
            var p_geometry2 = new THREE.PlaneGeometry( 0.01, 0.15);
            plane = new THREE.Mesh( p_geometry2, material1 );
            plane.position.set(0, 0.1, -1.5);
            camera.add( plane );
            
            plane = new THREE.Mesh( p_geometry2, material1 );
            plane.position.set(0, -0.1, -1.5);
            camera.add( plane );
            
            var p_geometry3 = new THREE.PlaneGeometry( 0.154, 0.014);
            plane = new THREE.Mesh( p_geometry3, material2 );
            plane.position.set(0.1, 0, -1.5001);
            camera.add( plane );
            
            plane = new THREE.Mesh( p_geometry3, material2 );
            plane.position.set(-0.1, 0, -1.5001);
            camera.add( plane );
            
            var p_geometry4 = new THREE.PlaneGeometry( 0.014, 0.154);
            plane = new THREE.Mesh( p_geometry4, material2 );
            plane.position.set(0, 0.1, -1.5001);
            camera.add( plane );
            
            plane = new THREE.Mesh( p_geometry4, material2 );
            plane.position.set(0, -0.1, -1.5001);
            camera.add( plane );
        }

        function draw_power(){
            var pg = new THREE.BoxGeometry(21, 2, 0.05);
            var power_mat = new THREE.MeshBasicMaterial({color:0x55ff55});
            var power_bg_mat = new THREE.MeshBasicMaterial({color:0x555555});
            var power_bg_mesh = new THREE.Mesh(pg, power_bg_mat);
            power_mesh = new THREE.Mesh(power_geoms[100], power_mat);
            power_mesh.add(power_bg_mesh);
            power_mesh.scale.set(0.04,0.04,0.04);
            power_mesh.position.set(0,-0.4,-1.1);
            camera.add(power_mesh);
        }

        function draw_blood(){
            var bl = new THREE.Mesh(new THREE.PlaneGeometry( 10, 10 ), blood_mat);
            bl.position.set(0, 0, -2);
            camera.add(bl);
        }

        draw_view_finder();
        draw_gun();
        draw_power();
        draw_blood();

        CollisionMgr.setPlayerControl(this, control);

        function onMouseDown(e){
            if(control.enabled === false){
                return;
            }
            if(e.button === 0){	
                new Bullet(control,scene);
            }
        }

        function shot(){
            if(blood_mat.opacity < 1.1 && blood_mat.opacity > 0.9){
                dv = -0.1;
            }
            blood_mat.opacity += dv;
            blood_mat.needsUpdate = true;

            if(blood_mat.opacity > 0.05){
                setTimeout(shot, 20);
            }
            else{
                dv = 0.1;
            }
        }

        this.hit = function(){
            if(power > 0){                
                shot();
                power -= 5;
                if(power < 1){
                    power = 0;
                    power_mesh.geometry = new THREE.Geometry();
                    var event = new Event('gameover');
                    document.dispatchEvent(event);
                }
                else{
                    power_mesh.geometry = power_geoms[power];
                }
            }
        };

        
        document.addEventListener( 'resetgame', function(){
            power = 100;
            dv = 0.1;
            power_mesh.geometry = power_geoms[power];
        }, false );
    };

    return Player;
});