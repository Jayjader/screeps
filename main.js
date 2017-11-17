// import modules
require('prototype.spawn')();
require('prototype.room')();
let roleHarvester = require('role.harvester');
let roleBuilder = require('role.builder');
let roleUpgrader = require('role.upgrader');
let roleRepairer = require('role.repairer');

// note: role hierarchy: repairer -> builder -> harvester -> upgrader
let hbody = [WORK, WORK, CARRY, MOVE, MOVE];
let ubody = [WORK, WORK, CARRY, MOVE, MOVE];
let bbody = [WORK, WORK, CARRY, MOVE, MOVE];
let rbody = [WORK, CARRY, CARRY, MOVE, MOVE];

function creepNumbers(numHarvesters, numBuilders, numUpgraders, numRepairers) {
    console.log(numHarvesters + ' harvesters; ' +
        +numBuilders + ' builders; ' +
        +numUpgraders + ' upgraders; ' +
        +numRepairers + ' repairers');
}

// Main loop
module.exports.loop = function () {

    // Creep census
    let numHarvesters = _.sum(Game.creeps, (creep) => creep.memory.role === 'harvester');
    let numBuilders = _.sum(Game.creeps, (creep) => creep.memory.role === 'builder');
    let numUpgraders = _.sum(Game.creeps, (creep) => creep.memory.role === 'upgrader');
    let numRepairers = _.sum(Game.creeps, (creep) => creep.memory.role === 'repairer');

    // Memory clean-up
    for (let name in Memory.creeps) {
        if (!Game.creeps[name]) {
            console.log('Clearing non-existing creep memory: ', name);
            delete Memory.creeps[name];
        }
    }

    // Auto-spawning
    let spawner = Game.spawns['Spawn1'];
    if (spawner.memory.creepscreated === undefined || spawner.memory.creepscreated > 3000) {
        spawner.memory.creepscreated = 0;
    }

    let minHarvesters = 2;
    let minBuilders = 2;
    let minUpgraders = 1;
    let minRepairers = 1;

    let creepBuilt = false;

    let energyAvailable = spawner.room.energyAvailable;
    let energyCapacity = spawner.room.energyCapacityAvailable;

    let newname = undefined;

    if (numHarvesters < minHarvesters) {
        // if not enough harvesters, try to spawn the biggest one possible
        newname = spawner.createBiggestBalancedCreep(energyCapacity, 'harvester');

        // if spawning was too ambitious and the base is in 'critical condition'
        if (newname === ERR_NOT_ENOUGH_ENERGY && numHarvesters === 0) {
            // spawn one with what is available
            newname = spawner.createBiggestBalancedCreep(energyAvailable, 'harvester');
        }
    }
    else if (numBuilders < minBuilders) {
        // if not enough builders, try to spawn the biggest one possible
        newname = spawner.createBiggestBalancedCreep(energyCapacity, 'builder');
    }
    else if (numUpgraders < minUpgraders) {
        // if not enough upgraders, try to spawn the biggest one possible
        newname = spawner.createBiggestBalancedCreep(energyCapacity, 'upgrader');
    }
    else if (numRepairers < minRepairers) {
        // if not enough repairers, try to spawn the biggest one possible
        newname = spawner.createBiggestBalancedCreep(energyCapacity, 'repairer');
    }

    if (_.isString(newname)) {
        console.log('Spawning new creep: ' + newname);
        newname = 0;
    }

    switch (newname) {
        case 0 :
            creepBuilt = true;
        case ERR_NAME_EXISTS :
            spawner.memory.creepscreated += 1;
            break;

        case ERR_NOT_ENOUGH_ENERGY :
        case ERR_BUSY :
        case undefined:
            break;

        default :
            console.log('Failed to spawn : ' + newname);
            break;
    }

    if (creepBuilt) {
        creepNumbers(numHarvesters, numBuilders, numUpgraders, numRepairers);
    }
    // Order creeps
    for (let name in Game.creeps) {
        let creep = Game.creeps[name];
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

    // Order Turret(s)
    let turrets = spawner.room.find(FIND_MY_STRUCTURES, {
        filter: (structure) => structure.structureType === STRUCTURE_TOWER
    });

    if (turrets) {
        for (let turret of turrets) {
            // Find enemy creeps and shoot them
            let targets = turret.pos.findClosestByRange(FIND_HOSTILE_CREEPS);
            if (targets) {
                turret.attack(targets[0]);
            }
            else {
                // If no enemy creeps present find damaged friendly creeps to heal
                targets = turret.room.find(FIND_MY_CREEPS);
                if (targets.length > 0) {
                    turret.heal(targets[0]);
                }
                else {
                    // If no friendly creeps damaged find structures to repair
                    targets = turret.room.findDamagedStructures(0.75);
                    if (targets.length > 0) {
                        turret.repair(targets[0]);
                    }
                }
            }
        }
    }
}
