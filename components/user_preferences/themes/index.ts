// Copyright (c) 2015-present Mattermost, Inc. All Rights Reserved.
// See LICENSE.txt for license information.

import {connect} from 'react-redux';

import {savePreferences, saveTheme, deleteTeamSpecificThemes} from 'mattermost-redux/actions/preferences';
import {getCurrentUserId} from 'mattermost-redux/selectors/entities/users';
import {GlobalState} from 'types/store';

import {getBool, getTheme, makeGetCategory} from 'mattermost-redux/selectors/entities/preferences';
import {getCurrentTeamId} from 'mattermost-redux/selectors/entities/teams';

import {Preferences} from 'utils/constants';
import {Preferences as ReduxPreferences} from 'mattermost-redux/constants';

import UserSettingsThemes from './user_settings_themes';
import {ThemeSettings} from './utils';

function mapStateToProps(state: GlobalState) {
    const getThemeCategory = makeGetCategory();

    return {
        currentUserId: getCurrentUserId(state),
        teamId: getCurrentTeamId(state),
        theme: getTheme(state),
        syncThemeWithOs: getBool(state, Preferences.CATEGORY_THEME, ThemeSettings.SYNC_THEME_WITH_OS, false),
        webLightTheme: ReduxPreferences.THEMES.denim,
        webDarkTheme: ReduxPreferences.THEMES.indigo,
        applyToAllTeams: getThemeCategory(state, Preferences.CATEGORY_THEME).length <= 1,
    };
}

const mapDispatchToProps = {
    savePreferences,
    saveTheme,
    deleteTeamSpecificThemes
    
};

export default connect(mapStateToProps, mapDispatchToProps)(UserSettingsThemes);
