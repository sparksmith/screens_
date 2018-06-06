let roleBuilder  = require('role.builder');

module.exports = {
    run: function (creep, target) {
        // state switch )when working when idle etc.
        if (creep.memory.working == true && creep.carry.energy == 0) {
            creep.memory.working = false;
        } else if (creep.memory.working == false && creep.carry.energy == creep.carryCapacity) {
            creep.memory.working = true;
        }

        if (creep.memory.working == true) {
            // where the builder is working
            for(let percentage = 0.0001; percentage <= 1; percentage = percentage+0.0001){
                target = creep.pos.findClosestByPath(FIND_STRUCTURES, {
                    filter: (s) => (s.structureType == STRUCTURE_WALL || s.structureType == STRUCTURE_RAMPART)
                        && s.hits / s.hitsMax < percentage
                });
                if(target != undefined){
                    break;
                }
            }
            if(target != undefined){
                if(creep.repair(target) == ERR_NOT_IN_RANGE){
                    creep.moveTo(target);
                }
            }else {
                roleBuilder.run(creep)
            }
        } else {
            let source = creep.pos.findClosestByPath(FIND_SOURCES_ACTIVE);
            if (creep.harvest(source) === ERR_NOT_IN_RANGE) {
                creep.moveTo(source);
            }
        }
    }
};