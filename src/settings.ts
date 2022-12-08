// settings.ts
import { BlockSettings, Sections } from '@frontify/guideline-blocks-settings';

export const ASSET_SETTINGS_ID = 'font';

export const ALLOWED_EXTENSIONS = ['ttf', 'otf'];

const settings: BlockSettings = {
    [Sections.Main]: [
        {
            id: ASSET_SETTINGS_ID,
            type: 'assetInput',
            extensions: ALLOWED_EXTENSIONS,
            label: 'Font',
        },
    ],
};

export default settings;
