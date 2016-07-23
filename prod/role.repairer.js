var roleBuilder = require('role.builder');

/* Create the role as a variable */
var roleRepairer = {

    /** Main function that manages a repairer creep
     *  @param {Creep} creep
     **/
    run : function(creep) {

        if (creep.memory.working && creep.carry.energy == 0) {
            creep.say('refilling!');
            creep.memory.working = false;
        }

        if (!creep.memory.working && creep.carry.energy == creep.carryCapacity) {
            creep.say('repairing!');
            creep.memory.working = true;
        }
        // WHen repairing: find something to repair
        if (creep.memory.working) {
            var damaged_structs = creep.room.find(FIND_STRUCTURES, {
                filter : (structure) => {
                        switch (structure.structureType) {
                            case STRUCTURE_SPAWN:
                            case STRUCTURE_EXTENSION:
                            case STRUCTURE_TOWER:
                            case STRUCTURE_ROAD:
                                // Repair structures damaged more than 3/4
                                if (structure.hits < 0.75 * structure.hitsMax) {
                                    return true;
                                }
                                break;

                            case STRUCTURE_WALL:
                                // Filter out 'newbie' walls (have 1 hp max)
                                if (structure.hitsMax > 1) {
                                    // Repair walls up to 1k health for now
                                    if (structure.hits < 1000) {
                                        return true;
                                    }
                                }
                            default:
                                return false;
                                break;
                        }
                    }
            });

            if (damaged_structs.length > 0) {
                // Sort most to least damaged
                damaged_structs.sort((a,b) => a.hits - b.hits);
                // If valid target exists try to repair.
                // If out of range move closer.
                if (creep.repair(damaged_structs[0]) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(damaged_structs[0]);
                }
            }
            else {
                roleBuilder.run(creep);
            }
        }
        // When not repairing: find somewhere to harvest
        else {
            var sources = creep.room.find(FIND_SOURCES);

            // Try to harvest. If out of range then move closer.
            if (creep.harvest(sources[0]) == ERR_NOT_IN_RANGE) {
                creep.moveTo(sources[0]);
            }
        }
    }
};

/* Export the role variable */
module.exports = roleRepairer;
