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
            var damaged_structs = creep.pos.findClosestByPath(FIND_STRUCTURES, {
                filter : (structure) => {
                    // Repair structures damaged more than 3/4
                    if (structure.hits < 0.75 * structure.hitsMax) {
                        // Only repair my structures for now
                        switch (structure.structureType) {
                            case STRUCTURE_SPAWN:
                            case STRUCTURE_EXTENSION:
                            case STRUCTURE_TOWER:
                            case STRUCTURE_ROAD:
                                return true;
                                break;

                            case STRUCTURE_WALL:
                            default:
                                return false;
                                break;
                        }
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
                creep.say('found nothing to repair, building instead!');
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
