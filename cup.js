// # The Actors

function add(s) {
    return function(o) {
        if (o.o3d === undefined) {
            s.add(o);
        } else {
            s.add(o.o3d);
        }
    };
}

// Kick everytihng off.
function zombieSoloJazz() {
    // First a scene, with background and lighting.
    let scene = newLight(newBackground(newScene()));

    // Create the camera and look at the cup.
    let camera = newCamera();
    let cup = newCup(scene, camera);
    camera.lookAt(cup.position);
    scene.add(cup);

    return {
        scene: scene,
        camera: camera,
        cup: cup,
        renderer: newRenderer(document.getElementById("canvas")),
        animate: function() {
            scene.animate()();
            cup.animate()();
        }
    };
};

// Return our Scene object.
//
// This has our scene's geometry, the material, and the mesh which
// renders them both.
function newScene() {
    let geometry = new THREE.SphereGeometry( 0.5, 0.5, 0.5, 50 );
    let material = new THREE.MeshPhongMaterial( { color: 0xff0000 } );
    let mesh = new THREE.Mesh( geometry, material );
    mesh.castShadow = true;
    mesh.receiveShadow = true;

    let scene = new THREE.Scene();
    scene.add(mesh);

    return {
        geometry: geometry,
        material: material,
        o3d: scene,
        add: add(scene),
        mesh: mesh,
        animate: function() {
            let render = function() {
                mesh.rotation.x += 0.005;
                mesh.rotation.z += 0.01;
                mesh.rotation.y += 0.01;
                requestAnimationFrame(render);
            };
            return render;
        }
    };
};

// Initialize the lighting for the scene.
function newLight(scene) {
    let light = new THREE.DirectionalLight(0xffffff, 0.5);
    light.position.set(1, 5, 7.5);
    scene.add(light);
    return scene;
};

// Initialize the general background of the scene.
function newBackground(scene) {
    let background = new THREE.Mesh( scene.geometry, scene.material );
    background.receiveShadow = true;
    background.position.set( 0, 0, - 1 );
    scene.add( background );

    return scene;
};

