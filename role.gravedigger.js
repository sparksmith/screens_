let roleBuilder  = require('role.builder');


module.exports = {
    run: function (creep) {
        if (creep.memory.working == true && creep.carry.energy == 0) {
            creep.memory.working = false;
        } else if (creep.memory.working == false && creep.carry.energy == creep.carryCapacity) {
            creep.memory.working = true;
        }

        if (creep.memory.working == true) {
            let strcture = creep.pos.findClosestByPath(FIND_MY_STRUCTURES, {
                filter: (s) => (s.structureType == STRUCTURE_SPAWN
                    || s.structureType == STRUCTURE_EXTENSION
                    || s.structureType == STRUCTURE_TOWER)
                    && s.energy < s.energyCapacity
            });
            if(strcture != undefined){
                if (creep.transfer(strcture, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(strcture);
                }
            }else{
                roleBuilder.run(creep)
            }
        } else {
            let source = creep.pos.findClosestByPath(FIND_SOURCES_ACTIVE);
            let toombstone = creep.pos.findClosestByPath(FIND_TOMBSTONES);
            if(toombstone != null){
                // take the energy from the toombstone
                if(creep.withdraw(toombstone,RESOURCE_ENERGY) == ERR_NOT_IN_RANGE){
                    creep.moveTo(toombstone);
                }
            }else if (creep.harvest(source) == ERR_NOT_IN_RANGE) {
                creep.moveTo(source);
            }
        }
    }
}