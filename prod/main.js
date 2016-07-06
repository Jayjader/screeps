var roleHarvester = require('role.harvester.js');
var roleBuilder = require('role.builder.js');
var roleUpgrader = require('role.upgrader.js');

/* Main loop */
module.exports.loop = function () {

    /* Order creeps */
    for (creep in Game.creeps) {
        switch (creep.memory.role) {
            case 'harvester':
                roleHarvester.run(creep);
                break;

            case 'builder':
                roleBuilder.run(creep);
                break;

            case 'upgrader':
                roleUpgrader.run(creep);
                break;
        }
    }
}
