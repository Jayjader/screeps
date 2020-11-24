type SpawnerState = "idle" | "waitforspawn" | "spawn";

type Role = "harvester" | "builder" | "repairer";

type HarvestingCreep = {
  state: "harvest";
  source?: Id<Source>;
};
type ValidStorageTarget = StructureSpawn | StructureExtension;
type StoringCreep = {
  state: "deposit";
  receiver?: Id<ValidStorageTarget>;
};
type BuildingCreep = {
  state: "build";
  project?: Id<ConstructionSite>;
};
type RepairingCreep = {
  state: "repair";
  structure?: Id<Structure>;
};
type State<role extends Role> = role extends "builder"
  ? BuildingCreep | HarvestingCreep
  : role extends "harvester"
  ? HarvestingCreep | StoringCreep
  : role extends "repairer"
  ? RepairingCreep | HarvestingCreep
  : never;
type States<state extends StateTags<Role>> = state extends "harvest"
  ? HarvestingCreep
  : state extends "build"
  ? BuildingCreep
  : state extends "deposit"
  ? StoringCreep
  : state extends "repair"
  ? RepairingCreep
  : never;
type StateTags<role extends Role> = State<role>["state"];

type Mem<role extends Role, state extends StateTags<role>> = {
  role: role;
  internalState: States<state>;
};
type MemRole<role extends Role> = Mem<role, StateTags<role>>;
type AllCreepMemory = MemRole<Role>;
interface CreepMemory extends AllCreepMemory {}
type MyCreep<role extends Role> = Creep & {
  memory: Mem<role, StateTags<role>>;
};
