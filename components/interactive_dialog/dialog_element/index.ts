// Copyright (c) 2015-present Mattermost, Inc. All Rights Reserved.
// See LICENSE.txt for license information.

import {connect} from 'react-redux';
import {ActionCreatorsMapObject, bindActionCreators, Dispatch} from 'redux';

import {autocompleteChannels} from 'actions/channel_actions';
import {autocompleteUsers} from 'actions/user_actions';

import {ActionFunc, ActionResult, GenericAction} from 'mattermost-redux/types/actions';

import {UserProfile} from '@mattermost/types/users';

import {Channel} from '@mattermost/types/channels';

import {ServerError} from '@mattermost/types/errors';

import DialogElement from './dialog_element';

type Actions = {
    autocompleteChannels: (term: string, success: (channels: Channel[]) => void, error: (err: ServerError) => void) => ActionResult<any, any> | Promise<ActionResult<any, any> | Array<ActionResult<any, any>>>;
    autocompleteUsers: (search: string) => Promise<UserProfile[]>;
};

function mapDispatchToProps(dispatch: Dispatch<GenericAction>) {
    return {
        actions: bindActionCreators<ActionCreatorsMapObject<ActionFunc>, Actions>({
            autocompleteChannels,
            autocompleteUsers,
        }, dispatch),
    };
}

export default connect(null, mapDispatchToProps)(DialogElement);
