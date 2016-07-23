var roleHarvester = require('role.harvester');
var roleBuilder = require('role.builder');
var roleUpgrader = require('role.upgrader');
var roleRepairer = require('role.repairer');
// require('../ScreepsAutocomplete');

var hbody = [WORK, WORK, CARRY, MOVE];
var ubody = [WORK, WORK, CARRY, MOVE];
var bbody = [WORK, WORK, CARRY, MOVE];
var rbody = [WORK, CARRY, MOVE, MOVE];

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
            creepNumbers(harvesters, builders, upgraders, repairers);
        }
    }

    // Auto-spawning
    var spawner = Game.spawns['Spawn1'];

    var harvesters = _.filter(Game.creeps, (creep) => creep.memory.role == 'harvester');
    var builders = _.filter(Game.creeps, (creep) => creep.memory.role == 'builder');
    var upgraders = _.filter(Game.creeps, (creep) => creep.memory.role == 'upgrader');
    var repairers = _.filter(Game.creeps, (creep) => creep.memory.role == 'repairer');

    var minHarvesters = 2;
    var minBuilders = 3;
    var minUpgraders = 1;
    var minRepairers = 1;

    if (harvesters.length < minHarvesters && !spawner.canCreateCreep(hbody)) {
        creeps += 1;
        var newName = spawner.createCreep(hbody, 'Harvester' + creeps, {role : 'harvester', working = false});
        var message = _.isString(newName) ? 'Spawning new harvester: ' + newName
                                            : 'Failed to spawn harvester. ';
        console.log(message);
        creepNumbers(harvesters, builders, upgraders, repairers);
    }
    else if (builders.length < minBuilders && !spawner.canCreateCreep(bbody)) {
        creeps += 1;
        var newName = spawner.createCreep(bbody, 'Builder' + creeps, {role : 'builder', working = false});
        var message = _.isString(newName) ? 'Spawning new builder: ' + newName
                                            : 'Failed to spawn builder. ';
        console.log(message);
        creepNumbers(harvesters, builders, upgraders, repairers);
    }
    else if (upgraders.length < minUpgraders && !spawner.canCreateCreep(ubody)) {
        creeps += 1;
        var newName = spawner.createCreep(ubody, 'Upgrader' + creeps, {role : 'upgrader', working = false});
        var message = _.isString(newName) ? 'Spawning new upgrader: ' + newName
                                            : 'Failed to spawn upgrader. ';
        console.log(message);
        creepNumbers(harvesters, builders, upgraders, repairers);
    }
    else if (repairers.length < minRepairers && !spawner.canCreateCreep(rbody)) {
        creeps += 1;
        var newName = spawner.createCreep(rbody, 'Repairer' + creeps, {role : 'repairer', working = false});
        var message = _.isString(newName) ? 'Spawning new repairer: ' + newName
                                            : 'Failed to spawn repairer. ';
        console.log(message);
        creepNumbers(harvesters, builders, upgraders, repairers);
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
