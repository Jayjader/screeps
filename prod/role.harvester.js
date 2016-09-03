var roleUpgrader = require('role.upgrader');

/* Create the role as a variable */
var roleHarvester = {

    /** Main function that manages a harvester creep
     *  @param {Creep} creep
     **/
    run : function(creep) {

        // If not carrying any energy stop working
        if (creep.memory.working && creep.carry.energy == 0) {
            creep.memory.working = false;
        }

        // If carrying max energy start working
        if (!creep.memory.working && creep.carry.energy == creep.carryCapacity) {
            creep.memory.working = true;
        }

        if (creep.memory.working) {
            if (creep.room.energyAvailable < creep.room.energyCapacityAvailable) {
            var targets = creep.room.find(FIND_MY_STRUCTURES, {
                filter : (structure) => {
                    // Supply structures that can accept additionnal energy
                    if (structure.energy < structure.energyCapacity) {
                        // Only deposit in room-available storage
                        switch (structure.structureType) {
                            case STRUCTURE_SPAWN:
                            case STRUCTURE_EXTENSION:
                            case STRUCTURE_TOWER:
                                return true;

                            default:
                                return false;
                        }
                    }
                }
            });

                // If valid target exists try to supply.
                // If out of range move closer.
                if (creep.transfer(targets[0], RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(targets[0]);
                }
            }
            else {
                roleUpgrader.run(creep);
            }
        }
        else {
            var sources = creep.room.find(FIND_SOURCES, {
                filter : (source) => {return source.energy > 0}
                }});

            // Try to harvest. If out of range then move closer.
            if (creep.harvest(sources[0]) == ERR_NOT_IN_RANGE) {
                creep.moveTo(sources[0]);
            }
        }
    }
};

/* Export the role variable */
module.exports = roleHarvester;
