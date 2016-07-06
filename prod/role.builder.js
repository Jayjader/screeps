/* Create the role as a variable */
var roleBuilder = {

    /** Main function that manages a builder creep
     *  @param {Creep} creep
     **/
    run : function(creep) {
    
        // stop building when out of energy
        if (creep.memory.building && creep.carry.energy == 0) {
            creep.memory.building = false;
        }
        // start building when refilled completely
        if (!creep.memory.building && creep.carry.energy == creep.carryCapacity) {
            creep.memory.building = true;
        }

        // When building: find something to build
        if (creep.memory.building) {
            var targets = creep.room.find(FIND_CONSTRUCTION_SITES);
            if (targets.length > 0) {
                // Try to build. If out of range then move closer.
                if (creep.build(targets[0]) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(targets[0]);
                }
            }
        }
        // When not building: find somewhere to harvest
        else {
            var sources = creep.room.find(FIND_RESOURCES);
            if (targets.length > 0) {
                // Try to build. If out of range then move closer.
                if (creep.build(sources[0]) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(sources[0]);
                }
            }
        }
    }
};

/* Export the role variable */
module.exports = roleBuilder;
