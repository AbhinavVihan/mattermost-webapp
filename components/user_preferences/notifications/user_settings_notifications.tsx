// Copyright (c) 2015-present Mattermost, Inc. All Rights Reserved.
// See LICENSE.txt for license information.

/* eslint-disable max-lines */

import React, {RefObject} from 'react';

import semver from 'semver';

import {ActionResult} from 'mattermost-redux/types/actions';

import Constants, {NotificationLevels} from 'utils/constants';
import {localizeMessage, moveCursorToEnd} from 'utils/utils';
import {isDesktopApp} from 'utils/user_agent';

import SectionCreator from 'components/widgets/modals/generic/section_creator';

import {UserNotifyProps, UserProfile} from '@mattermost/types/users';

import SaveChangesPanel from 'components/widgets/modals/generic/save_changes_panel';

import {PreferenceType} from '@mattermost/types/preferences';

import DesktopNotificationSettings from './desktop_notification_settings';
import {EmailNotificationsSetting} from './email_notification_setting/email_notification_setting';
import {ManageAutoResponderSection} from './manage_auto_responder';
import {MobileNotificationsSettings} from './mobile_notification_Settings';

import {MentionKeyWordsSetting} from './mention_keywords_setting';
import {DesktopNotificationsDesc, DesktopNotificationsTitle, emailNotificationSettingDesc, emailNotificationSettingTitle} from './utils';

export type Props = {
    user: UserProfile;
    updateSection: (section: string) => void;
    activeSection: string;
    closeModal: () => void;
    collapseModal: () => void;
    sendPushNotifications: boolean;
    enableAutoResponder: boolean;
    actions: {
        updateMe: (user: UserProfile) => Promise<ActionResult>;
        savePreferences: (
            currentUserId: string,
            emailIntervalPreference: PreferenceType[]
        ) => Promise<{ data: boolean }>; };
    isCollapsedThreadsEnabled: boolean;
    emailInterval: number;
    enableEmailBatching: boolean;
    sendEmailNotifications: boolean;
}

type State = {
    enableEmail: UserNotifyProps['email'];
    desktopActivity: UserNotifyProps['desktop'];
    desktopThreads: UserNotifyProps['desktop_threads'];
    pushThreads: UserNotifyProps['push_threads'];
    emailThreads: UserNotifyProps['email_threads'];
    pushActivity: UserNotifyProps['push'];
    pushStatus: UserNotifyProps['push_status'];
    desktopSound: UserNotifyProps['desktop_sound'];
    desktopNotificationSound: UserNotifyProps['desktop_notification_sound'];
    usernameKey: boolean;
    customKeys: string;
    customKeysChecked: boolean;
    firstNameKey: boolean;
    channelKey: boolean;
    autoResponderActive: boolean;
    autoResponderMessage: UserNotifyProps['auto_responder_message'];
    notifyCommentsLevel: UserNotifyProps['comments'];
    isSaving: boolean;
    serverError: string;
    haveChanges: boolean;
};

