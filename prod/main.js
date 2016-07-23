var roleHarvester = require('role.harvester');
var roleBuilder = require('role.builder');
var roleUpgrader = require('role.upgrader');
var roleRepairer = require('role.repairer');
// require('../ScreepsAutocomplete');

// note: role hierarchy: repairer -> builder -> harvester -> upgrader
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

function autospawnCreep(spawner, body, name, memory) {
    var errorcode = spawner.createCreep(body, name, memory);
    if (errorcode != name) {
        console.log('Failed to spawn ' + name + ': ' + errorcode);
    }
}

// Main loop
module.exports.loop = function () {

    // Creep census
    var harvesters = _.filter(Game.creeps, (creep) => creep.memory.role == 'harvester');
    var builders = _.filter(Game.creeps, (creep) => creep.memory.role == 'builder');
    var upgraders = _.filter(Game.creeps, (creep) => creep.memory.role == 'upgrader');
    var repairers = _.filter(Game.creeps, (creep) => creep.memory.role == 'repairer');

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
    if (spawner.memory.creepscreated == undefined) {
        spawner.memory.creepscreated = 0;
    }

    var minHarvesters = 5;
    var minBuilders = 7;
    var minUpgraders = 3;
    var minRepairers = 2;

    if (harvesters.length < minHarvesters && !spawner.canCreateCreep(hbody)) {
        spawner.memory.creepscreated += 1;
        autospawnCreep(hbody,
                'Harvester' + spawner.memory.creepscreated, {
                    role : 'harvester',
                    working : false
                });
        creepNumbers(harvesters, builders, upgraders, repairers);
    }
    else if (builders.length < minBuilders && !spawner.canCreateCreep(bbody)) {
        spawner.memory.creepscreated += 1;
        autospawnCreep(bbody,
                'Builder' + spawner.memory.creepscreated,
                {
                    role : 'builder',
                    working : false
                });
        creepNumbers(harvesters, builders, upgraders, repairers);
    }
    else if (upgraders.length < minUpgraders && !spawner.canCreateCreep(ubody)) {
        spawner.memory.creepscreated += 1;
        autospawnCreep(ubody,
                'Upgrader' + spawner.memory.creepscreated,
                {
                    role : 'upgrader',
                    working : false
                });
        creepNumbers(harvesters, builders, upgraders, repairers);
    }
    else if (repairers.length < minRepairers && !spawner.canCreateCreep(rbody)) {
        spawner.memory.creepscreated += 1;
        autospawnCreep(rbody,
                'Repairer' + spawner.memory.creepscreated,
                {
                    role : 'repairer',
                    working : false
                });
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
