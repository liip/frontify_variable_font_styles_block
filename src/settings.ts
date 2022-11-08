// settings.ts
import { BlockSettings, Sections } from '@frontify/guideline-blocks-settings';

export const ASSET_SETTINGS_ID = 'font';

const settings: BlockSettings = {
    [Sections.Main]: [
        {
            id: ASSET_SETTINGS_ID,
            type: 'assetInput',
            extensions: ['ttf', 'otf'],
            label: 'Font',
        },
    ],
};

export default settings;
