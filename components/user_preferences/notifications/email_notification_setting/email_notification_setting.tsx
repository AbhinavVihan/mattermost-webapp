// Copyright (c) 2015-present Mattermost, Inc. All Rights Reserved.
// See LICENSE.txt for license information.

import React, { useState } from "react";
import { FormattedMessage } from "react-intl";

import { getEmailInterval } from "mattermost-redux/utils/notify_props";

import { Preferences, NotificationLevels } from "utils/constants";
import { localizeMessage } from "utils/utils";

import SettingItemMax from "components/setting_item_max";
import SettingItemMin from "components/setting_item_min";

import { UserNotifyProps, UserProfile } from "@mattermost/types/users";
import { PreferenceType } from "@mattermost/types/preferences";
import CheckboxItemCreator from "components/widgets/modals/generic/checkbox-item-creator";
import {
    emailNotificationsData,
    emailNotificationsRadioData,
    setHaveChangesTrue,
} from "../utils";
import RadioItemCreator from "components/widgets/modals/generic/radio-item-creator";
import SaveChangesPanel from "components/widgets/modals/generic/save_changes_panel";

const SECONDS_PER_MINUTE = 60;

type Props = {
    enableEmail: boolean;
    emailInterval: number;
    onSubmit: () => void;
    onCancel: () => void;
    onChange: (enableEmail: UserNotifyProps["email"]) => void;
    serverError?: string;
    saving?: boolean;
    sendEmailNotifications: boolean;
    enableEmailBatching: boolean;
        savePreferences: (
            currentUserId: string,
            emailIntervalPreference: PreferenceType[]
        ) => Promise<{ data: boolean }>;
    setParentState: (key: string, value: any) => void;
    user: UserProfile;
};

export const EmailNotificationsSetting = (props: Props) => {
    const [haveChanges, setHaveChanges] = useState(false);
    const [enableEmail, setEnableEmail] = useState(props.enableEmail);
    const [newInterval, setNewInterval] = useState(
        getEmailInterval(
            enableEmail && props.sendEmailNotifications,
            // need to set this true
            !props.enableEmailBatching,
            props.emailInterval
        )
    );

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const enableEmail = "true";
        const newInterval = parseInt(
            e.currentTarget.getAttribute("value")!,
            10
        );
        setEnableEmail(enableEmail === "true");
        setNewInterval(newInterval);
        props.onChange(enableEmail as UserNotifyProps["email"]);
        setHaveChanges(true);
    };

    const handleOnChange = (e: boolean) => {
        setEnableEmail(e);
        props.setParentState("enableEmail", e.toString());
        setHaveChanges(true);
    };

    const onSubmit = async () => {
        if (
            props.emailInterval === newInterval &&
            props.enableEmail === enableEmail
        ) {
            setHaveChanges(false);
        } else {
            // until the rest of the notification settings are moved to preferences, we have to do this separately
            const { savePreferences, user } = props;
            const emailIntervalPreference = {
                user_id: user.id,
                category: Preferences.CATEGORY_NOTIFICATIONS,
                name: Preferences.EMAIL_INTERVAL,
                value: newInterval.toString(),
            };
            console.log(emailIntervalPreference);

            await savePreferences(user.id, [emailIntervalPreference]);
            setHaveChanges(false);
        }
        props.onSubmit();
    };
    return (
        <>
            <CheckboxItemCreator
                inputFieldValue={props.enableEmail}
                inputFieldData={emailNotificationsData}
                handleChange={handleOnChange}
            />
            {enableEmail && (
                <RadioItemCreator
                    inputFieldData={emailNotificationsRadioData}
                    inputFieldValue={
                        newInterval === 0
                            ? Preferences.INTERVAL_IMMEDIATE
                            : newInterval
                    }
                    handleChange={handleChange}
                />
            )}

            {haveChanges && (
                <SaveChangesPanel
                    handleSubmit={onSubmit}
                    handleCancel={() => setHaveChanges(false)}
                />
            )}
        </>
    );
};
