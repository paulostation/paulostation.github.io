/*jshint esversion: 6 */

var width = 10;
var height = 7;
// var row = new Array(width);
var maze = new Array(height).fill(new Array(height));
var i = 0;
var lastClosedCell = true;
var buffer = "";
const bias = 50;

var map = new Array(height).fill(new Array(width));

for (var i = 0; i < width; i++) {
    buffer += " _";
}
buffer += "\n";

for (var i = 0; i < height; i++) {
    maze[i] = new Array(width);
}


function initRow(array) {
    let i;
    for (i = 0; i < width; i++) {
        //if row is null, create a new empty set
        if (!array[i]) {
            var obj = {};
            makeSet(obj);
            array[i] = obj;
        }
    }
}

//Working 100%
function createRightWalls(array) {
    let i, r;

    for (i = 0; i < array.length - 1; i++) {
        //prevent loops
        if (find(array[i]) === find(array[i + 1])) {
            array[i].rightWall = true;
            console.log("Same set, created a rightWall on array [" + i + "].");
            continue;
        }
        r = Math.random() * 100;
        if (r < bias) {
            array[i].rightWall = true;
            console.log("Less than 50, created a rightWall on array [" + i + "].");
            continue;
        } else {
            union(array[i], array[i + 1]);
            array[i].rightWall = false;
            console.log("More than 50, didn't create a rightWall on array [" + i + "].");
        }
    }
}

function createDownWalls(array) {
    let i, r, frontier = false;

    for (i = 0; i < array.length; i++) {        
        //If only member of the set do not create a down wall
        if (find(array[i]).rank === 0) {
            console.log("Only member of the set, didn't create a downWall at " + i);            
            array[i].downWall = false;
            continue;
        }

        if(i == (array.length - 1)) {
            frontier = true;
        } else if (find(array[i]) !== find(array[i + 1])){
            frontier = true;
        }
        console.log("Down passages "+ i + ": " + find(array[i]).downPassages);
        if (frontier && find(array[i]).downPassages === 0) {
            console.log("Last closed cell in set, didn't create a downWall at " + i);
            array[i].downWall = false;
            find(array[i]).downPassages++;
            frontier = false;
            continue;
        }
        r = Math.random() * 100;
        if (r < bias) {
            array[i].downWall = false;
            find(array[i]).downPassages++;
            console.log("Didn't create a downWall at " + i);
        } else {
            array[i].downWall = true;
            console.log("Else, created a downWall at " + i);
        }
        // debugger;
    }

    for (i = 0; i < array.length; i++) {
        find(array[i]).downPassages = 0;
    }
}

function createNewRow(array) {
    let i;
    for (i = 0; i < array.length; i++) {
        // console.log("i = " + i);
        //remove all right walls
        array[i].rightWall = false;
        // console.log(array[i].downWall);
        if (array[i].downWall === true) {
            array[i] = null;
            console.log("index " + i + " has down wall, nullifying");
        }
    }
    for (i < 0; i < array.length; i++) {
        array[i].downWall = false;
    }
    return array;
}

function sleep(milliseconds) {
    var start = new Date().getTime();
    for (var i = 0; i < 1e7; i++) {
        if ((new Date().getTime() - start) > milliseconds) {
            break;
        }
    }
}

function printMaze(maze) {
    let i, j;
    console.log(maze);
    for (i = 0; i < height; i++) {
        buffer += "|";
        for (j = 0; j < width; j++) {
            if (maze[i][j] === 0) {
                buffer += "  ";
            } else if (maze[i][j] === 1) {
                buffer += "_ ";
            } else {
                buffer += " |";
            }
        }
        buffer += "\n";
    }
    console.log(buffer);
}

function printRow(row, index) {
    let i, j;
    console.log("Printing row " + index);
    map[index] = [];
    for (i = 0; i < row.length; i++) {
        if (!row[i].downWall && !row[i].rightWall) {
            console.log("No walls on " + i);
            map[index].push(0);
        } else if (row[i].downWall && !row[i].rightWall) {
            console.log("Only down wall on " + i);
            map[index].push(1);
        } else if (!row[i].downWall && row[i].rightWall) {
            console.log("Only right wall on " + i);
            map[index].push(2);
        } else if (row[i].downWall && row[i].rightWall) { 
            console.log("Both walls on " + i);
            map[index].push(3); 
        } else {
            console.log("buguei");
        }
    }
}

// If you decide to complete the maze
// Add a bottom wall to every cell
// Moving from left to right:
// If the current cell and the cell to the right are members of a different set:
// Remove the right wall
// Union the sets to which the current cell and cell to the right are members.
// Output the final row

function completeMaze(array) {
    let i;
    for (i = 0; i < array.length - 1; i++) {
        console.log("Last row, adding a down Wall");
        array[i].downWall = true;
        if (i == (array.length - 1)) {
            console.log("Last cell, nothing else to do");
            return;
        }
        if (find(array[i]) !== find(array[i + 1])) {
            console.log("Members of a different set, removing rightWall");
            array[i].rightWall = false;
            console.log("Union the sets to which the current cell and cell to the right are members.");
            union(array[i], array[i + 1]);
        }
    }
}

function array_copy(array) {
    let new_array = new Array(array.length);
    let i;
    for (i = 0; i < array.length; i++) {
        new_array[i] = array[i];
    }
    return new_array;
}

