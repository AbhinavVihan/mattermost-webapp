// Copyright (c) 2015-present Mattermost, Inc. All Rights Reserved.
// See LICENSE.txt for license information.

import { connect } from "react-redux";
import { ActionCreatorsMapObject, bindActionCreators, Dispatch } from "redux";

import timezones from "timezones.json";

import {
    getConfig,
    getLicense,
    isPerformanceDebuggingEnabled,
} from "mattermost-redux/selectors/entities/general";
import {
    getCurrentUser,
    getCurrentUserId,
} from "mattermost-redux/selectors/entities/users";
import {
    get,
    getCollapsedThreadsPreference,
    getUnreadScrollPositionPreference,
    makeGetCategory,
} from "mattermost-redux/selectors/entities/preferences";
import { savePreferences } from "mattermost-redux/actions/preferences";
import {
    updateUserActive,
    revokeAllSessionsForUser,
    updateMe,
} from "mattermost-redux/actions/users";

import { Preferences } from "utils/constants";
import { Preferences as ReduxPreferences } from "mattermost-redux/constants";

import { GlobalState } from "types/store";
import { ActionFunc } from "mattermost-redux/types/actions";

import {
    getTimezoneLabel,
    makeGetUserTimezone,
} from "mattermost-redux/selectors/entities/timezone";

import UserSettingsLanguageAndTime, {
    Props,
} from "./user_settings_messages_and_ media";

function makeMapStateToProps() {
    const getAdvancedSettingsCategory = makeGetCategory();

    return (state: GlobalState) => {
        const config = getConfig(state);
        const getUserTimezone = makeGetUserTimezone();
        const currentUserId = getCurrentUserId(state);

        const enablePreviewFeatures = config.EnablePreviewFeatures === "true";
        const enableUserDeactivation = config.EnableUserDeactivation === "true";
        const defaultClientLocale = config.DefaultClientLocale as string;
        const userTimezone = getUserTimezone(state, currentUserId);
        const timezoneLabel = getTimezoneLabel(state, currentUserId);
        const lockTeammateNameDisplay =
            getLicense(state).LockTeammateNameDisplay === "true" &&
            config.LockTeammateNameDisplay === "true";
        const configTeammateNameDisplay = config.TeammateNameDisplay as string;

        return {
            currentUser: getCurrentUser(state),
            messageDisplay: get(
                state,
                Preferences.CATEGORY_DISPLAY_SETTINGS,
                Preferences.MESSAGE_DISPLAY,
                Preferences.MESSAGE_DISPLAY_DEFAULT
            ),
            channelDisplayMode: get(
                state,
                Preferences.CATEGORY_DISPLAY_SETTINGS,
                Preferences.CHANNEL_DISPLAY_MODE,
                Preferences.CHANNEL_DISPLAY_MODE_DEFAULT
            ),
            lockTeammateNameDisplay,
            configTeammateNameDisplay,
            teammateNameDisplay: get(
                state,
                Preferences.CATEGORY_DISPLAY_SETTINGS,
                Preferences.NAME_NAME_FORMAT,
                configTeammateNameDisplay
            ),
            availabilityStatusOnPosts: get(
                state,
                Preferences.CATEGORY_DISPLAY_SETTINGS,
                Preferences.AVAILABILITY_STATUS_ON_POSTS,
                Preferences.AVAILABILITY_STATUS_ON_POSTS_DEFAULT
            ),
            collapsedReplyThreads: getCollapsedThreadsPreference(state),
            clickToReply: get(
                state,
                Preferences.CATEGORY_DISPLAY_SETTINGS,
                Preferences.CLICK_TO_REPLY,
                Preferences.CLICK_TO_REPLY_DEFAULT
            ),
            collapseDisplay: get(
                state,
                Preferences.CATEGORY_DISPLAY_SETTINGS,
                Preferences.COLLAPSE_DISPLAY,
                Preferences.COLLAPSE_DISPLAY_DEFAULT
            ),
            linkPreviewDisplay: get(
                state,
                Preferences.CATEGORY_DISPLAY_SETTINGS,
                Preferences.LINK_PREVIEW_DISPLAY,
                Preferences.LINK_PREVIEW_DISPLAY_DEFAULT
            ),
            oneClickReactionsOnPosts: get(
                state,
                Preferences.CATEGORY_DISPLAY_SETTINGS,
                Preferences.ONE_CLICK_REACTIONS_ENABLED,
                Preferences.ONE_CLICK_REACTIONS_ENABLED_DEFAULT
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
            dispatch
        ),
    };
}

export default connect(
    makeMapStateToProps,
    mapDispatchToProps
)(UserSettingsLanguageAndTime);
