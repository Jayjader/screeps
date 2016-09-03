require('prototype.room')();

module.exports = function() {

    /** function that decides for a given creep where to recharge when low
     * on energy
     * @param {Creep} creep
     * @returns {RoomObject}
     * the RoomObject the creep should move to & recharge from
     **/
    Creep.prototype.chooseRechargeTarget = function() {
        var target = undefined;

        // Target depends on creep role
        switch (this.memory.role) {
            case 'harvester':
                // If the room can hold more energy
                if (this.room.energyAvailable < this.room.energyCapacityAvailable || _.sum(this.room.storage.store) < this.room.storage.storeCapacity) {
                    // find the most appropriate energy source
                    target = Game.flags[this.memory.rallyPoint].pos.findClosestByRange(FIND_SOURCES);
                }
                // Else move away from the source
                else {
                    target = Game.flags[this.memory.rallyPoint];
                }
                break;

            case 'builder':
            case 'upgrader':
            case 'repairer':
                // if storage has been built recharge from storage first
                if (this.room.storage != undefined) {
                    target = this.room.storage;
                }
                // else go mine
                else {
                    target = this.pos.findClosestByRange(FIND_SOURCES);
                }
                break;

            case 'gatherer':
                // If there is some energy on the ground, pick it up first
                var droppedEnergy = this.room.findClosestByRange(FIND_DROPPED_RESOURCES);
                if (droppedEnergy.length > 0) {
                    target = droppedEnergy[0];
                }
                // Otherwise go to rally point
                else {
                    target = creep.memory.rallyPoint;
                }

            case 'distributor':
                // Recharge from link
                target = this.pos.findClosestByRange(FIND_MY_STRUCTURES, {
                    filter : (structure) => {
                        return (structure.structureType == STRUCTURE_LINK);
                    }
                });
                break;

            default:
                target = Game.flags[this.memory.rallyPoint];
                break;

        }

        // In case no 'valid' target exists/can be found, move to rally point
        // to move out of the way of others
        if (target == undefined) {
            target = Game.flags[this.memory.rallyPoint];
        }

        this.memory.target = target;
    },

    /** function that decides for a given creep where to transfer carried energy
     * @param {Creep} creep
     * @returns {RoomObject}
     * the RoomObject the creep should move to & WORK on
     **/
    Creep.prototype.chooseTargetDepot = function() {
        var target = undefined;

        // Target depends on creep role
        switch (this.memory.role) {
            case 'harvester':
                target = this.pos.findClosestByRange(FIND_MY_STRUCTURES, {
                    filter : (structure) => {
                        switch (structure.structureType) {
                            case STRUCTURE_LINK:
                            case STRUCTURE_EXTENSION:
                            case STRUCTURE_SPAWN:
                            case STRUCTURE_STORAGE:
                            case STRUCTURE_CONTAINER:
                            case STRUCTURE_TOWER:
                                return structure.energyCapacityAvailable >
                                    structure.energyAvailable;
                                break;

                            default:
                                return false;
                                break;
                        }
                    }
                }

                if (target == undefined) {
                    target = Game.flags[this.memory.rallyPoint];
                }
                break;

            case 'upgrader':
                target = this.room.controller;
                break;

            case 'builder':
                target = this.pos.findClosestByRange(FIND_CONSTRUCTION_SITES);
                break;

            case 'repairer':
                target = this.room.findDamagedStructures(0.9);
                break;
        }

        if (target == undefined) {
            target = Game.flags[this.memory.rallyPoint];
        }

        this.memory.target = target;
    },

    };
}
