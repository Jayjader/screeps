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
    console.log('harvesters: ' + harvesters.length);

    if (harvesters.length < 3) {
        var newName = Game.spawns.Spawn1.createCreep([WORK, CARRY, MOVE],
                undefined, {role : 'harvester'});
        var message = (newName > 0) ? 'Spawned new harvester: ' : 'Failed to spawn harvester: ';
        console.log(message + newName);
    }

    var builders = _.filter(Game.creeps, (creep) => creep.memory.role == 'builder');
    console.log('builders: ' + builders.length);
    if (builders.length < 2 && harvesters.length > 2) {
        var newName = Game.spawns.Spawn1.createCreep([WORK, CARRY, MOVE],
                undefined, {role : 'builder'});
        var message = (newName > 0) ? 'Spawned new builder: '
                                    : 'Failed to spawn builder: ';
        console.log(message + newName);
    }

    var upgraders = _.filter(Game.creeps, (creep) => creep.memory.role == 'upgrader');
    if (upgraders.length < 2 && harvesters.length > 2) {
        var newName = Game.spawns.Spawn1.createCreep([WORK, CARRY, MOVE],
                undefined, {role : 'upgrader'});
        var message = (newName > 0) ? 'Spawned new upgrader: '
                                    : 'Failed to spawn upgrader: ';
        console.log(message + newName);
    }

    // Order creeps
    for (var name in Game.creeps) {
        var creep = Game.creeps[name];
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
