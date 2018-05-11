define(function(require){
        
    var bullet_geom = new THREE.SphereGeometry(1,20,20);
    var bullet_mat = new THREE.MeshPhongMaterial({color:0x0000ff, emissive: new THREE.Color( 1, 0, 0 )});

    var Bullet = function(pos,dir,scene,geom,mat){
        this.dirX = dir.x;
        this.dirY = dir.y;
        this.dirZ = dir.z;
        this.prevTime = performance.now();        

        this.mesh = new THREE.Mesh(bullet_geom, bullet_mat);
        this.mesh.position.set(pos.x,pos.y,pos.z);
        scene.add(this.mesh);
        
        this.update = function(){
            var time = performance.now();
            var delta = ( time - this.prevTime ) * 1.2;
            this.mesh.position.x += this.dirX * delta;
            this.mesh.position.y += this.dirY * delta;
            this.mesh.position.z += this.dirZ * delta;
            this.prevTime = time;
        };
    };

    return Bullet;
});