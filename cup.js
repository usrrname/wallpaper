var scene, camera, light, renderer,
    cup,
    cupBodyGeometry, cupBodyMaterials = [], cupBodyMaterial,  cupBodyMaterialTexture, cupBodyMesh,
    cupTop, cupTopGeometry, cupTopMaterial,
    logoGeometry, logoMaterial, logoMesh;
    var mesh;
var logoFaceArray = [
    0, 1, 2, 3, 4, 5, 6, 7, 24, 25, 26, 27, 28, 29, 30, 31
    , 48, 49, 50, 51, 52, 53, 54, 55, 72, 73, 74, 75, 76, 77, 78, 79
    , 96, 97, 98, 99, 100, 101, 102, 103, 120, 121, 122, 123, 124, 125, 126, 127
];

function generateGeometry(parent, faces) {
    var returnFaces = [],
        returnVertices = [],
        cloneControl = {},
        counter = 0;

    for (var i = 0; i < faces.length; i++) {
        var fA, fB, fC,
            vA = parent.faces[faces[i]].a,
            vB = parent.faces[faces[i]].b,
            vC = parent.faces[faces[i]].c;

        if (cloneControl[vA] != undefined) {
            fA = cloneControl[vA];
        } else {
            returnVertices.push(parent.vertices[vA]);
            cloneControl[vA] = fA = counter;
            counter++;
        }
        if (cloneControl[vB] != undefined) {
            fB = cloneControl[vB];
        } else {
            returnVertices.push(parent.vertices[vB]);
            cloneControl[vB] = fB = counter;
            counter++;
        }
        if (cloneControl[vC] != undefined) {
            fC = cloneControl[vC];
        } else {
            returnVertices.push(parent.vertices[vC]);
            cloneControl[vC] = fC = counter;
            counter++;
        }
        returnFaces.push(new THREE.Face3(fA, fB, fC));
    }
    return {faces: returnFaces, vertices: returnVertices};
}

function init(){

    scene = new THREE.Scene();

    var AMOUNT = Math.floor(Math.random() * 10)+1 ;
    var r = Math.floor(Math.random() * Math.PI) + 2;
    var scalar = Math.ceil(Math.random() * 8)+1 ;
    var SIZE = r / AMOUNT;
    var ASPECT_RATIO = window.innerWidth / window.innerHeight;
    var cameras = [];
    for ( var y = 0; y < AMOUNT; y ++ ) {
        for ( var x = 0; x < AMOUNT; x ++ ) {
            var subcamera = new THREE.PerspectiveCamera( 40, ASPECT_RATIO, 1, 100 );
            subcamera.bounds = new THREE.Vector4( x / AMOUNT, y / AMOUNT, SIZE, SIZE );
            subcamera.position.x = ( x / AMOUNT ) - 0.5;
            subcamera.position.y = 0.5 - ( y / AMOUNT );
            subcamera.position.z = 1.5;
            subcamera.position.multiplyScalar( scalar );
            subcamera.lookAt( new THREE.Vector3() );
            subcamera.updateMatrixWorld();
            cameras.push( subcamera );
        }
    }
    camera = new THREE.ArrayCamera( cameras );
    camera.position.z = 1800;
    camera.position.set(-0.00, 1.50, 5.2);
    camera.rotation.set(0.50, 0, 0);

    var background = new THREE.Mesh( geometry, material );
    background.receiveShadow = true;
    background.position.set( 0, 0, - 1 );
    scene.add( background );

    var geometry = new THREE.SphereGeometry( 0.5, 0.5, 0.5, 50 );
    var material = new THREE.MeshPhongMaterial( { color: 0xff0000 } );
    mesh = new THREE.Mesh( geometry, material );
    mesh.castShadow = true;
    mesh.receiveShadow = true;
    scene.add( mesh );

    renderer = new THREE.WebGLRenderer();
    renderer.setPixelRatio( window.devicePixelRatio );
    renderer.setSize( window.innerWidth, window.innerHeight );
    renderer.shadowMap.enabled = true;
    document.body.appendChild( renderer.domElement );

    /** Light */
    light = new THREE.DirectionalLight(0xffffff, 0.5);
    light.position.set(1, 5, 7.5);
    scene.add(light);

      /** Renderer */
      renderer = new THREE.WebGLRenderer({
        antialias: true,
        preserveDrawingBuffer: false,
        alpha: true
     });
     renderer.setClearColor(0xffffff, 0);
 
     renderer.setSize(window.innerWidth, window.innerHeight);
     document.getElementById('container').appendChild(renderer.domElement);
}

