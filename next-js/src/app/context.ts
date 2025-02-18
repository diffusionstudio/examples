import { createContext } from 'react';
import type { Composition } from '@diffusionstudio/core';

export const CompositionContext = createContext<{ composition?: Composition}>({});
