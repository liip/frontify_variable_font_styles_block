import { defineBlock } from '@frontify/guideline-blocks-settings';

import settings from './settings';
import { VariableFontStylesBlock } from './VariableFontStylesBlock';

export default defineBlock({
    block: VariableFontStylesBlock,
    settings,
});
