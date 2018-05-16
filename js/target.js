define(["CollisionMgr", "Bullet"], function(CollisionMgr, Bullet){

    var target_geom = new THREE.SphereGeometry(12,20,20);
    var target_mat = new THREE.MeshPhongMaterial({color:0xff5555});
    var time_mat = new THREE.MeshPhongMaterial({color:0xff8888, emissive: new THREE.Color( 0.25, 0, 0 )});
    var power_mat = new THREE.MeshBasicMaterial({color:0xff5555});
    var power_bg_mat = new THREE.MeshBasicMaterial({color:0x555555});
    var pg = new THREE.BoxGeometry(21, 2, 0.05);

    var targetData = {
        default:{
            mat: new THREE.MeshPhongMaterial({color:0xff5555, emissive: new THREE.Color( 0.25, 0, 0 )}),
            power_subs: 10,
            time: 60,
            safe: false
        },
        basic:{
            mat: new THREE.MeshPhongMaterial({color:0xffff55, emissive: new THREE.Color( 0.25, 0.25, 0 )}),
            power_subs: 5,
            time: 30,
            safe: false
        },
        danger:{
            mat: new THREE.MeshPhongMaterial({color:0xff55ff, emissive: new THREE.Color( 0.25, 0, 0.25 )}),
            power_subs: 10,
            time: 15,
            safe: false
        },
        power:{
            mat: new THREE.MeshPhongMaterial({color:0x55ffff, emissive: new THREE.Color( 0.1, 0.25, 0.25 )}),
            power_subs: 2,
            time: 30,
            safe: false
        },
        safe:{
            mat: new THREE.MeshPhongMaterial({color:0x55ff55, emissive: new THREE.Color( 0.15, 0.25, 0.1 )}),
            power_subs: 50,
            time: 60,
            safe: true
        }        
    };
    function Target(scene, control, pos, type){
        var data = targetData.default;
        if(type && targetData[type]){
            data = targetData[type];
        }

        var active = true;
        var target_time = data.time;
        var power = 100;
        var time_mesh = new THREE.Mesh(time_geoms[target_time], time_mat);
        time_mesh.position.y = 15;
        time_mesh.position.x = -time_mesh.geometry.boundingBox.max.x / 2 ;

        var power_bg_mesh = new THREE.Mesh(pg, power_bg_mat);
        var power_mesh = new THREE.Mesh(power_geoms[100], power_mat);
        power_mesh.position.y = 13;
        power_bg_mesh.position.y = 13;

        this.target_mesh = new THREE.Mesh(target_geom, data.mat);
        this.target_mesh.position.set(pos.x, 5, pos.z);
        this.target_mesh.add(time_mesh);
        this.target_mesh.add(power_mesh);
        this.target_mesh.add(power_bg_mesh);
        scene.add(this.target_mesh);

        CollisionMgr.add(this);

        var _this = this;

        document.addEventListener( 'resetgame', function(){
            active = false;
            CollisionMgr.remove(_this);
            scene.remove(_this.target_mesh);
        }, false );

        this.hit = function(){
            power -= data.power_subs;
            if(power > 0){
                power_mesh.geometry = power_geoms[power];
            }
            else{
                active = false;
                CollisionMgr.remove(_this);
                scene.remove(_this.target_mesh);
            }
        };


        function lookat(){
            if(target_time > -1){
                if(control.enabled){
                    time_mesh.geometry = time_geoms[target_time];
                    time_mesh.position.x = -time_mesh.geometry.boundingBox.max.x / 2 ;
                    target_time -= 1;                
                    _this.target_mesh.lookAt(control.getObject().position);
                    if(target_time % 5 === 0){
                        new Bullet(control, scene, _this);
                    }
                }
                if(active){
                    setTimeout(lookat, 1000);
                }
            }
            else{                
                var event = new Event('resetgame');
                document.dispatchEvent(event);
            }
        }

        lookat();
    }

    return Target;
});