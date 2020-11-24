function creepInt(name: string, ringSize: number): number {
  return parseInt(name.slice(1)) % ringSize;
}
type StateBehavior<role extends Role, state extends StateTags<role>> = (
  state: States<state>,
  creep: Creep
) => State<role>;

type RoleBehavior<role extends Role> = {
  [state in StateTags<role>]: StateBehavior<role, state>;
};
type RoleBehaviors = {
  [role in Role]: RoleBehavior<role>;
};

export const harvester: RoleBehavior<"harvester"> = {
  harvest: (state, creep) => {
    if (creep.store.getFreeCapacity(RESOURCE_ENERGY) === 0) {
      return { state: "deposit" };
    }
    const source =
      state.source !== undefined
        ? Game.getObjectById(state.source)
        : creep.room.find(FIND_SOURCES)[creepInt(creep.name, 2)] || null;
    if (source === null) {
      return { state: "deposit" };
    }
    if (creep.harvest(source) === ERR_NOT_IN_RANGE) {
      creep.moveTo(source);
    }
    return { state: "harvest", source: source.id };
  },
  deposit: (state, creep) => {
    const { internalState } = creep.memory;
    if (creep.store.getUsedCapacity(RESOURCE_ENERGY) === 0) {
      return { state: "harvest" };
    }
    const receiver =
      state.receiver !== undefined
        ? Game.getObjectById(state.receiver)
        : creep.room.find(FIND_MY_SPAWNS)[0] || null;
    if (receiver === null) {
      return { state: "harvest" };
    }
    if (creep.transfer(receiver, RESOURCE_ENERGY) === ERR_NOT_IN_RANGE) {
      creep.moveTo(receiver);
    }
    return { state: "deposit", receiver: receiver.id };
  },
};

export const builder: RoleBehavior<"builder"> = {
  build: (state, creep) => {
    // todo
    console.log(creep.name, state.project);
    return { state: "harvest" };
  },
  harvest: (state, creep) => {
    // todo
    console.log(creep.name, state.source);
    return { state: "build" };
  },
};

export const repairer: RoleBehavior<"repairer"> = {
  repair: (state, creep) => {
    // todo
    console.log(creep.name, state.structure);
    return { state: "harvest" };
  },
  harvest: (state, creep) => {
    // todo
    console.log(creep.name, state.source);
    return { state: "repair" };
  },
};

const roleBehaviors: RoleBehaviors = {
  harvester,
  builder,
  repairer,
};

export function creepAct(creep: MyCreep<Role>) {
  const { role, internalState } = creep.memory;
  const { state } = internalState;
  const behavior = roleBehaviors[role];
  const stateBehavior = behavior[state];
  creep.memory = stateBehavior(internalState, creep);
}
