define(function(require){
    return {
        targets:[],
        player: null,
        control: null,

        setPlayerControl: function(player, control){
            this.player = player;
            this.control = control;
        },

        add: function(target){
            this.targets.push(target);
        },
        checkCollision: function(pos){
            if(pos.x < 500 && pos.x > -500 && pos.z < 500 && pos.z > -500 && pos.y < 15 && pos.y > 0){
                for(var i = 0; i < this.targets.length; i++){
                    if (13 >= pos.distanceTo( this.targets[i].target_mesh.position )){
                        this.targets[i].hit();
                        return true;
                    }
                }
            }
            return false;
        },

        checkPlayerCollision: function(pos){
            if(5 >= pos.distanceTo(this.control.getObject().position)){
                this.player.hit();
                return true;
            }
            return false;
        },

        remove: function(target){
            for(var i = 0; i < this.targets.length; i++){
                if(target === this.targets[i]){
                    this.targets.splice(i, 1);
                    return;
                }
            }
        }, 

        getNonCollidingPos: function(pos){
            var retpos = new THREE.Vector3(0, 10, 0);
            while(true){
                retpos.x = 50 * Math.floor(((Math.random() - 0.5) * 18) + 1);
                retpos.z = 50 * Math.floor(((Math.random() - 0.5) * 18) + 1);

                if(80 < retpos.distanceTo(pos)){
                    var i = 0;
                    for(i = 0; i < this.targets.length; i++){
                        if(5 > retpos.distanceTo( this.targets[i].target_mesh.position )){
                            break;
                        }
                    }
                    if(i === this.targets.length){
                        return retpos;
                    }
                }
            }
        }
    };
});