// Copyright (c) 2015-present Mattermost, Inc. All Rights Reserved.
// See LICENSE.txt for license information.

import React from 'react';
import ReactSelect, {ValueType} from 'react-select';

import SectionItemCreator, {SectionItemProps} from './section_item_creator';

export type Limit = {
    value: number | string;
    label: string;
};

export type FieldsetReactSelect = {
    dataTestId?: string;
    options: Limit[];
};

type Props = SectionItemProps & {
    inputFieldData: FieldsetReactSelect;
    inputFieldValue: Limit;
    handleChange: (selected: ValueType<Limit>) => void;
    isDisabled?: boolean;
};
function ReactSelectItemCreator({
    title,
    description,
    inputFieldData,
    inputFieldValue,
    handleChange,
    isDisabled,
}: Props): JSX.Element {
    const content = (
        <fieldset className='mm-modal-generic-section-item__fieldset-react-select'>
            <ReactSelect
                className='react-select'
                classNamePrefix='react-select'
                id='limitVisibleGMsDMs'
                options={inputFieldData.options}
                clearable={false}
                onChange={handleChange}
                value={inputFieldValue}
                isSearchable={false}
                menuPortalTarget={document.body}
                styles={reactStyles}
                isDisabled={isDisabled}
            />
        </fieldset>
    );
    return (
        <SectionItemCreator
            content={content}
            title={title}
            description={description}
        />
    );
}

export default ReactSelectItemCreator;

const reactStyles = {
    menuPortal: (provided: React.CSSProperties) => ({
        ...provided,
        zIndex: 9999,
    }),
};
