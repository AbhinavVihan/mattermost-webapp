// Copyright (c) 2015-present Mattermost, Inc. All Rights Reserved.
// See LICENSE.txt for license information.

import React, {ChangeEvent, RefObject, useEffect, useState} from 'react';
import ReactSelect, {ValueType} from 'react-select';
import {FormattedMessage} from 'react-intl';

import semver from 'semver';

import {NotificationLevels} from 'utils/constants';
import * as Utils from 'utils/utils';
import {isDesktopApp} from 'utils/user_agent';

import CheckboxItemCreator from 'components/widgets/modals/generic/checkbox-item-creator';
import SectionCreator from 'components/widgets/modals/generic/section_creator';
import RadioItemCreator from 'components/widgets/modals/generic/radio-item-creator';
import ReactSelectItemCreator from 'components/widgets/modals/generic/react-select-item-creator';
import SectionItemCreator from 'components/widgets/modals/generic/section_item_creator';

import {
    DesktopNotificationsDesc,
    DesktopNotificationsTitle,
    desktopOrMobileConstants,
    notifyAboutData,
    notifyAboutTitle,
    setHaveChangesTrue,
    soundOptions,
    soundsData,
    soundsTitle,
    threadNotificationsData,
    threadNotificationsTitle,
} from './utils';

type SelectOption = {
    label: string;
    value: string;
};

type Props = {
    activity: string;
    threads?: string;
    sound: string;
    updateSection: (section: string) => void;
    setParentState: (key: string, value: string | boolean) => void;
    submit: () => void;
    cancel: () => void;
    error: string;
    active: boolean;
    saving: boolean;
    selectedSound: string;
    isCollapsedThreadsEnabled: boolean;
};

export default function DesktopNotificationSettings(props: Props) {
    const dropdownSoundRef: RefObject<ReactSelect> = React.createRef();

    const [selectedOption, setSelectedOption] = useState<
    ValueType<SelectOption>
    >({value: props.selectedSound, label: props.selectedSound});
    const [blurDropdownBool, setBlurDropdown] = useState(false);

    const handleChange = (e: any, dataKey: string) => {
        let value;
        switch (dataKey) {
        case desktopOrMobileConstants.DesktopActivity:
            value = e.currentTarget.getAttribute('value');
            break;
        case desktopOrMobileConstants.DesktopSound:
            value = e.toString();
            break;
        case desktopOrMobileConstants.DesktopThreads:
            value = e ? NotificationLevels.ALL : NotificationLevels.MENTION;
            break;
        case desktopOrMobileConstants.DesktopNotificationSound:
            if (e && 'value' in e) {
                value = e.value;
                setSelectedOption(e);
                Utils.tryNotificationSound(e.value);
            }
            break;
        default:
            value = null;
        }
        if (dataKey && value) {
            props.setParentState(dataKey, value);
        }

        setHaveChangesTrue(props);
    };

    function handleOnChange(e: ChangeEvent<HTMLInputElement>): void {
        const key = e.currentTarget.getAttribute('data-key');
        const value = e.currentTarget.getAttribute('data-value');
        if (key && value) {
            props.setParentState(key, value);
            setHaveChangesTrue(props);
        }
    }

    function setDesktopNotificationSound(selectedOption: ValueType<any>): void {
        if (selectedOption && 'value' in selectedOption) {
            props.setParentState(
                'desktopNotificationSound',
                selectedOption.value,
            );
            setSelectedOption(selectedOption);
            Utils.tryNotificationSound(selectedOption.value);
            setHaveChangesTrue(props);
        }
    }

    return (
        <>
            <SectionCreator title={notifyAboutTitle}/>
            <RadioItemCreator
                inputFieldData={notifyAboutData('desktop')}
                inputFieldValue={props.activity}
                handleChange={(e) =>
                    handleChange(e, desktopOrMobileConstants.DesktopActivity)
                }
            />
            {props.activity !== NotificationLevels.NONE && (
                <>
                    <SectionCreator title={threadNotificationsTitle}/>
                    <CheckboxItemCreator
                        inputFieldData={threadNotificationsData('desktop')}
                        inputFieldValue={props.threads === 'all'}
                        handleChange={(e) =>
                            handleChange(
                                e,
                                desktopOrMobileConstants.DesktopThreads,
                            )
                        }
                    />
                    <SectionItemCreator
                        title={soundsTitle}
                        content={
                            <>
                                <CheckboxItemCreator
                                    inputFieldData={soundsData}
                                    inputFieldValue={props.sound === 'true'}
                                    handleChange={(e) =>
                                        handleChange(
                                            e,
                                            desktopOrMobileConstants.DesktopSound,
                                        )
                                    }
                                />
                                {props.sound === 'true' && (
                                    <ReactSelectItemCreator
                                        inputFieldData={{
                                            options: soundOptions,
                                        }}
                                        inputFieldValue={
                                            selectedOption as SelectOption
                                        }
                                        handleChange={(e) =>
                                            handleChange(
                                                e,
                                                desktopOrMobileConstants.DesktopNotificationSound,
                                            )
                                        }
                                    />
                                )}
                            </>
                        }
                    />
                </>
            )}
        </>
    );
}