function renderCup(){
  
    cup = new THREE.Object3D();
    cup.name = "cup";
  
    /*****************************************************
    *   BODY                                            *
    *****************************************************/

    cupBodyGeometry = new THREE.CylinderGeometry(1.27, 1, 2.4, 64, 12, true);
    var loader2 = new THREE.TextureLoader();
    loader2.crossOrigin = '*';
  
    var dotsTexture = loader2.load("img/solojazz.jpg");
    dotsTexture.wrapS = THREE.RepeatWrapping;
    dotsTexture.wrapT = THREE.RepeatWrapping;
    dotsTexture.repeat.set(4.0, 1.50);
    dotsTexture.name = 'cupBodyTexture';

    cupBodyMaterial = new THREE.MeshBasicMaterial({
        color: 0xFFFFFF,
        side: THREE.DoubleSide,
        overdraw: 0.5
    });
    cupBodyMaterial.name = "cupBodyMaterial";

    cupBodyMaterialTexture = new THREE.MeshBasicMaterial({
        map: dotsTexture,
        transparent: true,
        overdraw: true
    });
    cupBodyMaterialTexture.name = "cupBodyTexture";

    cupBodyMaterials.push(cupBodyMaterial);
    cupBodyMaterials.push(cupBodyMaterialTexture);

    cupBodyMaterial.vertexColors = THREE.FaceColors;
    cupBodyGeometry.computeFaceNormals();

    cupBodyMesh = THREE.SceneUtils.createMultiMaterialObject(cupBodyGeometry, cupBodyMaterials);
    cupBodyMesh.name = 'cupBody';
    cup.add(cupBodyMesh);

    /*****************************************************
    *   LOGO                                            *
    *****************************************************/
    var loader = new THREE.TextureLoader();
    loader.crossOrigin = '*';
    var logoTexture =  loader.load('img/red.png');
  
    logoTexture.wrapS = THREE.ClampToEdgeWrapping;
    logoTexture.wrapT = THREE.ClampToEdgeWrapping;
    var zeroToFive = Math.floor(Math.random()* 5) +1;
    var zeroToOne = Math.floor(Math.random()* 1) +1;
    logoTexture.repeat.set(zeroToOne, zeroToFive);
    logoTexture.name = 'logo';

    logoMaterial = new THREE.MeshBasicMaterial({map: logoTexture, transparent: true, overdraw: true});
    logoGeometry = new THREE.Geometry();

    var logoGeometryData = generateGeometry(cupBodyGeometry, logoFaceArray);
    logoGeometry.faces = logoGeometryData.faces;
    logoGeometry.vertices = logoGeometryData.vertices;

    logoGeometry.computeFaceNormals();
    logoGeometry.computeVertexNormals();

    logoGeometry.computeBoundingBox();
    var max = logoGeometry.boundingBox.max,
        min = logoGeometry.boundingBox.min;

    var offsetX = (0 - min.x);
    var offsetY = (0 - min.y);
    var range = new THREE.Vector2(Math.atan(max.x / max.z) - Math.atan(min.x / min.z), max.y - min.y);

    var rangeX = range.x + 0.05; 
    var rangeY = max.y - min.y;

    logoGeometry.faceVertexUvs[0] = [];
    for (var i = 0; i < logoGeometry.faces.length; i++) {

        var v1 = logoGeometry.vertices[logoGeometry.faces[i].a],
            v2 = logoGeometry.vertices[logoGeometry.faces[i].b],
            v3 = logoGeometry.vertices[logoGeometry.faces[i].c];

        logoGeometry.faceVertexUvs[0].push([
            new THREE.Vector2((Math.atan(v1.x / v1.z) + offsetX) / rangeX, (v1.y + offsetY) / rangeY),
            new THREE.Vector2((Math.atan(v2.x / v2.z) + offsetX) / rangeX, (v2.y + offsetY) / rangeY),
            new THREE.Vector2((Math.atan(v3.x / v3.z) + offsetX) / rangeX, (v3.y + offsetY) / rangeY)
        ]);
    }

    logoGeometry.uvsNeedUpdate = true;

    logoMesh = new THREE.Mesh(logoGeometry, logoMaterial);
    logoMesh.overdraw = true;
    logoMesh.name = "cupLogo";
    cup.add(logoMesh);


    /*****************************************************
     *   TOP                                             *
     *****************************************************/

    cupTopGeometry = new THREE.TorusGeometry(1.29, .06, .16, 62);
    cupTopMaterial = new THREE.MeshStandardMaterial({
        color: 0xFFFFFF,
        roughness: 0.50,
        metalness: 0.50,
        emissive: 0xC4C4C4,
        overdraw: true
    });

    cupTop = new THREE.Mesh(cupTopGeometry, cupTopMaterial);
    cupTop.name = 'cupTop';
    cupTop.position.set(0, 1.25, 0);
    cupTop.rotation.x = Math.PI / 2;

    cup.add(cupTop);

    camera.lookAt(cup.position);
    scene.add(cup);

}

function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize( window.innerWidth, window.innerHeight );
}

var render = function () {
    requestAnimationFrame(render);
    cup.rotation.x += 0.01;
    cup.rotation.y += 0.01;
    renderer.render(scene, camera);
    renderer.render(scene, camera);
};
function animate(){
    mesh.rotation.x += 0.005;
    mesh.rotation.z += 0.01;
    mesh.rotation.y += 0.01;   
    requestAnimationFrame( animate );
}

init();
renderCup();
render();
animate();
