/* Create the role as a variable */
var roleupgrader = {

    /** Main function that manages a upgrader creep
     *  @param {Creep} creep
     **/
    run : function(creep) {
    
        // stop upgrading when out of energy
        if (creep.memory.upgrading && creep.carry.energy == 0) {
            creep.memory.upgrading = false;
        }
        // start upgrading when refilled completely
        if (!creep.memory.upgrading && creep.carry.energy == creep.carryCapacity) {
            creep.memory.upgrading = true;
        }

        // When upgrading: find something to upgrade
        if (creep.memory.upgrading) {
            // Try to upgrade. If out of range then move closer.
            if (creep.upgradeController(creep.room.controller) == ERR_NOT_IN_RANGE) {
                creep.moveTo(creep.room.controller);
            }
        }
        // When not upgrading: find somewhere to harvest
        else {
            var sources = creep.room.find(FIND_SOURCES);
            // Try to refill. If out of range then move closer.
            if (creep.harvest(sources[0]) == ERR_NOT_IN_RANGE) {
                creep.moveTo(sources[0]);
            }
        }
    }
};

/* Export the role variable */
module.exports = roleupgrader;
