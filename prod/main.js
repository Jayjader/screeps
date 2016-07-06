var roleHarvester = require('role.harvester');
var roleBuilder = require('role.builder');
var roleUpgrader = require('role.upgrader');

// Main loop
module.exports.loop = function () {

    // Memory clean-up
    for (var name in Memory.creeps) {
        if (!Game.creeps[name]) {
            console.log('Clearing non-existing creep memory: ', name);
            delete Memory.creeps[name];
        }
    }

    // Auto-spawning
    var harvesters = _.filter(Game.creeps, (creep) => creep.memory.role == 'harvester');
    if (harvesters.length < 3) {
        var newName = Game.spawns.Spawn1.createCreep([WORK, CARRY, MOVE],
                undefined, {role : 'harvester'});
        console.log('Spawned new harvester: ' + newName);
    }

    var builders = _.filter(Game.creeps, (creep) => creep.memory.role == 'builder');
    if (builders.length < 2) {
        var newName = Game.spawns.Spawn1.createCreep([WORK, CARRY, MOVE],
                undefined, {role : 'builder'});
        console.log('Spawned new builder: ' + newName);
    }
    
    var upgraders = _.filter(Game.creeps, (creep) => creep.memory.role == 'upgrader');
    if (upgraders.length < 2) {
        var newName = Game.spawns.Spawn1.createCreep([WORK, CARRY, MOVE],
                undefined, {role : 'upgrader'});
        console.log('Spawned new upgrader: ' + newName);
    }

    // Order creeps
    for (creep in Game.creeps) {
        switch (creep.memory.role) {
            case 'harvester':
                roleHarvester.run(creep);
                break;

            case 'builder':
                roleBuilder.run(creep);
                break;

            case 'upgrader':
                roleUpgrader.run(creep);
                break;
        }
    }
}
