// Copyright (c) 2015-present Mattermost, Inc. All Rights Reserved.
// See LICENSE.txt for license information.

import {connect} from 'react-redux';
import {ActionCreatorsMapObject, bindActionCreators, Dispatch} from 'redux';

import timezones from 'timezones.json';

import {
    getConfig,
    isPerformanceDebuggingEnabled,
} from 'mattermost-redux/selectors/entities/general';
import {
    getCurrentUser,
    getCurrentUserId,
} from 'mattermost-redux/selectors/entities/users';
import {
    get,
    getUnreadScrollPositionPreference,
    makeGetCategory,
} from 'mattermost-redux/selectors/entities/preferences';
import {savePreferences} from 'mattermost-redux/actions/preferences';
import {
    updateUserActive,
    revokeAllSessionsForUser,
    updateMe} from 'mattermost-redux/actions/users';

import {Preferences} from 'utils/constants';
import {Preferences as ReduxPreferences} from 'mattermost-redux/constants';

import {GlobalState} from 'types/store';
import {ActionFunc} from 'mattermost-redux/types/actions';

import {
    getTimezoneLabel,
    makeGetUserTimezone,
} from 'mattermost-redux/selectors/entities/timezone';

import UserSettingsLanguageAndTime, {
    Props,
} from './user_settings_language_and_time';

function makeMapStateToProps() {
    const getAdvancedSettingsCategory = makeGetCategory();

    return (state: GlobalState) => {
        const config = getConfig(state);
        const getUserTimezone = makeGetUserTimezone();
        const currentUserId = getCurrentUserId(state);

        const enablePreviewFeatures = config.EnablePreviewFeatures === 'true';
        const enableUserDeactivation = config.EnableUserDeactivation === 'true';
        const defaultClientLocale = config.DefaultClientLocale as string;
        const userTimezone = getUserTimezone(state, currentUserId);
        const timezoneLabel = getTimezoneLabel(state, currentUserId);

        return {
            user: getCurrentUser(state),
            defaultClientLocale,
            timezones,
            userTimezone,
            timezoneLabel,
            militaryTime: get(
                state,
                Preferences.CATEGORY_DISPLAY_SETTINGS,
                Preferences.USE_MILITARY_TIME,
                Preferences.USE_MILITARY_TIME_DEFAULT,
            ),
        };
    };
}

function mapDispatchToProps(dispatch: Dispatch) {
    return {
        actions: bindActionCreators(
            {
                savePreferences,
                updateUserActive,
                revokeAllSessionsForUser,
                updateMe,
            },
            dispatch,
        ),
    };
}

export default connect(
    makeMapStateToProps,
    mapDispatchToProps,
)(UserSettingsLanguageAndTime);
