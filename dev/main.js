var creepCommander = require('creepCommander');
var creepSpawner = require('creepSpawner');


function cleanMemory() {
    for (var name in Memory.creeps) {
        if (!Game.creeps[name]) {
            console.log('Clearing non-existing creep memory: ', name);
            delete Memory.creeps[name];
        }
    }
}

function creepCensus(roles) {
    var rolecount = {}
    for (var role in roles) {
        rolecount.append(_.filter(Game.creeps,
                    (creep) => creep.memory.role == role));
    }
    return rolecount;
}

var quotas = {
    'harvesters' : { 1:3, 2:5, 3:7 },
    'builders' : { 1:0, 2:5, 3:11 },
    'upgraders' : { 1:2, 2:4, 3:5 }
    'repairers' : { 1:0, 2:1, 3:4 }
}

cleanMemory();
var roleCount = creepCensus(roles);
creepSpawner(quotas, roleCount);

for (var roomname in Game.rooms) {
    var currentRoom = Game.rooms[roomname];

    structureBuilder(currentRoom);
    creepCommander(currentRoom);
}
