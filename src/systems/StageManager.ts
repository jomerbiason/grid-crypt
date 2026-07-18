import { STAGE, STAGE_NAMES } from '../config/constants';

export type StagePhase = 'survival' | 'warning' | 'boss' | 'cleared' | 'complete';

export default class StageManager {
    stage = 1;
    phase: StagePhase = 'survival';
    private phaseStartedAt = 0;

    get stageName(): string {
        return STAGE_NAMES[this.stage - 1] ?? STAGE_NAMES[0];
    }

    startStage(time: number, stage: number): void {
        this.stage = stage;
        this.phase = 'survival';
        this.phaseStartedAt = time;
    }

    getSurvivalRemainingMs(time: number): number {
        return Math.max(0, STAGE.survivalDurationMs - (time - this.phaseStartedAt));
    }

    update(time: number): StagePhase {
        if (this.phase === 'survival' && this.getSurvivalRemainingMs(time) <= 0) {
            this.phase = 'warning';
            this.phaseStartedAt = time;
        } else if (this.phase === 'warning' && time - this.phaseStartedAt > STAGE.warningDurationMs) {
            this.phase = 'boss';
        }
        return this.phase;
    }

    markCleared(time: number): void {
        this.phase = 'cleared';
        this.phaseStartedAt = time;
    }

    isClearedDelayDone(time: number): boolean {
        return time - this.phaseStartedAt >= STAGE.clearedDurationMs;
    }

    markComplete(): void {
        this.phase = 'complete';
    }
}
