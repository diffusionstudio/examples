import { createContext } from 'react';
import type { Composition } from '@diffusionstudio/core-v3';

export const CompositionContext = createContext<{ composition?: Composition}>({});
