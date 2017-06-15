var scene, camera, renderer;
var deg1 = 0.0;
var deg2 = 0.0;
var texture_placeholder;
var side_length = 1000;
var wall_height = 100;
var bullet_geom;
var bullet_mat;
var bullets = [];

function init() {
	window.addEventListener('resize',on_resize,false);
	document.addEventListener('mousedown', onMouseDown, false );
	scene = new THREE.Scene();

	renderer = new THREE.WebGLRenderer({antialias:true});
	document.body.appendChild(renderer.domElement);
	var width = window.innerWidth;
	var height = window.innerHeight;
    renderer.setSize(width, height);
    
    var light = new THREE.HemisphereLight( 0xeeeeff, 0x777788, 0.75 );
    light.position.set( 0.5, 1, 0.75 );
    scene.add( light );
        
	camera = new THREE.PerspectiveCamera( 45, width / height, 1, 6000 );    
	camera.updateProjectionMatrix();
	scene.add( camera );
    
	init_shader();	
	
	draw_view_finder();
	draw_gun();
    draw_play_area();
    
    init_control(scene, camera);
    
    bullet_geom = new THREE.SphereGeometry(1,20,20);
    bullet_mat = new THREE.MeshLambertMaterial({color:0xff0000});
    
	function render() {
        update_control();
        for (var index = 0; index < bullets.length; index++) {
            bullets[index].update();
        }
		requestAnimationFrame( render );
		renderer.render( scene, camera );
	}
	render();
}

function onMouseDown(e){
    if(controls.enabled === false){
        return;
    }
    if(e.button === 0){	
        var d = controls.getDirection();
        var px = controls.getObject().position.x;
        var py = controls.getObject().position.y - 1;
        var pz = controls.getObject().position.z;
        var b = new Bullet(px,py,pz,d.x,d.y,d.z);
        bullets.push(b);
    }
}
    
var Bullet = function (px,py,pz,dx,dy,dz) {
    this.dirX = dx;
    this.dirY = dy;
    this.dirZ = dz;
    this.prevTime = performance.now();
    
    this.mesh = new THREE.Mesh(bullet_geom, bullet_mat);
    this.mesh.position.set(px,py,pz);
    scene.add(this.mesh);
    
    this.update = function(){
        var time = performance.now();
        var delta = ( time - this.prevTime );
        this.mesh.position.x += this.dirX * delta;
        this.mesh.position.y += this.dirY * delta;
        this.mesh.position.z += this.dirZ * delta;
        this.prevTime = time;
    }
}

function init_shader(){
	texture_placeholder = document.createElement( 'canvas' );
	texture_placeholder.width = 128;
	texture_placeholder.height = 128;
	var materialArray = [
		loadTexture( 'texture/xpos.png' ), // right
		loadTexture( 'texture/xneg.png' ), // left
		loadTexture( 'texture/ypos.png' ), // top
		loadTexture( 'texture/yneg.png' ), // bottom
		loadTexture( 'texture/zpos.png' ), // back
		loadTexture( 'texture/zneg.png' )  // front
	];
	
	mesh = new THREE.Mesh( new THREE.BoxGeometry( 5000, 5000, 5000), new THREE.MultiMaterial( materialArray ) );
	mesh.scale.x = - 1;
	scene.add( mesh );
}

function loadTexture( path ) {
	var texture = new THREE.Texture( texture_placeholder );
	var material = new THREE.MeshBasicMaterial( { map: texture, overdraw: 0.5, side: THREE.DoubleSide } );
	var image = new Image();
	image.onload = function () {
		texture.image = this;
		texture.needsUpdate = true;
	};
	image.src = path;
	return material;
}

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

function draw_play_area() {    
    var floorTexture = new THREE.ImageUtils.loadTexture( 'texture/grass.png' );
	floorTexture.wrapS = floorTexture.wrapT = THREE.RepeatWrapping; 
	floorTexture.repeat.set( 50, 50 );
    
    var floorgeometry = new THREE.PlaneGeometry( side_length, side_length, 50,50);
    var floormaterial = new THREE.MeshBasicMaterial( {map: floorTexture, side: THREE.DoubleSide} );
    var floor = new THREE.Mesh( floorgeometry, floormaterial );
    floor.position.y = -10;
    floor.rotation.x = Math.PI / 2;
    scene.add( floor );
    
    var wallTexture = new THREE.ImageUtils.loadTexture( 'texture/brick2.jpg' );
	wallTexture.wrapS = wallTexture.wrapT = THREE.RepeatWrapping; 
	wallTexture.repeat.set( 20, 2 );
    
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
function put_objects(){
	var geometry = new THREE.SphereGeometry( 5, 32, 32 );
	var material = new THREE.MeshLambertMaterial( {color: 0xffff00} );
	for (var i = 0; i < 100; i++) {
		var x = (Math.random() * 2 - 1 ) * 200;
		var y = (Math.random() * 2 - 1 ) * 200;
		var z = (Math.random() * 2 - 1 ) * 200;
		var sphere = new THREE.Mesh( geometry, material );
		sphere.position.set(x,y,z);
		scene.add( sphere );
	}
}

function on_resize(){
	camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();

    renderer.setSize( window.innerWidth, window.innerHeight );
}