function getNotificationsStateFromProps(props: Props): State {
    const user = props.user;

    let desktop: UserNotifyProps['desktop'] = NotificationLevels.MENTION;
    let desktopThreads: UserNotifyProps['desktop_threads'] = NotificationLevels.ALL;
    let pushThreads: UserNotifyProps['push_threads'] = NotificationLevels.ALL;
    let emailThreads: UserNotifyProps['email_threads'] = NotificationLevels.ALL;
    let sound: UserNotifyProps['desktop_sound'] = 'true';
    let desktopNotificationSound: UserNotifyProps['desktop_notification_sound'] = 'Bing';
    let comments: UserNotifyProps['comments'] = 'never';
    let enableEmail: UserNotifyProps['email'] = 'true';
    let pushActivity: UserNotifyProps['push'] = NotificationLevels.MENTION;
    let pushStatus: UserNotifyProps['push_status'] = Constants.UserStatuses.AWAY;
    let autoResponderActive = false;
    let autoResponderMessage: UserNotifyProps['auto_responder_message'] = localizeMessage(
        'user.settings.notifications.autoResponderDefault',
        'Hello, I am out of office and unable to respond to messages.',
    );

    if (user.notify_props) {
        if (user.notify_props.desktop) {
            desktop = user.notify_props.desktop;
        }
        if (user.notify_props.desktop_threads) {
            desktopThreads = user.notify_props.desktop_threads;
        }
        if (user.notify_props.push_threads) {
            pushThreads = user.notify_props.push_threads;
        }
        if (user.notify_props.email_threads) {
            emailThreads = user.notify_props.email_threads;
        }
        if (user.notify_props.desktop_sound) {
            sound = user.notify_props.desktop_sound;
        }
        if (user.notify_props.desktop_notification_sound) {
            desktopNotificationSound = user.notify_props.desktop_notification_sound;
        }
        if (user.notify_props.comments) {
            comments = user.notify_props.comments;
        }
        if (user.notify_props.email) {
            enableEmail = user.notify_props.email;
        }
        if (user.notify_props.push) {
            pushActivity = user.notify_props.push;
        }
        if (user.notify_props.push_status) {
            pushStatus = user.notify_props.push_status;
        }

        if (user.notify_props.auto_responder_active) {
            autoResponderActive = user.notify_props.auto_responder_active === 'true';
        }

        if (user.notify_props.auto_responder_message) {
            autoResponderMessage = user.notify_props.auto_responder_message;
        }
    }

    let usernameKey = false;
    let customKeys = '';
    let firstNameKey = false;
    let channelKey = false;

    if (user.notify_props) {
        if (user.notify_props.mention_keys) {
            const keys = user.notify_props.mention_keys.split(',');

            if (keys.indexOf(user.username) === -1) {
                usernameKey = false;
            } else {
                usernameKey = true;
                keys.splice(keys.indexOf(user.username), 1);
                if (keys.indexOf(`@${user.username}`) !== -1) {
                    keys.splice(keys.indexOf(`@${user.username}`), 1);
                }
            }

            customKeys = keys.join(',');
        }

        if (user.notify_props.first_name) {
            firstNameKey = user.notify_props.first_name === 'true';
        }

        if (user.notify_props.channel) {
            channelKey = user.notify_props.channel === 'true';
        }
    }

    return {
        desktopActivity: desktop,
        desktopThreads,
        pushThreads,
        emailThreads,
        enableEmail,
        pushActivity,
        pushStatus,
        desktopSound: sound,
        desktopNotificationSound,
        usernameKey,
        customKeys,
        customKeysChecked: customKeys.length > 0,
        firstNameKey,
        channelKey,
        autoResponderActive,
        autoResponderMessage,
        notifyCommentsLevel: comments,
        isSaving: false,
        serverError: '',
        haveChanges: false,
    };
}

export default class NotificationsTab extends React.PureComponent<Props, State> {
    customCheckRef: RefObject<HTMLInputElement>;
    customMentionsRef: RefObject<HTMLInputElement>;
    drawerRef: RefObject<HTMLHeadingElement>;
    wrapperRef: RefObject<HTMLDivElement>;

    static defaultProps = {
        activeSection: '',
    }

    constructor(props: Props) {
        super(props);

        this.state = getNotificationsStateFromProps(props);
        this.customCheckRef = React.createRef();
        this.customMentionsRef = React.createRef();
        this.drawerRef = React.createRef();
        this.wrapperRef = React.createRef();
    }

    handleSubmit = (): void => {
        const data: UserNotifyProps = {} as UserNotifyProps;
        data.email = this.state.enableEmail;
        data.desktop_sound = this.state.desktopSound;
        if (!isDesktopApp() || (window.desktop && semver.gte(window.desktop.version || '', '4.6.0'))) {
            data.desktop_notification_sound = this.state.desktopNotificationSound;
        }
        data.desktop = this.state.desktopActivity;
        data.desktop_threads = this.state.desktopThreads;
        data.email_threads = this.state.emailThreads;
        data.push_threads = this.state.pushThreads;
        data.push = this.state.pushActivity;
        data.push_status = this.state.pushStatus;
        data.comments = this.state.notifyCommentsLevel;
        data.auto_responder_active = this.state.autoResponderActive.toString() as UserNotifyProps['auto_responder_active'];
        data.auto_responder_message = this.state.autoResponderMessage;

        if (!data.auto_responder_message || data.auto_responder_message === '') {
            data.auto_responder_message = localizeMessage(
                'user.settings.notifications.autoResponderDefault',
                'Hello, I am out of office and unable to respond to messages.',
            );
        }

        const mentionKeys = [];
        if (this.state.usernameKey) {
            mentionKeys.push(this.props.user.username);
        }

        let stringKeys = mentionKeys.join(',');
        if (this.state.customKeys.length > 0) {
            stringKeys += ',' + this.state.customKeys;
        }

        data.mention_keys = stringKeys;
        data.first_name = this.state.firstNameKey.toString() as UserNotifyProps['first_name'];
        data.channel = this.state.channelKey.toString() as UserNotifyProps['channel'];

        this.setState({isSaving: true});

        this.props.actions.updateMe({notify_props: data} as UserProfile).
            then(({data: result, error: err}) => {
                if (result) {
                    this.handleUpdateSection('');
                    this.setState(getNotificationsStateFromProps(this.props));
                } else if (err) {
                    this.setState({serverError: err.message, isSaving: false});
                }
            });
    }

