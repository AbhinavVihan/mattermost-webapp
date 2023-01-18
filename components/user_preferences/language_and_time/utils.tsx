// Copyright (c) 2015-present Mattermost, Inc. All Rights Reserved.
// See LICENSE.txt for license information.

import {t} from 'utils/i18n';
import {localizeMessage} from 'utils/utils';

import {FieldsetCheckbox} from 'components/widgets/modals/generic/checkbox-item-creator';
import {FieldsetRadio} from 'components/widgets/modals/generic/radio-item-creator';
import {
    FieldsetReactSelect,
    Limit,
} from 'components/widgets/modals/generic/react-select-item-creator';

import {CategorySorting} from '@mattermost/types/channel_categories';
import * as I18n from 'i18n/i18n.jsx';

export type SelectedOption = {
    value: string;
    label: string;
};

export const showLanguageTitle = {
    id: t('user.settings.languageAndTime.language.title'),
    defaultMessage: 'Language',
};

export const showLanguageTitleDescription = {
    id: t('user.settings.languageAndTime.language.title.description'),
    defaultMessage: "Select the language you'd prefer to use in Mattermost.",
};

export const languageSelectDescription = {
    id: t('user.settings.languageAndTime.languageSelect.description'),
    defaultMessage:
        'Join the Mattermost Translation Server to help with translations.',
};

export const languageLabels: Limit[] = [];

const locales: any = I18n.getLanguages();

const languages = Object.keys(locales).
    map((l) => {
        return {
            value: locales[l].value,
            label: locales[l].name,
            order: locales[l].order,
        };
    }).
    sort((a, b) => a.order - b.order);

languages.forEach((lang) => {
    languageLabels.push({value: lang.value, label: lang.label});
});

export const showTimezoneTitle = {
    id: t('user.settings.languageAndTime.Timezone.title'),
    defaultMessage: 'Timezone',
};

export const showTimezoneDescription = {
    id: t('user.settings.languageAndTime.Timezone.Description'),
    defaultMessage:
        'Select your timezone for message timestamps and email notifications.',
};

export const showAutoTimezoneCheckboxTitle = {
    id: t('user.settings.languageAndTime.setAutomaticTimezone'),
    defaultMessage: 'Set timezone automatically',
};

export const showTimeFormatTitle = {
    id: t('user.settings.languageAndTime.TimeFormat.title'),
    defaultMessage: 'Time format',
};

export const showTimeFormatDescription = {
    id: t('user.settings.languageAndTime.TimeFormat.description'),
    defaultMessage: 'Select the time format you prefer.',
};

const twelveHourFormat = '12-hour clock (example: 4:00 PM)';
const twentyFourHourFormat = '24-hour clock (example: 16:00)';

export const TimeFormatData: FieldsetRadio = {
    options: [
        {
            dataTestId: `${twelveHourFormat}-test-id`,
            title: {
                id: 'user.settings.languageAndTime.TimeFormat.12Hour',
                defaultMessage: '12-hour clock (example: 4:00 PM)',
            },
            name: `${twelveHourFormat}-clockFormat}`,
            key: `${twelveHourFormat}-key`,
            value: 'false',
        },
        {
            dataTestId: `${twentyFourHourFormat}-test-id`,
            title: {
                id: 'user.settings.languageAndTime.TimeFormat.24Hour',
                defaultMessage: '24-hour clock (example: 16:00)',
            },
            name: `${twentyFourHourFormat}-clockFormat`,
            key: `${twelveHourFormat}-key`,
            value: 'true',
        },
    ],
};

export const dMsTitle = {
    id: t('user.settings.sidebar.direct.title'),
    defaultMessage: 'Direct messages',
};

export const channelsTitle = {
    id: t('user.settings.sidebar.channels.title'),
    defaultMessage: 'Channel categories',
};

export const unreadsInputFieldData: FieldsetCheckbox = {
    title: {
        id: 'user.settings.sidebar.showUnreadsCategoryTitle',
        defaultMessage: 'Group unread channels separately',
    },
    name: 'showUnreadsCategory',
    dataTestId: 'showUnreadsCategoryOn',
};

export const unreradsDescription = {
    id: t('user.settings.sidebar.showUnreadsCategoryDesc'),
    defaultMessage:
        'When enabled, all unread channels and direct messages will be grouped together in the sidebar.',
};

export const dmSortTitle = {
    id: 'user.settings.sidebar.DMsSorting',
    defaultMessage: 'Sort direct messages',
};

export const channelsSortTitle = {
    id: 'user.settings.sidebar.channelsSorting.title',
    defaultMessage: 'Default sort for channel categories',
};

export const channelsSortDesc = {
    id: 'user.settings.sidebar.channelsSorting.desc',
    defaultMessage:
        "You can override sorting for individual categories using the category's sidebar menu.",
};

export const sortInputFieldData: FieldsetRadio = {
    options: [
        {
            dataTestId: `dmSorting-${CategorySorting.Recency}`,
            title: {
                id: 'user.settings.sidebar.DMsSorting.alphabetically',
                defaultMessage: 'Alphabetically',
            },
            name: `dmSorting-${CategorySorting.Recency}`,
            key: `dmSorting-${CategorySorting.Alphabetical}`,
            value: CategorySorting.Alphabetical,
        },
        {
            dataTestId: `dmSorting-${CategorySorting.Recency}`,
            title: {
                id: 'user.settings.sidebar.DMsSorting.recent',
                defaultMessage: 'By recent activity',
            },
            name: `dmSorting-${CategorySorting.Recency}`,
            key: `dmSorting-${CategorySorting.Recency}`,
            value: CategorySorting.Recency,
        },
    ],
};

export const channelsSortInputFieldData: FieldsetRadio = {
    options: [
        {
            dataTestId: `channelsSorting-${CategorySorting.Recency}`,
            title: {
                id: 'user.settings.sidebar.channelsSorting.alphabetically',
                defaultMessage: 'Alphabetically',
            },
            name: `channelsSorting-${CategorySorting.Alphabetical}`,
            key: `channelsSorting-${CategorySorting.Alphabetical}`,
            value: CategorySorting.Alphabetical,
        },
        {
            dataTestId: `channelsSorting-${CategorySorting.Recency}`,
            title: {
                id: 'user.settings.sidebar.channelsSorting.recent',
                defaultMessage: 'By recent activity',
            },
            name: `channelsSorting-${CategorySorting.Recency}`,
            key: `channelsSorting-${CategorySorting.Recency}`,
            value: CategorySorting.Recency,
        },
        {
            dataTestId: `channelsSorting-${CategorySorting.Manual}`,
            title: {
                id: 'user.settings.sidebar.channelsSorting.manual',
                defaultMessage: 'Manually',
            },
            name: `channelsSorting-${CategorySorting.Manual}`,
            key: `channelsSorting-${CategorySorting.Manual}`,
            value: CategorySorting.Manual,
        },
    ],
};

export const languageSelectInputFieldData: FieldsetReactSelect = {
    options: languageLabels,
};

export const dmLimitTitle = {
    id: 'user.settings.sidebar.limitVisibleGMsDMsTitle',
    defaultMessage: 'Number of direct messages to show in the channel sidebar',
};

export const dmLimitDescription = {
    id: t('user.settings.sidebar.limitVisibleGMsDMsDesc'),
    defaultMessage:
        'You can change direct message settings using the direct messages sidebar menu.',
};
