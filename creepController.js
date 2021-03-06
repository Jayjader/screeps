require('prototype.creep')();

/** Object called by main to controll creeps
 */
let creepController = {

    /** method to (re)attribute creep roles
     * @param {Object} roleCount
     * a hash of creep roles & their population
     */
    balanceCreepRoles: function (roleCount) {
    },

    /** function that returns how many creeps are occupying each role
     * @param {Array} roles
     * returns a hash of creep roles & their population
     */
    rollCall: function (roles) {
        let counts = {};
        for (let role in roles) {
            counts[role] = _.sum(Game.creeps, (creep) => creep.memory.role === role);
        }
        return counts;
    },

    /** method that gives a creep a work order
     * @param {Creep} creep
     * the creep to be ordered
     */
    workCreep: function (creep) {
        let errcode = undefined;

        // Use carried energy on appropriate target depending on role
        switch (creep.memory.role) {
            case 'harvester':
            case 'gatherer':
                errcode = creep.transfer(creep.memory.target, RESOURCE_ENERGY);
                break;

            case 'builder':
                errcode = creep.build(creep.memory.target);
                break;

            case 'upgrader':
                errcode = creep.upgrade(creep.memory.target);
                break;

            case 'repairer':
                errcode = creep.repair(creep.memory.target);
                break;

        }

        // if the target was out of range, move closer to it
        if (errcode === ERR_NOT_IN_RANGE) {
            creep.moveTo(creep.memory.target);
        }
    },

    /** Main method **/
    run: function () {
        // Count how many creeps are assigned to each role
        let roleCount = this.rollCall(['harvester', 'builder', 'upgrader',
            'repairer', 'gatherer']);
        // Reassign creeps to different roles as needed
        this.balanceCreepRoles(roleCount);

        // Order creeps
        for (let name in Game.creeps) {
            let creep = Game.creeps[name];
            // Creep working <=> creep is carrying energy and is looking to use
            // it
            if (creep.memory.working) {
                // If creep doesn't have a target find one for it
                if (creep.memory.target === undefined) {
                    creep.chooseTargetDepot();
                }

                this.workCreep(creep);

                // if creep is at it's rally point, it becomes available for
                // role reassignment
                if (creep.pos.isEqualTo(Game.flags[creep.memory.rallyPoint])) {
                    creep.memory.available = true;
                }

            }
            // Creep not working <=> creep needs to fill up on energy
            else {
                // If creep doesn't have a target find one for it
                if (creep.memory.target === undefined) {
                    creep.chooseRechargeTarget();
                }

                let errcode = undefined;

                // Try to recharge energy with appropriate method/from
                // appropriate source (according to role)
                switch (creep.memory.role) {
                    case 'harvester':
                        errcode = creep.harvest(creep.memory.target);
                        break;

                    case 'builder':
                    case 'upgrader':
                    case 'repairer':
                    case 'distributor':
                        errcode = creep.withdraw(creep.memory.target, RESOURCE_ENERGY);
                        break;

                    case 'gatherer':
                        errcode = creep.pickup(creep.memory.target);
                        break;
                }

                // if too far away move closer
                if (errcode === ERR_NOT_IN_RANGE) {
                    creep.moveTo(creep.memory.target);
                }
            }
        }
    }
};

module.exports = creepController;
