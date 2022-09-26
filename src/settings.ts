// settings.ts
import { BlockSettings, Sections } from '@frontify/guideline-blocks-settings';

const settings: BlockSettings = {
    [Sections.Main]: [
        {
            id: 'inputId',
            type: 'input',
            label: 'Input',
            defaultValue: '100px',
            clearable: true,
            rules: [
                {
                    errorMessage: "Please use a numerical value with or without 'px'",
                    validate: (value: string) => value.match(/^\d+(?:px)?$/g) !== null,
                },
            ],
        },
    ],
};

export default settings;
