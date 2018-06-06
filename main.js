// PROD

// setup
require('prototype.spawn')();
let roleHarvester = require('role.harvester');
let roleUpgrader  = require('role.upgrader');
let roleBuilder   = require('role.builder');
let roleRepairer  = require('role.repairer');
let roleWallRepairer = require('role.wallrepairer');
let roleLongDistanceHarvester = require('role.longharvester');
let roleGraveDigger = require('role.gravedigger');

// number of Harvesters
let minimumNumberOfHarvesters = 1;
// Number of Upgraders
let minimumNumberOfUpgraders = 1;
// Number of Builders
let minimumNumberOfBuilders = 1;
// Number of Repairers
let minimumNumberOfRepairers = 1;
// Number of Wall Fixers
let minimumNumberOfWallRepairers = 1;
// Number of Long Distance Harvesters
let minimumNumberOfLongDistanceHarvesters = 3;
// Number of Grave Diggers
let minimumNumberOfGraveDiggers = 1;

// Number of Creeps
let numberOfHarvesters = _.sum(Game.creeps, (c)=>c.memory.role == 'harvester');
let numberOfUpgraders = _.sum(Game.creeps, (c)=>c.memory.role == 'upgrader');
let numberOfBuilders = _.sum(Game.creeps, (c)=>c.memory.role == 'builder');
let numberOfRepairer = _.sum(Game.creeps, (c)=>c.memory.role == 'repairer');
let numberOfWallRepairers = _.sum(Game.creeps, (c)=>c.memory.role == 'wallrepairer');
let numberOfLongDistanceHarvesters = _.sum(Game.creeps, (c)=>c.memory.role == 'longharvester');
let numberOfGraveDiggers = _.sum(Game.creeps, (c)=>c.memory.role == 'gravedigger');

// our spawn (main)
let spawn = Game.spawns.First;
let home = 'W21N54'
let target = [{"name":'W21N53',"index":0}, {"name":'W22N54',"index":0}, {"name":'W22N54',"index":1}];
let flip = 0;

// main
module.exports.loop = function () {
        // drop some numbers.
        if (flip%40==0){
            console.log("Harvesters["+numberOfHarvesters
            +"]Upgraders["+numberOfUpgraders
            +"]Builders["+numberOfBuilders
            +"]Repairer["+numberOfRepairer
            +"]WallRepairer["+numberOfWallRepairers
            +"]Long Distance Harvester["+numberOfLongDistanceHarvesters
            +"]GraveDigger["+numberOfGraveDiggers
            +"]");
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
        let creep = Game.creeps[name];
        
        switch (creep.memory.role) {
            case 'harvester': roleHarvester.run(creep);break;
            case 'upgrader': roleUpgrader.run(creep);break;
            case 'builder': roleBuilder.run(creep);break;
            case 'repairer': roleRepairer.run(creep);break;
            case 'wallrepairer': roleWallRepairer.run(creep);break;
            case 'longharvester': roleLongDistanceHarvester.run(creep);break;
            case 'gravedigger': roleGraveDigger.run(creep);break;
        }
    }

    // make towers defend
    let towers = Game.rooms[home].find(FIND_STRUCTURES, {
        filter: (s) => s.structureType == STRUCTURE_TOWER
    });
    for (let tower of towers){
        let target = tower.pos.findClosestByRange(FIND_HOSTILE_CREEPS);
        if(target != undefined){
            tower.attack(target);
        }
    }

    // Spawn Control
    let name = undefined;
    let energy = spawn.room.energyCapacityAvailable;

    // order spawner by priority
    if (numberOfHarvesters < minimumNumberOfHarvesters) {
        //console.log('Building a new harverster');
        name = spawn.createCustomCreep(energy, 'harvester')
        // if everything is dead :(
        if(name == ERR_NOT_ENOUGH_ENERGY && numberOfHarvesters ==0){
            name = spawn.createCustomCreep(spawn.room.energyAvailable, 'harvester')
        }
    }else if(numberOfLongDistanceHarvesters < minimumNumberOfLongDistanceHarvesters){
        //console.log('Building a new long distance harvester');
        
        name = spawn.createLongDistanceHarvester(energy, 5, home, 
        target[numberOfLongDistanceHarvesters%target.length].name, 
        target[numberOfLongDistanceHarvesters%target.length].index)
        
    }else if (numberOfUpgraders < minimumNumberOfUpgraders){
        //console.log('Building a new upgrader');
        name = spawn.createCustomCreep(energy, 'upgrader');
    }else if(numberOfRepairer < minimumNumberOfRepairers){
        //console.log('Building a new repairer');
        name = spawn.createCustomCreep(energy, 'repairer');
    } else if (numberOfBuilders < minimumNumberOfBuilders) {
        //console.log('Building a new builder');
        name = spawn.createCustomCreep(energy, 'builder');
    }else if(numberOfWallRepairers < minimumNumberOfWallRepairers){
        //console.log('Building a new wall repairer');
        name = spawn.createCustomCreep(energy, 'wallrepairer');
    }else if(numberOfGraveDiggers < minimumNumberOfGraveDiggers){
        //console.log('Building a new grave digger');
        name = spawn.createCustomCreep(energy, 'gravedigger');
    }else{
        //console.log('Last Resort - Building a new builder');
        name = spawn.createCustomCreep(energy, 'builder')
    }
}