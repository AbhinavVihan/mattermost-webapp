// Copyright (c) 2015-present Mattermost, Inc. All Rights Reserved.
// See LICENSE.txt for license information.

import React, {useCallback, useEffect, useState} from 'react';
import {ValueType} from 'react-select';

import {NotificationLevels} from 'utils/constants';
import SectionCreator from 'components/widgets/modals/generic/section_creator';

import RadioItemCreator from 'components/widgets/modals/generic/radio-item-creator';
import SectionItemCreator from 'components/widgets/modals/generic/section_item_creator';
import CheckboxItemCreator from 'components/widgets/modals/generic/checkbox-item-creator';
import ReactSelectItemCreator, {
    Limit,
} from 'components/widgets/modals/generic/react-select-item-creator';
import {UserProfile} from '@mattermost/types/users';
import {ActionResult} from 'mattermost-redux/types/actions';
import {
    MobileNotificationsSectionDesc,
    MobileNotificationsSectionTitle,
} from 'components/channel_notifications_modal/utils';

import {
    desktopOrMobileConstants,
    notifyAboutData,
    notifyAboutTitle,
    setHaveChangesTrue,
    threadNotificationsData,
    threadNotificationsTitle,
    triggerMobileNotificationsTitle,
    triggerNotificationsOptions,
    triggers,
    useSameAsDesktopDataCheckbox,
} from './utils';

type Props = {
    user: UserProfile;
    updateMe: (user: UserProfile) => Promise<ActionResult>;
    setParentState: (key: string, value: string | boolean) => void;
    activity: string;
    threads?: string;
    getUseSameDesktopSetting: () => boolean;
    pushStatus: any;
    deskTopActivity: string;
    desktopThreads?: string;
};

export function MobileNotificationsSettings(props: Props) {
    const [mobileSettingsSameAsDesktop, setMobileSettingsSameAsDesktop] =
        useState<boolean>(props.getUseSameDesktopSetting());

    useEffect(() => {
        if (props.getUseSameDesktopSetting()) {
            setMobileSettingsSameAsDesktop(true);
        } else if (
            !props.getUseSameDesktopSetting() &&
            mobileSettingsSameAsDesktop
        ) {
            console.log('i am running');
            props.setParentState(
                desktopOrMobileConstants.MobileActivity,
                props.deskTopActivity,
            );
            props.setParentState(
                desktopOrMobileConstants.MobileThreads,
                props.desktopThreads as string,
            );
        }
    }, [props.getUseSameDesktopSetting()]);

    function handleOnChange(e?: any, dataKey?: string): void {
        let value;
        switch (dataKey) {
        case desktopOrMobileConstants.MobileActivity:
            value = e.currentTarget.getAttribute('value');
            break;
        case desktopOrMobileConstants.MobileThreads:
            value = e ? NotificationLevels.ALL : NotificationLevels.MENTION;
            break;
        default:
            value = null;
        }
        if (dataKey && value) {
            props.setParentState(dataKey, value);
        }
        setHaveChangesTrue(props);
    }

    const handlePushStatusChange = (selectedOption: ValueType<Limit>) => {
        if (selectedOption && 'value' in selectedOption) {
            props.setParentState('pushStatus', selectedOption.value as string);
            handleOnChange();
        }
    };

    const handleMobileSettingsChange = useCallback(
        (e: boolean) => {
            console.log('i am also running');
            setMobileSettingsSameAsDesktop(e);
            props.setParentState(
                desktopOrMobileConstants.MobileActivity,
                props.deskTopActivity,
            );
            props.setParentState(
                desktopOrMobileConstants.MobileThreads,
                props.desktopThreads as string,
            );
            handleOnChange();
        },
        [mobileSettingsSameAsDesktop, props.activity, props.threads],
    );

    const sameAsDesktopContainer = (
        <>
            <SectionItemCreator
                title={notifyAboutTitle}
                content={
                    <RadioItemCreator
                        inputFieldData={notifyAboutData('mobile')}
                        inputFieldValue={props.activity}
                        handleChange={(e) =>
                            handleOnChange(
                                e,
                                desktopOrMobileConstants.MobileActivity,
                            )
                        }
                    />
                }
            />
            <SectionItemCreator
                title={threadNotificationsTitle}
                content={
                    <CheckboxItemCreator
                        inputFieldValue={
                            props.threads === NotificationLevels.ALL
                        }
                        inputFieldData={threadNotificationsData('mobile')}
                        handleChange={(e) =>
                            handleOnChange(
                                e,
                                desktopOrMobileConstants.MobileThreads,
                            )
                        }
                    />
                }
            />
        </>
    );

    const mobileNotificationsContainer = (
        <>
            <SectionCreator
                title={MobileNotificationsSectionTitle}
                description={MobileNotificationsSectionDesc}
            />
            <CheckboxItemCreator
                inputFieldValue={mobileSettingsSameAsDesktop}
                inputFieldData={useSameAsDesktopDataCheckbox}
                handleChange={handleMobileSettingsChange}
            />
            {!mobileSettingsSameAsDesktop && sameAsDesktopContainer}
            <SectionItemCreator
                title={triggerMobileNotificationsTitle}
                content={
                    <ReactSelectItemCreator
                        inputFieldValue={{
                            label: triggers.get(props.pushStatus) as string,
                            value: props.pushStatus,
                        }}
                        inputFieldData={{
                            options: triggerNotificationsOptions,
                        }}
                        handleChange={handlePushStatusChange}
                    />
                }
            />
        </>
    );

    return <SectionCreator content={mobileNotificationsContainer}/>;
}
