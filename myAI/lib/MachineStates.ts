enum MachineStates {
    sink = 'sink',
    firstFullSink = 'firstFullSink',
    runAwayFromMonster = 'runAwayFromMonster',
    avoidMonsterAndSink = 'avoidMonsterAndSink',
    avoidMonsterAndSearch = 'avoidMonsterAndSearch',
    sendScans = 'sendScans',
    search = 'search'

}
enum MachineActions {
    foundMonster = 'foundMonster',
    monsterHunting = 'monsterHunting'
}
type MachineState = keyof typeof MachineStates;
type MachineAction = keyof typeof MachineActions;
type StateMachine = {
    [state in MachineStates]: {
        [action in MachineActions]?: MachineState;
    };
};
