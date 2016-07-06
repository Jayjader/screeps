var roleHarvester = require('role.harvester');
var roleBuilder = require('role.builder');
var roleUpgrader = require('role.upgrader');
var roleRepairer = require('role.repairer');

function  creepNumbers(harvesters, builders, upgraders, repairers) {
    console.log( + builders.length + ' builders; ' +
                + harvesters.length + ' harvesters; ' +
                + upgraders.length + ' upgraders; ' +
                + repairers.length + ' repairers');
}

var creeps = 0;
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
    var spawner = Game.spawns['Spawn1'];

    var harvesters = _.filter(Game.creeps, (creep) => creep.memory.role == 'harvester');
    var builders = _.filter(Game.creeps, (creep) => creep.memory.role == 'builder');
    var upgraders = _.filter(Game.creeps, (creep) => creep.memory.role == 'upgrader');
    var repairers = _.filter(Game.creeps, (creep) => creep.memory.role == 'repairer');
    creepNumbers(harvesters, builders, upgraders, repairers);

    if (harvesters.length < 2 && !spawner.canCreateCreep([WORK, CARRY, MOVE])) {
        creeps += 1;
        var newName = spawner.createCreep([WORK, CARRY, MOVE],
                'Harvester' + creeps, {role : 'harvester'});
        var message = _.isString(newName) ? 'Spawning new harvester: ' + newName
                                            : 'Failed to spawn harvester. ';
        console.log(message);
    }
    else if (builders.length < 4 && !spawner.canCreateCreep([WORK, CARRY, MOVE])) {
        creeps += 1;
        var newName = spawner.createCreep([WORK, CARRY, MOVE],
                'Builder' + creeps, {role : 'builder'});
        var message = _.isString(newName) ? 'Spawning new builder: ' + newName
                                            : 'Failed to spawn builder. ';
        console.log(message);
    }
    else if (upgraders.length < 1 && !spawner.canCreateCreep([WORK, CARRY, MOVE])) {
        creeps += 1;
        var newName = spawner.createCreep([WORK, CARRY, MOVE],
                'Upgrader' + creeps, {role : 'upgrader'});
        var message = _.isString(newName) ? 'Spawning new upgrader: ' + newName
                                            : 'Failed to spawn upgrader. ';
        console.log(message);
    }
    else if (repairers.length < 1 && !spawner.canCreateCreep([WORK, CARRY, MOVE])) {
        creeps += 1;
        var newName = spawner.createCreep([WORK, CARRY, MOVE],
                'Repairer' + creeps, {role : 'repairer'});
        var message = _.isString(newName) ? 'Spawning new repairer: ' + newName
                                            : 'Failed to spawn repairer. ';
        console.log(message);
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

            case 'repairer':
                roleRepairer.run(creep);
                break;
        }
    }
}
