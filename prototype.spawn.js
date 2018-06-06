module.exports = function () {
    StructureSpawn.prototype.createCustomCreep = function (energy, roleName) {
        let numberOfParts = Math.floor(energy / 300);
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

        // create creep with the created body and the given role
        let result = this.spawnCreep(body, roleName+'-'+Math.floor(Date.now() / 1000), {memory: { role: roleName, working: false }});
        return result;
    };

    StructureSpawn.prototype.createLongDistanceHarvester = function(energy, numberOfWorkParts, home, target, sourceIndex){
        let body = [];
        for (let i = 0; i < numberOfWorkParts; i++) {
            body.push(WORK);
        }

        energy -= 150*numberOfWorkParts;

        let numberOfParts = Math.floor(energy / 100);
        for (let i = 0; i < numberOfParts; i++) {
            body.push(CARRY);
        }
        for (let i = 0; i < numberOfParts + numberOfWorkParts; i++) {
            body.push(MOVE);
        }

        return this.spawnCreep(body,'longharvester-'+Math.floor(Date.now() / 1000),
            {memory: { role: 'longharvester',
            home: home,
            target:target,
            source: sourceIndex,
            working: false }});
    };
};