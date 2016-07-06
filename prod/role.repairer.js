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
            creep.say('Looking for repair!');
            console.log(creep.name + ' looking for repair');
            var targets = creep.room.find(FIND_STRUCTURES, {
                filter : (structure) => {
                    // Supply structures that can accept additionnal energy
                    if (structure.hits < structure.hitsMax) {
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

            if (targets.length > 0) {
                creep.say('found repair!');
                // If valid target exists try to repair.
                // If out of range move closer.
                if (creep.repair(targets[0]) == ERR_NOT_IN_RANGE) {
                    creep.say('moving towards damaged structure...');
                    creep.moveTo(targets[0]);
                }
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
