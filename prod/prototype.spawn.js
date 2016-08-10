module.exports = function() {
    // Custom createCreep function for auto spawning
    StructureSpawn.prototype.createBiggestBalancedCreep =
        function(energy, roleName) {
            // create a balanced body as big as possible with the given energy
            var numberOfParts = Math.floor(energy / 200);
            var body = [];
            for (let i = 0; i< numberOfParts; i++) {
                body.push(WORK);
            }
            for (let i = 0; i< numberOfParts; i++) {
                body.push(CARRY);
            }
            for (let i = 0; i< numberOfParts; i++) {
                body.push(MOVE);
            }

        // create creep with the generated body and given role
        return this.createCreep(
                body,
                roleName.substring(0,1) + this.memory.creepscreated,
                {
                    role : roleName,
                    working : false
                });
        };
};