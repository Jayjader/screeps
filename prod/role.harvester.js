/* Create the role as a variable */
var roleHarvester = {

    /** Main function that manages a harvester creep
     *  @param {Creep} creep
     **/
    run : function(creep) {
        // If not carrying max energy look for somewhere to harvest
        if (creep.carry.energy < creep.carryCapacity) {
            creep.say('refilling!');
            var sources = creep.room.find(FIND_SOURCES);
            
            // Try to harvest. If out of range then move closer.
            if (creep.harvest(sources[0]) == ERR_NOT_IN_RANGE) {
                creep.moveTo(sources[0]);
            }
        }
        // If carrying max energy look for somewhere to deposit it
        else {
            creep.say('depositing!');
            var targets = creep.room.find(FIND_MY_STRUCTURES, {
                filter : (structure) => {
                    // Supply structures that can accept additionnal energy
                    if (structure.energy < structure.energyCapacity) {
                        // Only deposit in room-available storage
                        switch (structure.structureType) {
                            case STRUCTURE_SPAWN:
                            case STRUCTURE_EXTENSION:
                                return true;

                            default:
                                return false;
                        }
                    }
                }
            });

            if (targets.length > 0) {
                // If valid target exists try to supply.
                // If out of range move closer.
                if (creep.transfer(targets[0], RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(targets[0]);
                }
            }
        }
    }
};

/* Export the role variable */
module.exports = roleHarvester;