    handleCancel = (): void => this.setState(getNotificationsStateFromProps(this.props));

    handleUpdateSection = (section: string): void => {
        if (section) {
            this.props.updateSection(section);
        } else {
            this.props.updateSection('');
        }
        this.setState({isSaving: false});
        this.handleCancel();
    };

    setStateValue = (key: string, value: string | boolean): void => {
        const data: {[key: string]: string | boolean } = {};
        data[key] = value;
        this.setState((prevState) => ({...prevState, ...data}));
    }

    handleEmailRadio = (enableEmail: UserNotifyProps['email']): void => this.setState({enableEmail});

    getUseSameDesktopSetting = () => {
        const isSameAsDesktopActivity = this.state.desktopActivity === this.state.pushActivity;
        const isSameAsDesktopThreads = this.state.desktopThreads === this.state.pushThreads;
        return isSameAsDesktopActivity && isSameAsDesktopThreads;
    }

    render() {
        const autoResponderSection =
            (<ManageAutoResponderSection
                autoResponderActive={this.state.autoResponderActive}
                autoResponderMessage={this.state.autoResponderMessage || ''}
                updateSection={this.handleUpdateSection}
                setParentState={this.setStateValue}
                submit={this.handleSubmit}
                error={this.state.serverError}
                saving={this.state.isSaving}
            />);

        const pushNotificationSection = (<MobileNotificationsSettings
            user={this.props.user}
            updateMe={this.props.actions.updateMe}
            setParentState={this.setStateValue}
            activity={this.state.pushActivity}
            threads={this.state.pushThreads}
            getUseSameDesktopSetting={this.getUseSameDesktopSetting}
            pushStatus={this.state.pushStatus}
            deskTopActivity={this.state.desktopActivity}
            desktopThreads={this.state.desktopThreads}
        />);

        const mentionKeyWordsSection = (<MentionKeyWordsSetting
            setParentState={this.setStateValue}
            firstNameKey={this.state.firstNameKey}
            channelKey={this.state.channelKey}
            firstName={this.props.user.first_name}
            customKeys={this.state.customKeys}
                                        />);

        const desktopAndWebNotificationContent = (
            <DesktopNotificationSettings
                activity={this.state.desktopActivity}
                threads={this.state.desktopThreads}
                sound={this.state.desktopSound}
                updateSection={this.handleUpdateSection}
                setParentState={this.setStateValue}
                submit={this.handleSubmit}
                saving={this.state.isSaving}
                cancel={this.handleCancel}
                error={this.state.serverError}
                active={this.props.activeSection === 'desktop'}
                selectedSound={this.state.desktopNotificationSound || 'default'}
                isCollapsedThreadsEnabled={this.props.isCollapsedThreadsEnabled}
            />
        );

        const emailNotificationSettingContent = (
            <EmailNotificationsSetting
                enableEmail={this.state.enableEmail === 'true'}
                onSubmit={this.handleSubmit}
                onCancel={this.handleCancel}
                onChange={this.handleEmailRadio}
                saving={this.state.isSaving}
                serverError={this.state.serverError}
                setParentState={this.setStateValue}
                user={this.props.user}
                savePreferences={this.props.actions.savePreferences}
                emailInterval={this.props.emailInterval}
                enableEmailBatching={this.props.enableEmailBatching}
                sendEmailNotifications={this.props.sendEmailNotifications}
            />
        );

        return (
            <div
                ref={this.wrapperRef}
                className='user-settings'
                id='notificationSettings'
            >
                <SectionCreator
                    title={DesktopNotificationsTitle}
                    description={DesktopNotificationsDesc}
                    content={desktopAndWebNotificationContent}
                />
                <div className='divider-light'/>
                {pushNotificationSection}
                <SectionCreator
                    title={emailNotificationSettingTitle}
                    description={emailNotificationSettingDesc}
                    content={emailNotificationSettingContent}
                />
                <div className='divider-light'/>
                {mentionKeyWordsSection}
                {autoResponderSection}
                <div className='divider-dark'/>
                {this.state.haveChanges && <SaveChangesPanel
                    handleSubmit={this.handleSubmit}
                    handleCancel={this.handleCancel}
                                           />}
            </div>
        );
    }
}
