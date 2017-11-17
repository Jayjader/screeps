require('prototype.room')();
let roleBuilder = require('role.builder');

/* Create the role as a letiable */
let roleRepairer = {

    /** Main function that manages a repairer creep
     *  @param {Creep} creep
     **/
    run: function (creep) {

        if (creep.memory.working && creep.carry.energy === 0) {
            creep.say('refilling!');
            creep.memory.working = false;
        }

        if (!creep.memory.working && creep.carry.energy === creep.carryCapacity) {
            creep.say('repairing!');
            creep.memory.working = true;
        }
        // When repairing: find something to repair
        if (creep.memory.working) {
            let damaged_structs = creep.room.findDamagedStructures(0.75);

            if (damaged_structs.length > 0) {
                // Sort most to least damaged
                damaged_structs.sort((a, b) => a.hits - b.hits);
                // If valid target exists try to repair.
                // If out of range move closer.
                if (creep.repair(damaged_structs[0]) === ERR_NOT_IN_RANGE) {
                    creep.moveTo(damaged_structs[0]);
                }
            }
            else {
                roleBuilder.run(creep);
            }
        }
        // When not repairing: find somewhere to harvest
        else {
            let sources = creep.room.find(FIND_SOURCES);

            // Try to harvest. If out of range then move closer.
            if (creep.harvest(sources[0]) === ERR_NOT_IN_RANGE) {
                creep.moveTo(sources[0]);
            }
        }
    }
};

/* Export the role letiable */
module.exports = roleRepairer;
