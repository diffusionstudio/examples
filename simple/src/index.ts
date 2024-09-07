import { setupControls } from './controls';
import { setupTimeline } from './timeline';

import { composition } from './compositions/example';

// connect to ui
setupControls(composition);
setupTimeline(composition);
