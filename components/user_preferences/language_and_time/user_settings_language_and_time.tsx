// Copyright (c) 2015-present Mattermost, Inc. All Rights Reserved.
// See LICENSE.txt for license information.

import React, {useCallback, useState} from 'react';

import {ValueType} from 'react-select';

import {Timezone} from 'timezones.json';

import {ActionFunc, ActionResult} from 'mattermost-redux/types/actions';
import Constants from 'utils/constants';

import {Preferences} from 'mattermost-redux/constants';

import SectionCreator from 'components/widgets/modals/generic/section_creator';
import RadioItemCreator from 'components/widgets/modals/generic/radio-item-creator';
import SaveChangesPanel from 'components/widgets/modals/generic/save_changes_panel';

import CheckboxItemCreator from 'components/widgets/modals/generic/checkbox-item-creator';

import {PreferenceType} from '@mattermost/types/preferences';
import {UserProfile} from '@mattermost/types/users';

import ReactSelectItemCreator, {
    Limit,
} from 'components/widgets/modals/generic/react-select-item-creator';
import * as I18n from 'i18n/i18n.jsx';
import {getBrowserTimezone} from 'utils/timezone';
import {getTimezoneLabel} from 'mattermost-redux/utils/timezone_utils';

import {
    languageSelectDescription,
    languageSelectInputFieldData,
    SelectedOption,
    showAutoTimezoneCheckboxTitle,
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
        useAutomaticTimezone: boolean;
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

export default function UserSettingsLanguageAndTime(props: Props) {
    const Preferences = Constants.Preferences;

    const locales: any = I18n.getLanguages();
    let userLocale = props.user.locale;
    if (!I18n.isLanguageAvailable(userLocale)) {
        userLocale = props.defaultClientLocale;
    }
    const [language, setLanguage] = useState<Limit>({
        value: locales[userLocale].value,
        label: locales[userLocale].name,
    });
    const [haveChanges, setHaveChanges] = useState(false);
    function handleChange(selected: ValueType<Limit>) {
        if (selected && 'value' in selected) {
            setLanguage(selected);
        }
        setHaveChanges(true);
    }

    const handleTimezoneChange = (selectedOption: ValueType<Limit>) => {
        if (selectedOption && 'value' in selectedOption) {
            setManualTimezone(selectedOption.value as string);
            setSelectedOption(selectedOption as any);
            setHaveChanges(true);
        }
    };

    const [manualTimezone, setManualTimezone] = useState(
        props.userTimezone.manualTimezone,
    );
    const [useAutomaticTimezone, setUseAutomaticTimeZone] = useState(
        Boolean(props.userTimezone.useAutomaticTimezone),
    );
    const [automaticTimezone, setAutomaticTimezone] = useState(
        props.userTimezone.automaticTimezone,
    );
    const [selectedOption, setSelectedOption] = useState({
        label: props.timezoneLabel,
        value: props.userTimezone.useAutomaticTimezone ?
            props.userTimezone.automaticTimezone :
            props.userTimezone.manualTimezone,
    });

    const changeLanguage = () => {
        let userLocale = props.user.locale;
        if (!I18n.isLanguageAvailable(userLocale)) {
            userLocale = props.defaultClientLocale;
        }
        const localeName = I18n.getLanguageInfo(userLocale).name;
        if (props.user.locale === language.value) {

        } else {
            props.actions.updateMe({
                ...props.user,
                locale: language.value as string,
            });
        }
    };

    const [settings, setSettings] = useState({
        [Preferences.USE_MILITARY_TIME]: props.militaryTime,
    });

    const handleOnChange = useCallback(
        (values: Record<string, string>) => {
            setSettings({...settings, ...values});
            setHaveChanges(true);
        },
        [settings],
    );

    const languageSelect = (
        <ReactSelectItemCreator
            description={languageSelectDescription}
            inputFieldValue={language}
            inputFieldData={languageSelectInputFieldData}
            handleChange={handleChange}
        />
    );

    const handleAutomaticTimezone = (e: boolean) => {
        const useAutomaticTimezone = e;
        let automaticTimezone = '';
        let timezoneLabel: string;
        let selectedOptionValue: string;

        if (useAutomaticTimezone) {
            automaticTimezone = getBrowserTimezone();
            timezoneLabel = getTimezoneLabel(
                props.timezones,
                automaticTimezone,
            );
            selectedOptionValue = automaticTimezone;
        } else {
            timezoneLabel = getTimezoneLabel(
                props.timezones,
                getBrowserTimezone(),
            );
            selectedOptionValue = getBrowserTimezone();
            setManualTimezone(getBrowserTimezone());
        }
        setAutomaticTimezone(automaticTimezone);
        setUseAutomaticTimeZone(useAutomaticTimezone);
        setSelectedOption({label: timezoneLabel, value: selectedOptionValue});
        setHaveChanges(true);
    };

    const timeOptions = props.timezones.map((timeObject) => {
        return {
            value: timeObject.utc[0],
            label: timeObject.text,
        };
    });

    const showAutoTimezoneData = {
        dataTestId: 'AutoTimezone-test-id',
        title: {
            id: 'user.settings.languageAndTime.setAutomaticTimezone',
            defaultMessage: 'Set timezone automatically',
        },
        name: 'AutoTimezone-name',
        key: 'AutoTimezone-key',
        value: selectedOption,
    };

    const timeZoneContainer = (
        <>
            <CheckboxItemCreator
                inputFieldData={showAutoTimezoneData}
                inputFieldValue={useAutomaticTimezone}
                handleChange={handleAutomaticTimezone}
            />
            <ReactSelectItemCreator
                description={languageSelectDescription}
                inputFieldValue={selectedOption}
                inputFieldData={{options: timeOptions}}
                handleChange={handleTimezoneChange}
                isDisabled={useAutomaticTimezone}
            />
        </>
    );

    const timeFormatContainer = (
        <RadioItemCreator
            inputFieldValue={settings[Preferences.USE_MILITARY_TIME]}
            inputFieldData={TimeFormatData}
            handleChange={(e) => {
                handleOnChange({
                    [Preferences.USE_MILITARY_TIME]:
                        e.target.value === 'true' ? 'true' : 'false',
                });
            }}
        />
    );

    function handleSubmit() {
        const preferences: PreferenceType[] = [];
        const {actions, user} = props;
        const userId = user.id;
        const category = Preferences.CATEGORY_DISPLAY_SETTINGS;

        Object.keys(settings).forEach((setting) => {
            preferences.push({
                user_id: userId,
                category,
                name: setting,
                value: settings[setting],
            });
        });

        const timezone = {
            useAutomaticTimezone: useAutomaticTimezone.toString(),
            automaticTimezone,
            manualTimezone,
        };

        const updatedUser = {
            ...user,
            timezone,
        };

        changeLanguage();
        actions.updateMe(updatedUser);
        actions.savePreferences(userId, preferences);
        setHaveChanges(false);
    }
    function handleCancel() {
        // setDefaults();
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
