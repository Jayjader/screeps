module.exports = function () {
    /** Finds damaged structures
     * @param {number} damageThreshold
     * a float between 0 and 1, represents the health threshold under which a
     * structure needs repair
     **/
    Room.prototype.findDamagedStructures = function (damageThreshold) {
        return this.find(
            FIND_STRUCTURES,
            {
                filter: (structure) => {
                    switch (structure.structureType) {
                        case STRUCTURE_SPAWN :
                        case STRUCTURE_EXTENSION :
                        case STRUCTURE_TOWER :
                        case STRUCTURE_ROAD :
                            // Repair structures damaged more than 3/4
                            return structure.hits < (damageThreshold * structure.hitsMax);
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
