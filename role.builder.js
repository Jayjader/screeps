let roleHarvester = require('role.harvester');

/* Create the role as a letiable */
let roleBuilder = {

    /** Main function that manages a builder creep
     *  @param {Creep} creep
     **/
    run: function (creep) {

        // stop building when out of energy
        if (creep.memory.working && creep.carry.energy === 0) {
            creep.memory.working = false;
            creep.say('refilling!');
        }
        // start building when refilled completely
        if (!creep.memory.working && creep.carry.energy === creep.carryCapacity) {
            creep.memory.working = true;
            creep.say('building!');
        }

        // When building: find something to build
        if (creep.memory.working) {
            let construction_sites = creep.room.find(FIND_CONSTRUCTION_SITES);
            if (construction_sites.length > 0) {
                let site = construction_sites[0];
                // Try to build. If out of range then move closer.
                if (creep.build(site) === ERR_NOT_IN_RANGE) {
                    creep.moveTo(site.pos.x, site.pos.y);
                }
            }
            else {
                roleHarvester.run(creep);
            }
        }
        // When not building: find somewhere to harvest
        else {
            let sources = creep.room.find(FIND_SOURCES);
            // Try to refill. If out of range then move closer.
            if (creep.harvest(sources[0]) === ERR_NOT_IN_RANGE) {
                creep.moveTo(sources[0]);
            }
        }
    }
};

/* Export the role letiable */
module.exports = roleBuilder;
