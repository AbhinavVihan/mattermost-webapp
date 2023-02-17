// Copyright (c) 2015-present Mattermost, Inc. All Rights Reserved.
// See LICENSE.txt for license information.

import React from 'react';
import {screen, fireEvent, waitFor} from '@testing-library/react';
import {Provider} from 'react-redux';

import mockStore from 'tests/test_store';

import {renderWithIntl} from '../../tests/react_testing_utils';

import PostReminderCustomTimePicker from './post_reminder_custom_time_picker_modal';

describe('components/dot_menu/PostReminderCustomTimePicker', () => {
    const latestPost = {
        id: 'latest_post_id',
        user_id: 'current_user_id',
        message: 'test msg',
        channel_id: 'other_gm_channel',
        create_at: Date.now(),
    };
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
        onExited: jest.fn(),
        userId: 'user_id_1',
        postId: 'post_Id_1',
        currentDate: new Date(
            'Wed Feb 15 2023 12:39:48 GMT+0530 (India Standard Time)',
        ),
        isMilitaryTime: false,
        actions: {
            addPostReminder: jest.
                fn().
                mockImplementation(() => Promise.resolve({data: true})),
        },
    };

    test("should submit the tomorrow's date in milliseconds for the reminder on a post", async () => {
        const wrapper = renderWithIntl(
            <Provider store={store}>
                <PostReminderCustomTimePicker {...baseProps}/>
            </Provider>,
        );
        const dateinISO = new Date();

        const input =
            screen.getByTestId('dayPicker-input').children[2].children[0];
        fireEvent.click(input);

        const dateToday = new Date(Date.now()).toString().split(' ')[2];
        const thisMonth = dateinISO.getMonth() + 1;

        const inputDate = `${
            new Date(Date.now()).toString().split(' ')[3]
        }-${thisMonth}-${Number(dateToday) + 1}`;

        fireEvent.change(input, {target: {value: inputDate}});

        const submitButton = screen.getByRole('button', {
            name: 'Set reminder',
        });
        expect(submitButton).toBeVisible();
        fireEvent.click(submitButton);

        const toCheckDate = new Date(inputDate);
        const resultedTime = toCheckDate.getTime();

        expect(baseProps.actions.addPostReminder).toHaveBeenCalled();

        await waitFor(() =>
            expect(baseProps.actions.addPostReminder).toHaveBeenCalledWith(
                baseProps.userId,
                baseProps.postId,
                Number(resultedTime.
                    toString().
                    substring(0, resultedTime.toString().length - 3)),
            ),
        );

        expect(wrapper).toMatchSnapshot();
    });

    test('should submit the selected time in milliseconds for the reminder on a post', async () => {
        const wrapper = renderWithIntl(
            <Provider store={store}>
                <PostReminderCustomTimePicker {...baseProps}/>
            </Provider>,
        );
        const timeNow = new Date().toString().split(' ')[4].split(':');
        const hours = Number(timeNow[0]);
        const minutes = Number(timeNow[1]);

        // console.log(timeNow);

        // calculate
        let timeValue;

        if (hours > 0 && hours <= 12) {
            timeValue = String(hours);
        } else if (hours > 12) {
            timeValue = String(hours - 12);
        } else if (hours === 0) {
            timeValue = '12';
        }

        timeValue += minutes < 10 ? ':0' + minutes : ':' + minutes; // get minutes
        timeValue += hours >= 12 ? ' PM' : ' AM'; // get AM/PM

        const calcHours = Number(timeValue?.toString().split(':')[0]) + 1;

        const selectTime = `${calcHours}:00 ${
            Number(hours) > 12 ? 'PM' : 'AM'
        }`;

        const button = screen.getByTestId('timePicker-button');
        expect(button).toBeVisible();
        fireEvent.click(button);

        // const time = screen.getByText(selectTime);
        const timetoSelect = screen.getByRole('button', {name: `${selectTime} hours`});
        expect(timetoSelect).toBeVisible();
        fireEvent.click(timetoSelect);

        const submitButton = screen.getByRole('button', {
            name: 'Set reminder',
        });
        expect(submitButton).toBeVisible();
        fireEvent.click(submitButton);

        expect(wrapper).toMatchSnapshot();
    });
});
