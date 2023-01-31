// Copyright (c) 2015-present Mattermost, Inc. All Rights Reserved.
// See LICENSE.txt for license information.

import React, {useCallback, useState} from 'react';

import {Timezone} from 'timezones.json';

import {ActionFunc} from 'mattermost-redux/types/actions';
import Constants from 'utils/constants';

import SectionCreator from 'components/widgets/modals/generic/section_creator';
import RadioItemCreator from 'components/widgets/modals/generic/radio-item-creator';
import SaveChangesPanel from 'components/widgets/modals/generic/save_changes_panel';

import CheckboxItemCreator from 'components/widgets/modals/generic/checkbox-item-creator';

import {PreferenceType} from '@mattermost/types/preferences';
import {UserProfile} from '@mattermost/types/users';

import ReactSelectItemCreator from 'components/widgets/modals/generic/react-select-item-creator';
import * as I18n from 'i18n/i18n.jsx';
import {getBrowserTimezone} from 'utils/timezone';
import {getTimezoneLabel} from 'mattermost-redux/utils/timezone_utils';

import {
    languageSelectDescription,
    languageSelectInputFieldData,
    showAutoTimezoneData,
    showLanguageTitle,
    showLanguageTitleDescription,
    showTimeFormatDescription,
    showTimeFormatTitle,
    showTimezoneDescription,
    showTimezoneTitle,
    TimeFormatData,
} from './utils';

export type Props = {
    user: UserProfile;
    defaultClientLocale: string;
    militaryTime: string;
    timezones: Timezone[];
    timezoneLabel: string;
    userTimezone: {
        useAutomaticTimezone: string;
        automaticTimezone: string;
        manualTimezone: string;
    };
    actions: {
        savePreferences: (
            userId: string,
            preferences: PreferenceType[]
        ) => void;
        updateMe: (user: UserProfile) => ActionFunc;
    };
};

