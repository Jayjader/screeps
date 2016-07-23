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
    console.log(harvesters.length + ' harvesters; ' +
                + builders.length + ' builders; ' +
                + upgraders.length + ' upgraders; ' +
                + repairers.length + ' repairers');
}

function autospawnCreep(spawner, body, name, memory) {
    var errorcode = spawner.createCreep(body, name + spawner.memory.creepscreated, memory);
    switch (errorcode) {
        case name :
        case ERR_NAME_EXISTS :
            spawner.memory.creepscreated += 1;
        case ERR_NOT_ENOUGH_ENERGY :
        case ERR_BUSY :
            break;

        default :
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
            creepBuilt = true;
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

    var creepBuilt = false;

    if (harvesters.length < minHarvesters) {
        autospawnCreep(spawner,
                hbody,
                'Harvester',
                {
                    role : 'harvester',
                    working : false
                });
        creepBuilt = true;
    }
    else if (builders.length < minBuilders) {
        autospawnCreep(spawner,
                bbody,
                'Builder',
                {
                    role : 'builder',
                    working : false
                });
        creepBuilt = true;
    }
    else if (upgraders.length < minUpgraders) {
        autospawnCreep(spawner,
                ubody,
                'Upgrader',
                {
                    role : 'upgrader',
                    working : false
                });
        creepBuilt = true;
    }
    else if (repairers.length < minRepairers) {
        autospawnCreep(spawner,
                rbody,
                'Repairer',
                {
                    role : 'repairer',
                    working : false
                });
        creepBuilt = true;
    }

    if (creepBuilt) {
        creepNumbers(harvesters, builders, upgraders, repairers);
        creepBuilt = false;
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
