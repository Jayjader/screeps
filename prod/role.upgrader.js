/* Create the role as a letiable */
let roleUpgrader = {

    /** Main function that manages a upgrader creep
     *  @param {Creep} creep
     **/
    run: function (creep) {

        // stop upgrading when out of energy
        if (creep.memory.working && creep.carry.energy === 0) {
            creep.memory.working = false;
            creep.say('refilling!');
        }
        // start upgrading when refilled completely
        if (!creep.memory.working && creep.carry.energy === creep.carryCapacity) {
            creep.memory.working = true;
            creep.say('upgrading!');
        }

        // When upgrading: find something to upgrade
        if (creep.memory.working) {
            // Try to upgrade. If out of range then move closer.
            if (creep.upgradeController(creep.room.controller) === ERR_NOT_IN_RANGE) {
                creep.moveTo(creep.room.controller);
            }
        }
        // When not upgrading: find somewhere to harvest
        else {
            let sources = creep.room.find(FIND_SOURCES);
            // Try to refill. If out of range then move closer.
            if (creep.harvest(sources[0]) === ERR_NOT_IN_RANGE) {
                creep.moveTo(sources[0]);
            }
        }
    }
};

/* Export the role letiable */
module.exports = roleUpgrader;
