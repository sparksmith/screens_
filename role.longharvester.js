module.exports = {
    run: function (creep) {
        //state switching
        if (creep.memory.working == true && creep.carry.energy == 0) {
            creep.memory.working = false;
        } else if (creep.memory.working == false && creep.carry.energy == creep.carryCapacity) {
            creep.memory.working = true;
        }

        if (creep.memory.working == true) {
            // go to room
            if(creep.room.name == creep.memory.home) {
                let strcture = creep.pos.findClosestByPath(FIND_MY_STRUCTURES, {
                    filter: (s) => (s.structureType == STRUCTURE_SPAWN
                        || s.structureType == STRUCTURE_EXTENSION
                        || s.structureType == STRUCTURE_TOWER
                        || s.structureType == STRUCTURE_STORAGE)
                        && s.energy < s.energyCapacity
                });
                // go transfer
                if (strcture != undefined) {
                    if (creep.transfer(strcture, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                        creep.moveTo(strcture);
                    }
                }
            }else{
                // go back home !
                let exit = creep.room.findExitTo(creep.memory.home);
                creep.moveTo(creep.pos.findClosestByRange(exit));
            }
        } else {
            if(creep.room.name == creep.memory.target) {
                let source = creep.room.find(FIND_SOURCES)[creep.memory.source];
                if (creep.harvest(source) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(source);
                }
            }else{
                let exit = creep.room.findExitTo(creep.memory.target);
                creep.moveTo(creep.pos.findClosestByRange(exit));
            }
        }
    }
};