export default function UserSettingsLanguageAndTime({
    userTimezone,
    militaryTime,
    user,
    defaultClientLocale,
    timezoneLabel,
    timezones,
    actions,
}: Props) {
    const Preferences = Constants.Preferences;
    const locales: any = I18n.getLanguages();
    let userLocale = user.locale;
    if (!I18n.isLanguageAvailable(userLocale)) {
        userLocale = defaultClientLocale;
    }

    const [haveChanges, setHaveChanges] = useState(false);
    const [settings, setSettings] = useState({
        use_military_time: militaryTime,
        selectedOption: {
            label: timezoneLabel,
            value: userTimezone.useAutomaticTimezone ?
                userTimezone.automaticTimezone :
                userTimezone.manualTimezone,
        },
        automaticTimezone: userTimezone.automaticTimezone,
        useAutomaticTimezone: Boolean(userTimezone.useAutomaticTimezone),
        manualTimezone: userTimezone.manualTimezone,
        language: {
            value: locales[userLocale].value,
            label: locales[userLocale].name,
        },
    });

    const changeLanguage = () => {
        let userLocale = user.locale;
        if (!I18n.isLanguageAvailable(userLocale)) {
            userLocale = defaultClientLocale;
        }
        const localeName = I18n.getLanguageInfo(userLocale).name;
        if (user.locale === settings.language.value) {

        } else {
            actions.updateMe({
                ...user,
                locale: settings.language.value as string,
            });
        }
    };

    const handlechange = (
        e: any,
        dataKey: 'timeFormat' | 'autoTimeZone' | 'timeZoneChange' | 'language',
    ) => {
        let value;
        let automaticTimezone = '';
        let timezoneLabel: string;
        let selectedOptionValue: string;
        let manualTimezone: string;
        switch (dataKey) {
        case 'timeFormat':
            value = e.target.value === 'true' ? 'true' : 'false';
            setSettings({
                ...settings,
                [Preferences.USE_MILITARY_TIME]: value,
            });
            break;
        case 'autoTimeZone':
            if (e) {
                automaticTimezone = getBrowserTimezone();
                timezoneLabel = getTimezoneLabel(
                    timezones,
                    automaticTimezone,
                );
                selectedOptionValue = automaticTimezone;
            } else {
                timezoneLabel = getTimezoneLabel(
                    timezones,
                    getBrowserTimezone(),
                );
                selectedOptionValue = getBrowserTimezone();
                manualTimezone = getBrowserTimezone();
                setSettings({
                    ...settings,
                    manualTimezone: getBrowserTimezone(),
                });
            }
            setSettings({
                ...settings,
                automaticTimezone,
                useAutomaticTimezone: e,
                selectedOption: {
                    label: timezoneLabel,
                    value: selectedOptionValue,
                },
            });
            break;
        case 'timeZoneChange':
            if (e && 'value' in e) {
                setSettings({
                    ...settings,
                    manualTimezone: e.value,
                    selectedOption: e,
                });
            }
            break;
        case 'language':
            if (e && 'value' in e) {
                setSettings({...settings, language: e});
            }
            break;
        default:
            value = null;
        }
        setHaveChanges(true);
    };

    const handleSubmit = () => {
        const preferences: PreferenceType[] = [];
        const userId = user.id;
        const category = Preferences.CATEGORY_DISPLAY_SETTINGS;
        preferences.push({
            user_id: userId,
            category,
            name: 'use_military_time',
            value: settings.use_military_time,
        });

        const timezone = {
            useAutomaticTimezone: settings.useAutomaticTimezone.toString(),
            automaticTimezone: settings.automaticTimezone,
            manualTimezone: settings.manualTimezone,
        };

        const updatedUser = {
            ...user,
            timezone,
        };

        if (userTimezone !== updatedUser.timezone) {
            actions.updateMe(updatedUser);
        }

        if (settings.use_military_time !== militaryTime) {
            actions.savePreferences(userId, preferences);
        }
        changeLanguage();

        setHaveChanges(false);
    };

    const languageSelect = (
        <ReactSelectItemCreator
            description={languageSelectDescription}
            inputFieldValue={settings.language}
            inputFieldData={languageSelectInputFieldData}
            handleChange={(e) => handlechange(e, 'language')}
        />
    );

    const timeOptions = timezones.map((timeObject) => {
        return {
            value: timeObject.utc[0],
            label: timeObject.text,
        };
    });

    const timeZoneContainer = (
        <>
            <CheckboxItemCreator
                inputFieldData={showAutoTimezoneData}
                inputFieldValue={settings.useAutomaticTimezone}
                handleChange={(e) => handlechange(e, 'autoTimeZone')}
            />
            <ReactSelectItemCreator
                description={languageSelectDescription}
                inputFieldValue={settings.selectedOption}
                inputFieldData={{options: timeOptions}}
                handleChange={(e) => handlechange(e, 'timeZoneChange')}
                isDisabled={settings.useAutomaticTimezone}
            />
        </>
    );

    const timeFormatContainer = (
        <RadioItemCreator
            inputFieldValue={settings.use_military_time}
            inputFieldData={TimeFormatData}
            handleChange={(e) => handlechange(e, 'timeFormat')}
        />
    );

    function handleCancel() {
        setSettings({
            use_military_time: militaryTime,
            selectedOption: {
                label: timezoneLabel,
                value: userTimezone.useAutomaticTimezone ?
                    userTimezone.automaticTimezone :
                    userTimezone.manualTimezone,
            },
            automaticTimezone: userTimezone.automaticTimezone,
            useAutomaticTimezone: Boolean(userTimezone.useAutomaticTimezone),
            manualTimezone: userTimezone.manualTimezone,
            language: {
                value: locales[userLocale].value,
                label: locales[userLocale].name,
            },
        });
        setHaveChanges(false);
    }

    return (
        <>
            <SectionCreator
                title={showLanguageTitle}
                content={languageSelect}
                description={showLanguageTitleDescription}
            />
            <div className='user-settings-modal__divider'/>
            <SectionCreator
                title={showTimezoneTitle}
                content={timeZoneContainer}
                description={showTimezoneDescription}
            />
            <SectionCreator
                title={showTimeFormatTitle}
                content={timeFormatContainer}
                description={showTimeFormatDescription}
            />
            {haveChanges && (
                <SaveChangesPanel
                    handleSubmit={handleSubmit}
                    handleCancel={handleCancel}
                />
            )}
        </>
    );
}
