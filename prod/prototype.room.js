module.exports = function() {
    /** Finds damaged structures
     * @param {float} damageThreshold
     * a float between 0 and 1, represents the health threshold under which a
     * structure needs repair
     **/
    Room.protoype.findDamagedStructures = function(damageThreshold) {
        return this.find(
                FIND_STRUCTURES,
                {filter : (structure) => {
                    switch (structure.structureType) {
                        case STRUCTURE_SPAWN :
                        case STRUCTURE_EXTENSION :
                        case STRUCTURE_TOWER :
                        case STRUCTURE_ROAD :
                            // Repair structures damaged more than 3/4
                            if (structure.hits < (damageThreshold * structure.hitsMax)) {
                                return true;
                            }
                            break;

                        case STRUCTURE_WALL :
                            // Filter out 'newbie' walls (have 1 hp max)
                            if (structure.hitsMax == 1) {
                                return false;
                                break;
                            }
                        case STRUCTURE_RAMPART :
                            // Repair ramparts/walls up to 1k health for now
                            if (structure.hits < 1000) {
                                return true;
                            }
                            break;
                        default:
                            return false;
                            break;
                    }
            }});
    }
};