// Initialize the camera array.
function newCamera() {
    let AMOUNT = Math.floor(Math.random() * 10)+1 ;
    let r = Math.floor(Math.random() * Math.PI) + 2;
    let scalar = Math.ceil(Math.random() * 8)+1 ;
    let SIZE = r / AMOUNT;
    let ASPECT_RATIO = window.innerWidth / window.innerHeight;
    let cameras = [];
    for ( let y = 0; y < AMOUNT; y ++ ) {
        for ( let x = 0; x < AMOUNT; x ++ ) {
            let subcamera = new THREE.PerspectiveCamera( 40, ASPECT_RATIO, 1, 100 );
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

    return camera;
};

// New Renderer attached to a canvas element.
function newRenderer(canvas) {
    renderer = new THREE.WebGLRenderer({
        canvas: canvas,
        antialias: true,
        preserveDrawingBuffer: false,
        alpha: true
    });

    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.shadowMap.enabled = true;
    renderer.setClearColor(0xffffff, 0);

    return renderer;
};

// Create a new Object3D of a cup.
function newCup(scene, camera){

    let cupTopMesh = function(cup) {
        /*****************************************************
         *   TOP                                             *
         *****************************************************/

        let cupTopGeometry = new THREE.TorusGeometry(1.29, .06, .16, 62);
        let cupTopMaterial = new THREE.MeshStandardMaterial({
            color: 0xFFFFFF,
            roughness: 0.50,
            metalness: 0.50,
            emissive: 0xC4C4C4,
            overdraw: true
        });

        let cupTop = new THREE.Mesh(cupTopGeometry, cupTopMaterial);
        cupTop.name = 'cupTop';
        cupTop.position.set(0, 1.25, 0);
        cupTop.rotation.x = Math.PI / 2;

        cup.add(cupTop);
        return Object.assign(cup, {
            cupTop: {
                geometry: cupTopGeometry,
                materials: [cupTopMaterial],
                mesh: cupTop
            }
        });
    };

    // The cup body mesh
    let cupBodyMesh = function (cup) {
        /*****************************************************
         *   BODY                                            *
         *****************************************************/

        let cupBodyGeometry = new THREE.CylinderGeometry(1.27, 1, 2.4, 64, 12, true);
        let loader2 = new THREE.TextureLoader();
        loader2.crossOrigin = '*';

        let dotsTexture = loader2.load("img/solojazz.jpg");
        dotsTexture.wrapS = THREE.RepeatWrapping;
        dotsTexture.wrapT = THREE.RepeatWrapping;
        dotsTexture.repeat.set(4.0, 1.50);
        dotsTexture.name = 'cupBodyTexture';

        let cupBodyMaterial = new THREE.MeshBasicMaterial({
            color: 0xFFFFFF,
            side: THREE.DoubleSide,
            overdraw: 0.5
        });
        cupBodyMaterial.name = "cupBodyMaterial";

        let cupBodyMaterialTexture = new THREE.MeshBasicMaterial({
            map: dotsTexture,
            transparent: true,
            overdraw: true
        });
        cupBodyMaterialTexture.name = "cupBodyTexture";

        let cupBodyMaterials = [];

        cupBodyMaterials.push(cupBodyMaterial);
        cupBodyMaterials.push(cupBodyMaterialTexture);

        cupBodyMaterial.vertexColors = THREE.FaceColors;
        cupBodyGeometry.computeFaceNormals();

        let cupBodyMesh = THREE.SceneUtils.createMultiMaterialObject(cupBodyGeometry, cupBodyMaterials);
        cupBodyMesh.name = 'cupBody';
        cup.add(cupBodyMesh);

        return Object.assign(cup, {
            body: {
                geometry: cupBodyGeometry,
                materials: cupBodyMaterials,
                mesh: cupBodyMesh
            }
        });
    };

    let cupLogoMesh = function(cup) {
        /*****************************************************
         *   LOGO                                            *
         *****************************************************/
        // The Logo Faces
        let logoFaceArray = [
            0, 1, 2, 3, 4, 5, 6, 7, 24, 25, 26, 27, 28, 29, 30, 31
            , 48, 49, 50, 51, 52, 53, 54, 55, 72, 73, 74, 75, 76, 77, 78, 79
            , 96, 97, 98, 99, 100, 101, 102, 103, 120, 121, 122, 123, 124, 125, 126, 127
        ];

        let loader = new THREE.TextureLoader();
        loader.crossOrigin = '*';
        let logoTexture =  loader.load('img/red.png');

        logoTexture.wrapS = THREE.ClampToEdgeWrapping;
        logoTexture.wrapT = THREE.ClampToEdgeWrapping;
        let zeroToFive = Math.floor(Math.random()* 5) +1;
        let zeroToOne = Math.floor(Math.random()* 1) +1;
        logoTexture.repeat.set(zeroToOne, zeroToFive);
        logoTexture.name = 'logo';

        let logoMaterial = new THREE.MeshBasicMaterial({
            map: logoTexture,
            transparent: true,
            overdraw: true});
        let logoGeometry = new THREE.Geometry();

        let logoGeometryData = generateGeometry(cup.body.geometry, logoFaceArray);
        logoGeometry.faces = logoGeometryData.faces;
        logoGeometry.vertices = logoGeometryData.vertices;

        logoGeometry.computeFaceNormals();
        logoGeometry.computeVertexNormals();

        logoGeometry.computeBoundingBox();
        let max = logoGeometry.boundingBox.max,
            min = logoGeometry.boundingBox.min;

        let offsetX = (0 - min.x);
        let offsetY = (0 - min.y);
        let range = new THREE.Vector2(Math.atan(max.x / max.z) - Math.atan(min.x / min.z), max.y - min.y);

        let rangeX = range.x + 0.05;
        let rangeY = max.y - min.y;

        logoGeometry.faceVertexUvs[0] = [];
        for (let i = 0; i < logoGeometry.faces.length; i++) {

            let v1 = logoGeometry.vertices[logoGeometry.faces[i].a],
                v2 = logoGeometry.vertices[logoGeometry.faces[i].b],
                v3 = logoGeometry.vertices[logoGeometry.faces[i].c];

            logoGeometry.faceVertexUvs[0].push([
                new THREE.Vector2((Math.atan(v1.x / v1.z) + offsetX) / rangeX, (v1.y + offsetY) / rangeY),
                new THREE.Vector2((Math.atan(v2.x / v2.z) + offsetX) / rangeX, (v2.y + offsetY) / rangeY),
                new THREE.Vector2((Math.atan(v3.x / v3.z) + offsetX) / rangeX, (v3.y + offsetY) / rangeY)
            ]);
        }

        logoGeometry.uvsNeedUpdate = true;

        let logoMesh = new THREE.Mesh(logoGeometry, logoMaterial);
        logoMesh.overdraw = true;
        logoMesh.name = "cupLogo";

        cup.add(logoMesh);

        return Object.assign(cup, {
            logo: {
                mesh: logoMesh,
                geometry: logoGeometry,
                materials: [logoMaterial]
            }
        });
    };

    // The apex of the cup scene object.
    //
    // This builds the cup Object3D from the body, logo, and top
    // submeshes.
    let cup = new THREE.Object3D();
    cup.name = "cup";
    return cupLogoMesh(
        cupBodyMesh(
            cupTopMesh(
                {
                    o3d: cup,
                    name: cup.name,
                    add: add(cup),
                    animate: function() {
                        let render = function() {
                            cup.rotation.x += 0.01;
                            cup.rotation.y += 0.01;
                            renderer.render(scene, camera);
                            requestAnimationFrame(render);
                        };
                        return render;
                    },
                    position: cup.position
                }
            )
        )
    );
};

function generateGeometry(parent, faces) {
    let returnFaces = [],
        returnVertices = [],
        cloneControl = {},
        counter = 0;

    for (let i = 0; i < faces.length; i++) {
        let fA, fB, fC,
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
};

function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize( window.innerWidth, window.innerHeight );
};

zombieSoloJazz().animate();
