// Copyright (c) 2015-present Mattermost, Inc. All Rights Reserved.
// See LICENSE.txt for license information.

import React from 'react';
import {screen, fireEvent} from '@testing-library/react';
import {Provider} from 'react-redux';

import mockStore from 'tests/test_store';

import {Post} from '@mattermost/types/posts';
import {renderWithIntl} from '../../tests/react_testing_utils';

import {PostReminderSubmenu} from './post_reminder_submenu';

describe('components/dot_menu/PostReminderCustomTimePicker', () => {
    const latestPost = {
        id: '1y8hpek81byspd4enyk9mp1ncw',
        user_id: 'mt5td9mdriyapmwuh5pc84dmhr',
        channel_id: 'pnzsh7kwt7rmzgj8yb479sc9yw',
        message: 'test msg',
        create_at: 1610486901110,
        edit_at: 1611786714912,
    } as Post;
    const state = {
        entities: {
            general: {
                config: {},
            },
            channels: {
                myMembers: {
                    current_channel_id: {
                        channel_id: 'current_channel_id',
                        user_id: 'current_user_id',
                    },
                    direct_other_user: {
                        channel_id: 'direct_other_user',
                        user_id: 'current_user_id',
                        roles: 'channel_role',
                        last_viewed_at: 10,
                    },
                    channel_other_user: {
                        channel_id: 'channel_other_user',
                    },
                },
                channels: {
                    direct_other_user: {
                        id: 'direct_other_user',
                        name: 'current_user_id__other_user',
                    },
                },
                messageCounts: {
                    direct_other_user: {
                        root: 2,
                        total: 2,
                    },
                },
            },
            preferences: {
                myPreferences: {},
            },
            users: {
                profiles: {
                    current_user_id: {roles: 'system_role'},
                    other_user1: {
                        id: 'other_user1',
                        display_name: 'other_user1',
                        username: 'other_user1',
                    },
                },
                currentUserId: 'current_user_id',
                profilesInChannel: {
                    current_user_id: ['user_1'],
                },
            },
            teams: {
                currentTeamId: 'currentTeamId',
                teams: {
                    currentTeamId: {
                        id: 'currentTeamId',
                        display_name: 'test',
                        type: 'O',
                    },
                },
            },
            posts: {
                posts: {
                    [latestPost.id]: latestPost,
                },
                postsInChannel: {
                    other_gm_channel: [
                        {order: [latestPost.id], recent: true},
                    ],
                },
                postsInThread: {},
            },
        },
        views: {
            browser: {
                focused: false,
                windowSize: 'desktopView',
            },
            modals: {
                modalState: {},
                showLaunchingWorkspace: false,
            },
        },
    };
    const store = mockStore(state);
    const baseProps = {
        userId: latestPost.user_id,
        post: latestPost,
        isMilitaryTime: false,
        addPostReminder: jest.
            fn().
            mockImplementation(() => Promise.resolve({data: true})),
    };

    test("should submit the tomorrow's date in milliseconds for the reminder on a post", async () => {
        const wrapper = renderWithIntl(
            <Provider store={store}>
                <PostReminderSubmenu {...baseProps}/>
            </Provider>,
        );

        fireEvent.mouseOver(screen.getByText('Remind'));

        const after30Mins = screen.getByText('30 mins');

        fireEvent.click(after30Mins);

        expect(baseProps.addPostReminder).toHaveBeenCalled();
        const d = new Date(Date.now());
        const currentTime = Number(d.getTime().toString().substring(0, 10));
        const expectedTime = currentTime + 1801;

        expect(baseProps.addPostReminder).lastCalledWith(latestPost.user_id, latestPost.id, expectedTime);

        expect(wrapper).toMatchSnapshot();
    });
},

);
