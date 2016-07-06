/* Create the role as a variable */
var roleRepairer = {

    /** Main function that manages a repairer creep
     *  @param {Creep} creep
     **/
    run : function(creep) {
        // If not carrying max energy look for somewhere to harvest
        if (creep.carry.energy < creep.carryCapacity) {
            var sources = creep.room.find(FIND_SOURCES);
            
            // Try to harvest. If out of range then move closer.
            if (creep.harvest(sources[0]) == ERR_NOT_IN_RANGE) {
                creep.moveTo(sources[0]);
            }
        }
        // If carrying max energy look for something to repair
        else {
            var targets = creep.room.find(FIND_STRUCTURES, {
                filter : (structure) => {
                    // Supply structures that can accept additionnal energy
                    if (structure.hits < structure.hitsMax) {
                        // Only deposit in room-available storage
                        switch (structure.structureType) {
                            case STRUCTURE_ROAD:
                                return true;

                            default:
                                return false;
                        }
                    }
                }
            });

            if (targets.length > 0) {
                // If valid target exists try to repair.
                // If out of range move closer.
                if (creep.repair(targets[0], RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(targets[0]);
                }
            }
        }
    }
};

/* Export the role variable */
module.exports = roleRepairer;
