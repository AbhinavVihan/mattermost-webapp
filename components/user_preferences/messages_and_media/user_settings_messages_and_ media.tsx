// Copyright (c) 2015-present Mattermost, Inc. All Rights Reserved.
// See LICENSE.txt for license information.

import React, {useCallback, useState} from 'react';

import {ActionFunc} from 'mattermost-redux/types/actions';
import Constants from 'utils/constants';

import SectionCreator from 'components/widgets/modals/generic/section_creator';
import RadioItemCreator from 'components/widgets/modals/generic/radio-item-creator';
import SaveChangesPanel from 'components/widgets/modals/generic/save_changes_panel';

import CheckboxItemCreator from 'components/widgets/modals/generic/checkbox-item-creator';

import {PreferenceType} from '@mattermost/types/preferences';
import {UserProfile} from '@mattermost/types/users';

const {Preferences} = Constants;

import {
    enableCRTData,
    imagePreviewsData,
    MessageDensityData,
    messageDensityTitle,
    messageDisplayDescription,
    messageDisplayTtle,
    MessageWidthData,
    messageWidthTitle,
    openThreadsData,
    previewsTitle,
    profileStatusData,
    profileStatusTitle,
    quickReactionCheckboxData,
    quickReactionDescription,
    quickReactionRadioData,
    quickReactionRadioTitle,
    quickReactionTitle,
    reactionsDemoTitle,
    teammateNameData,
    teamMateNameDisplayTitle,
    threadsTitle,
    websitePreviewsData,
} from './utils';

export type Props = {
    currentUser: UserProfile;
    messageDisplay: string;
    channelDisplayMode: string;
    lockTeammateNameDisplay: boolean;
    configTeammateNameDisplay: string;
    teammateNameDisplay: string;
    availabilityStatusOnPosts: string;
    collapsedReplyThreads: string;
    clickToReply: string;
    collapseDisplay: string;
    linkPreviewDisplay: string;
    oneClickReactionsOnPosts: string;
    actions: {
        savePreferences: (
            userId: string,
            preferences: PreferenceType[]
        ) => void;
        updateMe: (user: UserProfile) => ActionFunc;
    };
};

type settingsType = {
    [key: string]: string;
};

