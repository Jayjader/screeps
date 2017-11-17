module.exports = function () {
    // Custom createCreep function for auto spawning
    /** Creates the biggest creep with equal WORK, CARRY & MOVE parts possible
     * with the energy given
     * @param {int} energy
     * max energy to be used
     * @param {string} roleName
     * spawned creep's role's name
     **/
    StructureSpawn.prototype.createBiggestBalancedCreep = function (energy, roleName) {
        // create a balanced body as big as possible with the given energy
        let numberOfParts = Math.floor(energy / 200);
        let body = [];
        for (let i = 0; i < numberOfParts; i++) {
            body.push(WORK);
        }
        for (let i = 0; i < numberOfParts; i++) {
            body.push(CARRY);
        }
        for (let i = 0; i < numberOfParts; i++) {
            body.push(MOVE);
        }

        // create creep with the generated body and given role
        return this.createCreep(
            body,
            roleName.substring(0, 1) + this.memory.creepscreated,
            {
                role: roleName,
                working: false
            });
    };
};
