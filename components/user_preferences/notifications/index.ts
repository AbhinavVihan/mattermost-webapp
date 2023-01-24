// Copyright (c) 2015-present Mattermost, Inc. All Rights Reserved.
// See LICENSE.txt for license information.

import {connect} from 'react-redux';
import {ActionCreatorsMapObject, bindActionCreators, Dispatch} from 'redux';

import {updateMe} from 'mattermost-redux/actions/users';
import {getConfig} from 'mattermost-redux/selectors/entities/general';
import {isCollapsedThreadsEnabled} from 'mattermost-redux/selectors/entities/preferences';
import {ActionFunc} from 'mattermost-redux/types/actions';
import {savePreferences} from 'mattermost-redux/actions/preferences';

import {GlobalState} from 'types/store';
import {get as getPreference} from 'mattermost-redux/selectors/entities/preferences';

import UserSettingsNotifications, {Props} from './user_settings_notifications';
import { Preferences } from 'mattermost-redux/constants';

function mapStateToProps(state: GlobalState) {
    const config = getConfig(state);

    const sendPushNotifications = config.SendPushNotifications === 'true';
    const enableAutoResponder = config.ExperimentalEnableAutomaticReplies === 'true';
    const emailInterval = parseInt(getPreference(
        state,
        Preferences.CATEGORY_NOTIFICATIONS,
        Preferences.EMAIL_INTERVAL,
        Preferences.INTERVAL_NOT_SET.toString(),
    ), 10);

    return {
        sendPushNotifications,
        enableAutoResponder,
        isCollapsedThreadsEnabled: isCollapsedThreadsEnabled(state),
        emailInterval,
        enableEmailBatching: config.EnableEmailBatching === 'true',
        sendEmailNotifications: config.SendEmailNotifications === 'true',
    };
}

function mapDispatchToProps(dispatch: Dispatch) {
    return {
        actions: bindActionCreators<ActionCreatorsMapObject<ActionFunc>, Props['actions']>({
            updateMe,
            savePreferences,
        }, dispatch),
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(UserSettingsNotifications);
