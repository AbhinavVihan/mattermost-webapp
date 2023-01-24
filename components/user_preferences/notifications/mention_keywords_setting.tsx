import MultiSelect from "components/multiselect/multiselect";
import CheckboxItemCreator from "components/widgets/modals/generic/checkbox-item-creator";
import { Limit } from "components/widgets/modals/generic/react-select-item-creator";
import SectionCreator from "components/widgets/modals/generic/section_creator";
import React, { useState } from "react";
import ReactSelect, { components } from "react-select";
import {
    caseSensitiveFirstNameData,
    channelWideMentionsData,
    mentionKeyWordsDesc,
    mentionKeyWordsTitle,
    setHaveChangesTrue,
} from "./utils";

type Props = {
    setParentState: (key: string, value: string | boolean) => void;
    firstNameKey: boolean;
    channelKey: boolean;
    firstName: string;
    customKeys: string;
};

const nullComponent = () => null;

export const MentionKeyWordsSetting = (props: Props) => {
    const mentionKeys = props.customKeys.split(',').map((v) => {
        return {label: v, value: v}
    });
    const [submitted, setSubmited] = useState(false)

    const [values, setValues] = useState('')

    const handleChange = (e: any, dataKey: string) => {
        let value;
        switch (dataKey) {
            case "firstNameKey":
            case "channelKey":
                value = e;
                break;
            default:
                value = null;
        }

        props.setParentState(dataKey, value);
        setValues(props.customKeys)
        setHaveChangesTrue(props);
    };


    const handleInputChange = (e: any) => {
        setValues(e)
    }

    const isSame = () => {
   return mentionKeys.map(m => {
        let same;
        if(m.value === values) {
            same = true
        }
        return same
    })

    }

    const handleKeyDown = (e: React.KeyboardEvent<HTMLElement>) => {
        if(e.key === 'Enter') {
            if(values !== '' && !values.startsWith(',') && !isSame()[mentionKeys.length - 1]) {
                props.setParentState('customKeys', (props.customKeys+','+values.replace(/ /g, '')) );
                setHaveChangesTrue(props);
                setSubmited(true)
            }
    }
}

    const handleOnChange = (values: any) => {
        if(values === null) {
            props.setParentState('customKeys', '')
            setHaveChangesTrue(props)
        } else {
            const remKeys = values.map((v: {label: string, value: string}) => v.value).join(',')
            props.setParentState('customKeys', remKeys)
            setHaveChangesTrue(props)
        } 
    }

    return (
        <>
            <SectionCreator
                title={mentionKeyWordsTitle}
                description={mentionKeyWordsDesc}
            />
            <CheckboxItemCreator
                inputFieldData={caseSensitiveFirstNameData(props.firstName)}
                inputFieldValue={props.firstNameKey}
                handleChange={(e) => handleChange(e, "firstNameKey")}
            />
            <CheckboxItemCreator
                inputFieldData={channelWideMentionsData}
                inputFieldValue={props.channelKey}
                handleChange={(e) => handleChange(e, "channelKey")}
            />
            <ReactSelect
                id="selectItems"
                isMulti={true}
                components={{
                    Menu: nullComponent,
                    IndicatorsContainer: nullComponent,
                }}
                isClearable={false}
                openMenuOnFocus={false}
                menuIsOpen={false}
                onKeyDown={handleKeyDown}
                onChange={handleOnChange}
                onInputChange={handleInputChange}
                value={mentionKeys || {label: '', value: ''}}
                className="react-select react-select-auto "
                classNamePrefix='react-select'
            />
        </>
    );
};
