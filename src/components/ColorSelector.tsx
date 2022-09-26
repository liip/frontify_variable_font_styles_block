import { FrontifyColor } from '@frontify/app-bridge';
import { IconCheckMarkCircle } from '@frontify/fondue';
import React, { ChangeEventHandler, FC } from 'react';

import style from '../style.module.css';

interface Props {
    id: string;
    color: FrontifyColor;
    isChecked: boolean;
    handleChange: ChangeEventHandler<HTMLInputElement>;
    isMultiSelect?: boolean;
}

export const toRgbaString = (color: FrontifyColor): string => {
    return `rgba(${color.red}, ${color.green}, ${color.blue}, ${color.alpha})`;
};

export const getUniqueColorName = (id: string, color: FrontifyColor) => `${id}${color.nameCss}${color.hex}`;

export const ColorSelector: FC<Props> = ({ color, handleChange, id, isChecked, isMultiSelect }) => {
    return (
        <div>
            {isMultiSelect ? (
                <input
                    type="checkbox"
                    id={getUniqueColorName(id, color)}
                    checked={isChecked}
                    onChange={handleChange}
                    className="tw-sr-only"
                ></input>
            ) : (
                <input
                    type="radio"
                    id={getUniqueColorName(id, color)}
                    value={getUniqueColorName(id, color)}
                    checked={isChecked}
                    name={id}
                    onChange={handleChange}
                    className="tw-sr-only"
                ></input>
            )}
            <label htmlFor={getUniqueColorName(id, color)}>
                <div
                    className={style['color-selector']}
                    style={{
                        backgroundColor: toRgbaString(color),
                        boxShadow:
                            isChecked && !isMultiSelect
                                ? `0 0 0 2px ${toRgbaString({ ...color, alpha: 0.3 })}`
                                : 'none',
                    }}
                >
                    {isChecked && isMultiSelect && (
                        <div className={style['color-selector__checked-icon']}>
                            <IconCheckMarkCircle filled />
                        </div>
                    )}
                </div>
            </label>
        </div>
    );
};
