import { FormControl, TextInput, TextInputType, Validation } from '@frontify/fondue';
import React, { FC } from 'react';

import style from '../style.module.css';

interface RangeInputProps {
    id: string;
    label: string;
    labelPrefixRange: string;
    labelPrefixText: string;
    min?: string;
    max?: string;
    onChange: (value: string) => void;
    value: string;
}

export const RangeInput: FC<RangeInputProps> = ({
    id,
    label,
    labelPrefixRange,
    labelPrefixText,
    min,
    max,
    onChange,
    value,
}) => {
    const rangeId = `${labelPrefixRange}${id}`;
    const rangeText = `${labelPrefixText}${id}`;

    return (
        <div className={style['range-input']}>
            <FormControl
                label={{
                    children: label,
                    htmlFor: rangeId,
                }}
            >
                <input
                    className={style['range-input__slider']}
                    type="range"
                    id={rangeId}
                    value={value}
                    onChange={(event) => onChange(event.target.value)}
                    min={min}
                    max={max}
                />
            </FormControl>
            <div className={style['range-input__text-field']}>
                <label className="sr-only" htmlFor={rangeText}></label>
                <TextInput
                    type={TextInputType.Number}
                    id={rangeText}
                    value={value}
                    onChange={(event) => onChange(event)}
                    validation={Validation.Default}
                    min={min ? parseInt(min) : undefined}
                    max={max ? parseInt(max) : undefined}
                ></TextInput>
            </div>
        </div>
    );
};