export default function UserSettingsMessageesAndMedia(props: Props) {
    const [haveChanges, setHaveChanges] = useState(false);
    const [settings, setSettings] = useState<settingsType>({
        collapsed_reply_threads: props.collapsedReplyThreads,
        name_format: props.lockTeammateNameDisplay ?
            props.configTeammateNameDisplay :
            props.teammateNameDisplay,
        availability_status_on_posts: props.availabilityStatusOnPosts,
        collapse_previews: props.collapseDisplay,
        link_previews: props.linkPreviewDisplay,
        one_click_reactions_enabled: props.oneClickReactionsOnPosts,
        click_to_reply: props.collapseDisplay,
        message_display: props.messageDisplay,
        channel_display_mode: props.channelDisplayMode,
    });

    const messageDensityContainer = (
        <RadioItemCreator
            inputFieldValue={settings.message_display}
            inputFieldData={MessageDensityData}
            handleChange={(e) => {
                handleChange({
                    [Preferences.MESSAGE_DISPLAY]:
                        e.target.value === Preferences.MESSAGE_DISPLAY_CLEAN ?
                            Preferences.MESSAGE_DISPLAY_CLEAN :
                            Preferences.MESSAGE_DISPLAY_COMPACT,
                });
            }}
        />
    );

    const messageWidthContainer = (
        <RadioItemCreator
            inputFieldValue={settings.channel_display_mode}
            inputFieldData={MessageWidthData}
            handleChange={(e) => {
                handleChange({
                    [Preferences.CHANNEL_DISPLAY_MODE]:
                        e.target.value ===
                        Preferences.CHANNEL_DISPLAY_MODE_FULL_SCREEN ?
                            Preferences.CHANNEL_DISPLAY_MODE_FULL_SCREEN :
                            Preferences.CHANNEL_DISPLAY_MODE_CENTERED,
                });
            }}
        />
    );

    const teamMateNameContainer = (
        <RadioItemCreator
            inputFieldValue={settings.name_format}
            inputFieldData={teammateNameData}
            handleChange={(e) => {
                let name = settings.name_format;
                if (
                    e.target.value ===
                    Constants.TEAMMATE_NAME_DISPLAY.SHOW_USERNAME
                ) {
                    name = Constants.TEAMMATE_NAME_DISPLAY.SHOW_USERNAME;
                } else if (
                    e.target.value ===
                    Constants.TEAMMATE_NAME_DISPLAY.SHOW_FULLNAME
                ) {
                    name = Constants.TEAMMATE_NAME_DISPLAY.SHOW_FULLNAME;
                } else {
                    name =
                        Constants.TEAMMATE_NAME_DISPLAY.SHOW_NICKNAME_FULLNAME;
                }
                handleChange({
                    [Preferences.NAME_NAME_FORMAT]: name,
                });
            }}
        />
    );

    const profileStatusContainer = (
        <CheckboxItemCreator
            inputFieldData={profileStatusData}
            inputFieldValue={settings.availability_status_on_posts === 'true'}
            handleChange={(e) => {
                handleChange({
                    [Preferences.AVAILABILITY_STATUS_ON_POSTS]: e.toString(),
                });
            }}
        />
    );

    const ThreadsContainer = (
        <>
            <CheckboxItemCreator
                inputFieldData={enableCRTData}
                inputFieldValue={
                    settings.collapsed_reply_threads ===
                    Preferences.COLLAPSED_REPLY_THREADS_ON
                }
                handleChange={(e) => {
                    handleChange({
                        [Preferences.COLLAPSED_REPLY_THREADS]:
                            e === true ?
                                Preferences.COLLAPSED_REPLY_THREADS_ON :
                                Preferences.COLLAPSED_REPLY_THREADS_OFF,
                    });
                }}
                description={enableCRTData.description}
            />
            <CheckboxItemCreator
                inputFieldData={openThreadsData}
                inputFieldValue={settings.click_to_reply === 'true'}
                handleChange={(e) => {
                    handleChange({
                        [Preferences.CLICK_TO_REPLY]:
                            e === true ? 'true' : 'false',
                    });
                }}
                description={openThreadsData.description}
            />
        </>
    );

    const PreviewsContainer = (
        <>
            <CheckboxItemCreator
                inputFieldData={imagePreviewsData}
                inputFieldValue={settings.collapse_previews === 'true'}
                handleChange={(e) => {
                    handleChange({
                        [Preferences.COLLAPSE_DISPLAY]:
                            e === true ? 'true' : 'false',
                    });
                }}
            />
            <CheckboxItemCreator
                inputFieldData={websitePreviewsData}
                inputFieldValue={settings.link_previews === 'true'}
                handleChange={(e) => {
                    handleChange({
                        [Preferences.LINK_PREVIEW_DISPLAY]:
                            e === true ? 'true' : 'false',
                    });
                }}
            />
        </>
    );

    const quickReactionContainer = (
        <>
            <CheckboxItemCreator
                inputFieldData={quickReactionCheckboxData}
                inputFieldValue={
                    settings.one_click_reactions_enabled === 'true'
                }
                handleChange={(e) => {
                    handleChange({
                        [Preferences.ONE_CLICK_REACTIONS_ENABLED]:
                            e === true ? 'true' : 'false',
                    });
                }}
            />

            <RadioItemCreator
                title={quickReactionRadioTitle}

                //need to take a look
                inputFieldValue={
                    props.lockTeammateNameDisplay ?
                        props.configTeammateNameDisplay :
                        settings.name_format
                }
                inputFieldData={quickReactionRadioData}
                handleChange={(e) => {
                    handleChange({
                        [Preferences.NAME_NAME_FORMAT]: e.toString(),
                    });
                }}
            />
        </>
    );

    const handleChange = useCallback(
        (values: Record<string, string>) => {
            setSettings({...settings, ...values});
            setHaveChanges(true);
        },
        [settings],
    );

    const handleSubmit = async (): Promise<void> => {
        const preferences: PreferenceType[] = [];
        const {actions, currentUser} = props;
        const userId = currentUser.id;

        Object.keys(settings).forEach((setting) => {
            const category = Preferences.CATEGORY_DISPLAY_SETTINGS;
            preferences.push({
                user_id: userId,
                category,
                name: setting,
                value: settings[setting],
            });
        });

        await actions.savePreferences(userId, preferences);
        setHaveChanges(false);
    };

    const handleCancel = () => {
        setSettings({
            collapsed_reply_threads: props.collapsedReplyThreads,
            name_format: props.lockTeammateNameDisplay ?
                props.configTeammateNameDisplay :
                props.teammateNameDisplay,
            availability_status_on_posts: props.availabilityStatusOnPosts,
            collapse_previews: props.collapseDisplay,
            link_previews: props.linkPreviewDisplay,
            one_click_reactions_enabled: props.oneClickReactionsOnPosts,
            click_to_reply: props.collapseDisplay,
            message_display: props.messageDisplay,
            channel_display_mode: props.channelDisplayMode,
        });
        setHaveChanges(false);
    };

    return (
        <>
            <SectionCreator
                title={messageDisplayTtle}
                description={messageDisplayDescription}
                content={
                    <div style={{height: '100px'}}>
                        Hi, Content goes here :
                    </div>
                }
            />
            <SectionCreator
                title={messageDensityTitle}
                content={messageDensityContainer}
            />
            <SectionCreator
                title={messageWidthTitle}
                content={messageWidthContainer}
            />
            <SectionCreator
                title={teamMateNameDisplayTitle}
                content={teamMateNameContainer}
            />
            <SectionCreator
                title={profileStatusTitle}
                content={profileStatusContainer}
            />
            <div className='user-settings-modal__divider'/>
            <SectionCreator
                title={threadsTitle}
                content={ThreadsContainer}
            />
            <div className='user-settings-modal__divider'/>
            <SectionCreator
                title={previewsTitle}
                content={PreviewsContainer}
            />
            <div className='user-settings-modal__divider'/>
            <SectionCreator
                title={quickReactionTitle}
                description={quickReactionDescription}
                content={quickReactionContainer}
            />
            <SectionCreator
                title={reactionsDemoTitle}
                content={
                    <div style={{height: '100px'}}>
                        Hi, Content goes here :
                    </div>
                }
            />
            {haveChanges && (
                <SaveChangesPanel
                    handleSubmit={handleSubmit}
                    handleCancel={handleCancel}
                />
            )}
        </>
    );
}