i = 0;
var row = [];
while (i < height) {
    initRow(row);
    //complete maze and finish
    if (i == (height - 1)) {
        completeMaze(row);
        printRow(row, i);
        break;
    }
    createRightWalls(row);
    createDownWalls(row);
    printRow(row, i);
    createNewRow(row);
    i++;
}

// printMaze(map);

setTimeout(renderMaze, 500);
for (var i = 0; i < map.length; i++)
    console.log(map[i]);

function renderMaze() {


    function addLights() {
        var dirLight = new THREE.DirectionalLight(0xffffff, 1);
        dirLight.position.set(100, 100, 50);
        scene.add(dirLight);
        var ambLight = new THREE.AmbientLight(0x404040);
        scene.add(ambLight);
    }

    var render = function() {
        requestAnimationFrame(render);

        // camera.rotation.x += 0.01;
        renderer.render(scene, camera);
    };

    var scene = new THREE.Scene();
    var camera = new THREE.PerspectiveCamera( 45, width / height, 1, 1000 );
    scene.add( camera );

    // camera.rotation.set(0, 0, 0);
    camera.rotation.x -= Math.PI / 2;
    camera.position.x = height / 2;
    camera.position.y = 15;
    camera.position.z = width / 2;

    var renderer = new THREE.WebGLRenderer();
    renderer.setSize(window.innerWidth, window.innerHeight);
    document.body.appendChild(renderer.domElement);

    // Add lights
    // addLights();

    // controls = new THREE.OrbitControls(camera, renderer.domElement);
    //controls.addEventListener( 'change', render ); // add this only if there is no animation loop (requestAnimationFrame)
    // controls.enableDamping = true;
    // controls.dampingFactor = 0.25;
    // controls.enableZoom = false;


    var geometry;
    var material;

    geometry = new THREE.PlaneGeometry(width, height);

    material = new THREE.MeshLambertMaterial({
        color: 0xFFFFFF,
        side: THREE.DoubleSide
    });

    var piso = new THREE.Mesh(geometry, material);
    piso.rotation.x = Math.PI / 2;
    piso.position.y -= 0.5;
    piso.position.x += width / 2;
    piso.position.x -= 0.5;
    piso.position.z += height / 2;
    scene.add(piso);
    render();

    var wallWidth = 1;
    var wallHeight = 1;

    for (var i = 0; i < height; i++) {
        for (var j = 0; j < width; j++) {
            geometry = new THREE.PlaneGeometry(wallWidth, wallHeight);

            material = new THREE.MeshLambertMaterial({
                color: 0xff0000,
                side: THREE.DoubleSide
            });
            var cerca_vertical = new THREE.Mesh(geometry, material);
            color = (Math.random() * 100000000) % 16777215;
            material = new THREE.MeshLambertMaterial({
                color: 0x0000ff,
                side: THREE.DoubleSide
            });
            var cerca_horizontal = new THREE.Mesh(geometry, material);

            var color = (Math.random() * 100000000) % 16777215;
            material = new THREE.MeshLambertMaterial({
                color: color,
                side: THREE.DoubleSide
            });
            var muro_horizontal = new THREE.Mesh(geometry, material);

            color = (Math.random() * 100000000) % 16777215;
            material = new THREE.MeshLambertMaterial({
                color: color,
                side: THREE.DoubleSide
            });
            var muro_vertical = new THREE.Mesh(geometry, material);

            cerca_horizontal.position.x = (wallWidth * j);
            cerca_horizontal.position.z = (wallWidth * i);

            cerca_vertical.rotation.y = Math.PI / 2;
            cerca_vertical.position.z = (wallWidth * i) + (wallHeight / 2);
            cerca_vertical.position.x = (wallWidth * j) - (wallHeight / 2);

            muro_horizontal.position.x = wallWidth * j;
            muro_horizontal.position.z = wallWidth * i + wallWidth;

            muro_vertical.position.x = wallWidth * i;
            muro_vertical.position.z = wallWidth * j;
            muro_vertical.rotation.y = Math.PI / 2;

            muro_vertical.position.z = (wallWidth * i) + (wallHeight / 2);
            muro_vertical.position.x = (wallWidth * j) + (wallHeight / 2);

            

            console.log("i: " + i + " j: " + j + " value: " + map[i][j]);
            if (map[i][j] === 0) {
                console.log("rendering nofen");
            } else if (map[i][j] == 1 && i != (height - 1)) {
                scene.add(muro_horizontal);
                console.log("rendering downWall");
            } else if (map[i][j] == 2) {
                scene.add(muro_vertical);
                console.log("rendering rightWall");
            } else if(i != (height - 1)) {
                scene.add(muro_vertical);
                scene.add(muro_horizontal);
                console.log("rendering both walls");
            } else {console.log("buguei");}

            if (i === 0) {
                scene.add(cerca_horizontal);
            } else if (i == (height - 1)) {
                cerca_horizontal.position.z += wallWidth;
                scene.add(cerca_horizontal);
            }

            if (j === 0) {
                scene.add(cerca_vertical);
            } else if (j == (width - 1)) {
                cerca_vertical.position.x += wallWidth;
                scene.add(cerca_vertical);
            }
        }
    }

    var light = new THREE.AmbientLight(0xA0A0A0); // soft white light
    scene.add(light);
    render();

}