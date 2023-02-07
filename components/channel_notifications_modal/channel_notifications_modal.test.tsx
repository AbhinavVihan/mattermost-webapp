// Copyright (c) 2015-present Mattermost, Inc. All Rights Reserved.
// See LICENSE.txt for license information.

import React, {ComponentProps} from 'react';

import {screen, fireEvent, waitFor} from '@testing-library/react';

import {IgnoreChannelMentions, NotificationLevels} from 'utils/constants';
import {TestHelper} from 'utils/test_helper';

import ChannelNotificationsModal from 'components/channel_notifications_modal/channel_notifications_modal';

import {UserNotifyProps} from '@mattermost/types/users';
import {ChannelMembership} from '@mattermost/types/channels';
import {renderWithIntl} from '../../tests/react_testing_utils';

describe('components/channel_notifications_modal/ChannelNotificationsModal', () => {
    const baseProps: ComponentProps<typeof ChannelNotificationsModal> = {
        onExited: jest.fn(),
        channel: TestHelper.getChannelMock({
            id: 'channel_id',
            display_name: 'channel_display_name',
        }),
        channelMember: {
            notify_props: {
                desktop: NotificationLevels.ALL,
                mark_unread: NotificationLevels.ALL,
                push: NotificationLevels.DEFAULT,
                ignore_channel_mentions: IgnoreChannelMentions.DEFAULT,
                desktop_threads: NotificationLevels.ALL,
                push_threads: NotificationLevels.DEFAULT,
            },
        } as unknown as ChannelMembership,
        currentUser: TestHelper.getUserMock({
            id: 'current_user_id',
            notify_props: {
                desktop: NotificationLevels.ALL,
                desktop_threads: NotificationLevels.ALL,
            } as UserNotifyProps,
        }),
        sendPushNotifications: true,
        actions: {
            updateChannelNotifyProps: jest.fn(),
        },
        collapsedReplyThreads: true,
    };

    it('should not show other settings if channel is mute', async () => {
        const updateChannelNotifyProps = jest.fn();

        const props = {
            ...baseProps,
            actions: {
                ...baseProps.actions,
                updateChannelNotifyProps,
            },
        };
        const wrapper = renderWithIntl(
            <ChannelNotificationsModal {...props}/>,
        );

        const muteChannel = screen.getByTestId('muteChannel');

        fireEvent.click(muteChannel);
        expect(muteChannel).toBeChecked();
        const AlertBanner = screen.queryByText('This channel is muted');
        expect(AlertBanner).toBeVisible();

        expect(screen.queryByText('Desktop Notifications')).toBeNull();

        expect(screen.queryByText('Mobile Notifications')).toBeNull();

        fireEvent.click(screen.getByRole('button', {name: /Save/i}));
        await waitFor(() =>
            expect(updateChannelNotifyProps).toHaveBeenCalledWith(
                'current_user_id',
                'channel_id',
                {
                    desktop: baseProps.channelMember?.notify_props.desktop,
                    ignore_channel_mentions: 'off',
                    mark_unread: 'mention',
                    push: 'all',
                },
            ),
        );
        expect(wrapper).toMatchSnapshot();
    });

    test('should Ignore mentions for @channel, @here and @all', async () => {
        const updateChannelNotifyProps = jest.fn();

        const props = {
            ...baseProps,
            actions: {
                ...baseProps.actions,
                updateChannelNotifyProps,
            },
        };
        const wrapper = renderWithIntl(
            <ChannelNotificationsModal {...props}/>,
        );
        const ignoreChannel = screen.getByTestId('ignoreMentions');
        fireEvent.click(ignoreChannel);
        expect(ignoreChannel).toBeChecked();

        fireEvent.click(screen.getByRole('button', {name: /Save/i}));
        await waitFor(() =>
            expect(updateChannelNotifyProps).toHaveBeenCalledWith(
                'current_user_id',
                'channel_id',
                {
                    desktop: 'all',
                    ignore_channel_mentions: 'on',
                    mark_unread:
                        baseProps.channelMember?.notify_props.mark_unread,
                    push: 'all',
                },
            ),
        );
        expect(wrapper).toMatchSnapshot();
    });

    test('should check the options in the desktop notifications', async () => {
        const updateChannelNotifyProps = jest.fn();

        const props = {
            ...baseProps,
            actions: {
                ...baseProps.actions,
                updateChannelNotifyProps,
            },
        };
        const wrapper = renderWithIntl(
            <ChannelNotificationsModal {...props}/>,
        );

        expect(screen.queryByText('Desktop Notifications')).toBeVisible();

        const AlllabelRadio: HTMLInputElement = screen.getByTestId(
            'desktopNotification-all',
        );
        fireEvent.click(AlllabelRadio);
        expect(AlllabelRadio.checked).toEqual(true);

        const MentionslabelRadio: HTMLInputElement = screen.getByTestId(
            'desktopNotification-mention',
        );
        fireEvent.click(MentionslabelRadio);
        expect(MentionslabelRadio.checked).toEqual(true);

        const NothinglabelRadio: HTMLInputElement = screen.getByTestId(
            'desktopNotification-none',
        );
        fireEvent.click(NothinglabelRadio);
        expect(NothinglabelRadio.checked).toEqual(true);

        fireEvent.click(screen.getByRole('button', {name: /Save/i}));
        await waitFor(() =>
            expect(updateChannelNotifyProps).toHaveBeenCalledWith(
                'current_user_id',
                'channel_id',
                {
                    desktop: 'none',
                    ignore_channel_mentions: 'off',
                    mark_unread: 'all',
                    push: 'all',
                },
            ),
        );
        expect(wrapper).toMatchSnapshot();
    });

    test('should save the options exactly same as Desktop if use same as desktop checkbox is checked', async () => {
        const updateChannelNotifyProps = jest.fn();

        const props = {
            ...baseProps,
            actions: {
                ...baseProps.actions,
                updateChannelNotifyProps,
            },
        };
        const wrapper = renderWithIntl(
            <ChannelNotificationsModal {...props}/>,
        );

        expect(screen.queryByText('Desktop Notifications')).toBeVisible();

        const sameAsDesktop: HTMLInputElement = screen.getByTestId(
            'sameMobileSettingsDesktop',
        );
        fireEvent.click(sameAsDesktop);
        expect(sameAsDesktop.checked).toEqual(true);

        expect(screen.queryByText('All new messages')).toBeNull();

        fireEvent.click(screen.getByRole('button', {name: /Save/i}));
        await waitFor(() =>
            expect(updateChannelNotifyProps).toHaveBeenCalledWith(
                'current_user_id',
                'channel_id',
                {
                    desktop: 'all',
                    ignore_channel_mentions: 'off',
                    mark_unread: 'all',
                    push: 'all',
                },
            ),
        );
        expect(wrapper).toMatchSnapshot();
    });

    test('should check the options in the desktop notifications', async () => {
        const updateChannelNotifyProps = jest.fn();

        const props = {
            ...baseProps,
            actions: {
                ...baseProps.actions,
                updateChannelNotifyProps,
            },
        };
        const wrapper = renderWithIntl(
            <ChannelNotificationsModal {...props}/>,
        );

        const AlllabelRadio: HTMLInputElement = screen.getByTestId(
            'MobileNotification-all',
        );
        fireEvent.click(AlllabelRadio);
        expect(AlllabelRadio.checked).toEqual(true);

        const MentionslabelRadio: HTMLInputElement = screen.getByTestId(
            'MobileNotification-mention',
        );
        fireEvent.click(MentionslabelRadio);
        expect(MentionslabelRadio.checked).toEqual(true);

        const NothinglabelRadio: HTMLInputElement = screen.getByTestId(
            'MobileNotification-none',
        );
        fireEvent.click(NothinglabelRadio);
        expect(NothinglabelRadio.checked).toEqual(true);

        fireEvent.click(screen.getByRole('button', {name: /Save/i}));
        await waitFor(() =>
            expect(updateChannelNotifyProps).toHaveBeenCalledWith(
                'current_user_id',
                'channel_id',
                {
                    desktop: 'all',
                    ignore_channel_mentions: 'off',
                    mark_unread: 'all',
                    push: 'none',
                },
            ),
        );
        expect(wrapper).toMatchSnapshot();
    });
});
