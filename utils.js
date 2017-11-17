/**
 * Extra functions
 **/
let utils = {
    /** Finds damaged structures
     * @param {number} damageThreshold
     * A number from 0 to 1 representing the amount the structure must be damaged before it qualifies for repairing
     **/
    findDamagedStructures: function (damageThreshold) {
        return creep.room.find(
            FIND_STRUCTURES,
            {
                filter: (structure) => {
                    switch (structure.structureType) {
                        case STRUCTURE_SPAWN :
                        case STRUCTURE_EXTENSION :
                        case STRUCTURE_TOWER :
                        case STRUCTURE_ROAD :
                            // Repair structures damaged more than 3/4
                            if (structure.hits < damageThreshold * structure.hitsMax) {
                                return true;
                            }
                            break;

                        case STRUCTURE_WALL :
                            // Filter out 'newbie' walls (have 1 hp max)
                            return structure.hitsMax === 1;
                        case STRUCTURE_RAMPART :
                            // Repair ramparts/walls up to 1k health for now
                            return structure.hits < 1000;
                        default:
                            return false;
                    }
                }
            });
    }
};
module.exports = utils;
