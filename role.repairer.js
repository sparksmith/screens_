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
            let structure = creep.pos.findClosestByPath(FIND_STRUCTURES, {
                filter: (s) => s.hits < s.hitsMax
                    && s.structureType != STRUCTURE_WALL
                    && s.structureType != STRUCTURE_RAMPART
            });

            if(structure != undefined){
                if(creep.repair(structure) == ERR_NOT_IN_RANGE){
                    creep.moveTo(structure);
                }
            }else {
                roleBuilder.run(creep)
            }
        } else {
            let source = creep.pos.findClosestByPath(FIND_SOURCES_ACTIVE);
            if (creep.harvest(source) == ERR_NOT_IN_RANGE) {
                creep.moveTo(source);
            }
        }
    }
};