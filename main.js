// PROD

// setup
require('prototype.spawn')();
var roleHarvester = require('role.harvester');
var roleUpgrader  = require('role.upgrader');
var roleBuilder   = require('role.builder');
var roleRepairer  = require('role.repairer');
var roleWallRepairer = require('role.wallrepairer');

// number of Harvesters
var minimumNumberOfHarvesters = 1;
var numberOfHarvesters = _.sum(Game.creeps, (c)=>c.memory.role == 'harvester');

// Number of Upgraders
var minimumNumberOfUpgraders = 1;
var numberOfUpgraders = _.sum(Game.creeps, (c)=>c.memory.role == 'upgrader');

// Number of Builders
var minimumNumberOfBuilders = 1;
var numberOfBuilders = _.sum(Game.creeps, (c)=>c.memory.role == 'builder');

// Number of Repairers
var minimumNumberOfRepairers = 1;
var numberOfRepairer = _.sum(Game.creeps, (c)=>c.memory.role == 'repairer');

// Number of Wall Fixers
var minimumNumberOfWallRepairers = 1;
var numberOfWallRepairers = _.sum(Game.creeps, (c)=>c.memory.role == 'wallrepairer');

// our spawn (main)
var spawn = Game.spawns.First;
var flip = 0;

// main
module.exports.loop = function () {
        // drop some numbers.
        if (flip%3==0){
            console.log("Harvesters["+numberOfHarvesters
            +"]Upgraders["+numberOfUpgraders
            +"]Builders["+numberOfBuilders
            +"]Repairer["+numberOfRepairer
            +"]WallRepairer["+numberOfWallRepairers
            +"]")
            // skip 1 rotation
            flip++;
        }
    
    // clear memory
    for(let name in Memory.creeps){
        if (Game.creeps[name] == undefined){
            delete Memory.creeps[name]
        }
    }

    // for each creep -> do the job
    for (let name in Game.creeps) {
        var creep = Game.creeps[name];

        if (creep.memory.role == 'harvester') {
            roleHarvester.run(creep);
        } else if (creep.memory.role == 'upgrader') {
            roleUpgrader.run(creep);
        } else if (creep.memory.role == 'builder' ){
            roleBuilder.run(creep);
        } else if (creep.memory.role == 'repairer'){
            roleRepairer.run(creep);
        }else if (creep.memory.role == 'wallrepairer'){
            roleWallRepairer.run(creep);
        }
    }

    // make towers defend
    var towers = Game.rooms.W21N54.find(FIND_STRUCTURES, {
        filter: (s) => s.structureType == STRUCTURE_TOWER
    });
    for (let tower of towers){
        var target = tower.pos.findClosestByRange(FIND_HOSTILE_CREEPS);
        if(target != undefined){
            tower.attack(target);
        }
    }

    // Spawn Control
    var name = undefined;
    var energy = spawn.room.energyCapacityAvailable;

    // order spawner by priority
    if (numberOfHarvesters < minimumNumberOfHarvesters) {
        name = spawn.createCustomCreep(energy, 'harvester')
        // if everything is dead :(
        if(name == ERR_NOT_ENOUGH_ENERGY && numberOfHarvesters ==0){
            name = spawn.createCustomCreep(spawn.room.energyAvailable, 'harvester')
        }
    }else if (numberOfUpgraders < minimumNumberOfUpgraders){
        name = spawn.createCustomCreep(energy, 'upgrader')
    }else if(numberOfRepairer < minimumNumberOfRepairers){
        name = spawn.createCustomCreep(energy, 'repairer')
    } else if (numberOfBuilders < minimumNumberOfBuilders) {
        name = spawn.createCustomCreep(energy, 'builder')
    }else if(numberOfWallRepairers < minimumNumberOfWallRepairers){
        name = spawn.createCustomCreep(energy, 'wallrepairer')
    }else{
        name = spawn.createCustomCreep(energy, 'builder')
    }

    if (!(name != 0)){
        console.log("Spawned new creep: "+name);
    }
}