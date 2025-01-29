import * as core from '@diffusionstudio/core-v2';

export type Settings = Partial<core.CompositionSettings> | undefined;
export type MainFn = (composition: core.Composition) => Promise<void>;
