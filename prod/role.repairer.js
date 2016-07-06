var roleBuilder = require('role.builder');

/* Create the role as a variable */
var roleRepairer = {

    /** Main function that manages a repairer creep
     *  @param {Creep} creep
     **/
    run : function(creep) {

        if (creep.memory.repairing && creep.carry.energy == 0) {
            creep.say('refilling!');
            creep.memory.repairing = false;
        }

        if (!creep.memory.repairing && creep.carry.energy == creep.carryCapacity) {
            creep.say('repairing!');
            creep.memory.repairing = true;
        }
        // WHen repairing: find something to repair
        if (creep.memory.repairing) {
            console.log(creep.name + ' looking for repair');
            var damaged_structs = creep.room.find(FIND_STRUCTURES, {
                filter : (structure) => {
                    // Supply structures that can accept additionnal energy
                    if (structure.hits < 0.75 * structure.hitsMax) {
                        // Only deposit in room-available storage
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
