define(["CollisionMgr"], function(CollisionMgr){
        
    var bullet_geom = new THREE.SphereGeometry(1,20,20);
    var bullet_mat = new THREE.MeshPhongMaterial({color:0x0000ff, emissive: new THREE.Color( 1, 0, 0 )});
    var bullet_mat_tar = new THREE.MeshPhongMaterial({color:0x0000ff, emissive: new THREE.Color( 0, 0, 1 )});

    var Bullet = function(control, scene, target){        
        var dir = control.getDirection();
        var pos = control.getObject().position;
        var speed = 0.5;

        var mesh = new THREE.Mesh(bullet_geom, bullet_mat);

        if(target){
            dir = new THREE.Vector3();
            dir.subVectors(control.getObject().position, target.target_mesh.position);
            dir.normalize();
            pos = target.target_mesh.position;
            mesh.material = bullet_mat_tar;
            speed = 0.05;
        }

        var prevTime = performance.now();        

        mesh.position.set(pos.x,pos.y - 1,pos.z);
        scene.add(mesh);
        
        var _this = this;
        var active = true;

        this.Remove = function(){
            active = false;
            scene.remove(mesh);
        };

        document.addEventListener( 'resetgame', function(){
            _this.Remove();
        }, false );

        function update(){
            var time = performance.now();
            if(control.enabled){
                var delta = ( time - prevTime ) * 0.5;
                mesh.position.x += dir.x * delta;
                mesh.position.y += dir.y * delta;
                mesh.position.z += dir.z * delta;
                if(target){
                    if(CollisionMgr.checkPlayerCollision(mesh.position)){
                        _this.Remove();
                    }
                }
                else{
                    if(CollisionMgr.checkCollision(mesh.position)){
                        _this.Remove();
                    }
                }
            }
            prevTime = time;

            if(active){
                setTimeout(update, 20);
            }
        }

        update();

        setTimeout(function(){
            _this.Remove();
        }, 10000);
    };

    return Bullet;
});