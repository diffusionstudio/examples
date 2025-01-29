import { createContext } from 'react';
import type { Composition } from '@diffusionstudio/core-v2';

export const CompositionContext = createContext<{ composition?: Composition}>({});
