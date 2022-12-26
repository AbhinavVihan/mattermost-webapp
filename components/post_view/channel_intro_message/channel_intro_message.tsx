// Copyright (c) 2015-present Mattermost, Inc. All Rights Reserved.
// See LICENSE.txt for license information.

import {FormattedDate, FormattedMessage} from 'react-intl';

import React from 'react';

import {BellOutlineIcon, GlobeIcon, PencilOutlineIcon, StarOutlineIcon, AccountPlusOutlineIcon, LockOutlineIcon, StarIcon} from '@mattermost/compass-icons/components';

import {Permissions} from 'mattermost-redux/constants';

import {UserProfile as UserProfileRedux} from '@mattermost/types/users';

import {Channel} from '@mattermost/types/channels';

import {Constants, ModalIdentifiers} from 'utils/constants';
import EditChannelHeaderModal from 'components/edit_channel_header_modal';
import ChannelNotificationsModal from 'components/channel_notifications_modal';
import LocalizedIcon from 'components/localized_icon';
import ProfilePicture from 'components/profile_picture';
import ToggleModalButton from 'components/toggle_modal_button';
import UserProfile from 'components/user_profile';
import ChannelPermissionGate from 'components/permissions_gates/channel_permission_gate';
import TeamPermissionGate from 'components/permissions_gates/team_permission_gate';
import AddGroupsToTeamModal from 'components/add_groups_to_team_modal';

import {getMonthLong, t} from 'utils/i18n';
import * as Utils from 'utils/utils';
import {PluginComponent} from 'types/store/plugins';

import PublicChannelIntroSvg from 'components/common/svg_images_components/public_channel_intro_svg';
import PrivateChannelIntroSvg from 'components/common/svg_images_components/private_channel_intro_svg';
import TownSquareIntroSvg from 'components/common/svg_images_components/town_square_intro_svg';

import ChannelInviteModal from 'components/channel_invite_modal';
import {Theme} from 'mattermost-redux/selectors/entities/preferences';
import {ActionFunc} from 'mattermost-redux/types/actions';

import MoreDirectChannels from 'components/more_direct_channels';

import AddMembersButton from './add_members_button';

type Props = {
    currentUserId: string;
    channel: Channel;
    fullWidth: boolean;
    locale: string;
    channelProfiles: UserProfileRedux[];
    enableUserCreation?: boolean;
    isReadOnly?: boolean;
    isFavorite: boolean;
    teamIsGroupConstrained?: boolean;
    creatorName: string;
    teammate?: UserProfileRedux;
    teammateName?: string;
    currentUser: UserProfileRedux;
    stats: any;
    usersLimit: number;
    isInvitingPeople: boolean;
    isNotificationsOpen: boolean;
    isSetHeaderOpen: boolean;
    isMobileView: boolean;
    actions: {
        getTotalUsersStats: () => ActionFunc;
        favoriteChannel: (channelId: string) => ActionFunc;
        unfavoriteChannel: (channelId: string) => ActionFunc;
    };
    boardComponent?: PluginComponent;
    theme?: Theme;
}

export default class ChannelIntroMessage extends React.PureComponent<Props> {
    componentDidMount() {
        if (!this.props.stats?.total_users_count) {
            this.props.actions.getTotalUsersStats();
        }
    }

    toggleFavorite = () => {
        if (this.props.isFavorite) {
            this.props.actions.unfavoriteChannel(this.props.channel.id);
        } else {
            this.props.actions.favoriteChannel(this.props.channel.id);
        }
    };

    render() {
        const {
            currentUserId,
            channel,
            creatorName,
            fullWidth,
            locale,
            enableUserCreation,
            isReadOnly,
            channelProfiles,
            teamIsGroupConstrained,
            teammate,
            teammateName,
            currentUser,
            stats,
            usersLimit,
            isInvitingPeople,
            isNotificationsOpen,
            isSetHeaderOpen,
            isMobileView,
            boardComponent,
        } = this.props;

        let centeredIntro = '';
        if (!fullWidth) {
            centeredIntro = 'channel-intro--centered';
        }

        let classes: string;
        const createClasses = (withSvg: boolean) => {
            if (this.props.theme?.type === 'Onyx' && !withSvg) {
                classes = 'channelIntroButton';
                return classes;
            } else if (this.props.theme?.type === 'Onyx' && withSvg) {
                classes = 'channelIntroButton withSvg';
                return classes;
            } else if (!withSvg) {
                classes = 'channelIntroButton';
                return classes;
            }
            classes = 'channelIntroButton withSvg';
            return classes;
        };

        if (channel.type === Constants.DM_CHANNEL) {
            return createDMIntroMessage(channel, centeredIntro, this.props.isFavorite, isSetHeaderOpen, this.toggleFavorite, teammate, teammateName, boardComponent, createClasses);
        } else if (channel.type === Constants.GM_CHANNEL) {
            return createGMIntroMessage(channel, centeredIntro, channelProfiles, isInvitingPeople, isNotificationsOpen, isSetHeaderOpen, currentUserId, currentUser, this.props.isFavorite, this.toggleFavorite, isMobileView, boardComponent, createClasses);
        } else if (channel.name === Constants.DEFAULT_CHANNEL) {
            return createDefaultIntroMessage(channel, centeredIntro, stats, usersLimit, locale, creatorName, isNotificationsOpen, isSetHeaderOpen, currentUser, this.props.isFavorite, this.toggleFavorite, enableUserCreation, isReadOnly, teamIsGroupConstrained, boardComponent, createClasses);
        } else if (channel.type === Constants.OPEN_CHANNEL || channel.type === Constants.PRIVATE_CHANNEL) {
            return createStandardIntroMessage(channel, centeredIntro, stats, usersLimit, currentUser, locale, creatorName, isInvitingPeople, isNotificationsOpen, isSetHeaderOpen, boardComponent, createClasses);
        }
        return null;
    }
}

function createGMIntroMessage(channel: Channel, centeredIntro: string, profiles: UserProfileRedux[], isInvitingPeople: boolean, isNotificationsOpen: boolean, isSetHeaderOpen: boolean, currentUserId: string, currentUser: UserProfileRedux, isFavorite: boolean, toggleFavorite: () => void, isMobileView: boolean, boardComponent?: PluginComponent, createClasses?: (withSvg: boolean) => string) {
    const channelIntroId = 'channelIntro';

    if (profiles.length > 0) {
        const pictures = profiles.
            filter((profile) => profile.id !== currentUserId).
            map((profile) => (
                <ProfilePicture
                    key={'introprofilepicture' + profile.id}
                    src={Utils.imageURLForUser(profile.id, profile.last_picture_update)}
                    size='xl-custom-GM'
                    userId={profile.id}
                    username={profile.username}
                />
            ));
        return (
            <div
                id={channelIntroId}
                className={'channel-intro d-flex flex-column ' + centeredIntro}
            >
                <div className='post-profile-img__container channel-intro-img'>
                    {pictures}
                </div>
                <h2 className='channel-intro__title'>
                    {channel.display_name}
                </h2>
                <p className='channel-intro__content'>
                    <FormattedMessage
                        id='intro_messages.GM'
                        defaultMessage='This is the start of your group message history with {names}.\nMessages and files shared here are not shown to anyone else outside the group.'
                        values={{
                            names: channel.display_name,
                        }}
                    />
                </p>
                <div className='d-flex flex-row'>
                    {createBoardsButton(channel, boardComponent)}
                    {createAddPeopleButton(channel, isInvitingPeople, createClasses?.(false))}
                    {createSetHeaderButton(channel, isSetHeaderOpen, createClasses?.(false))}
                    {!isMobileView && createNotificationButton(channel, currentUser, isNotificationsOpen, createClasses?.(false))}
                    {isMobileView && createFavoriteButton(isFavorite, toggleFavorite, createClasses?.(false))}
                </div>
            </div>
        );
    }

    return (
        <div
            id={channelIntroId}
            className={'channel-intro ' + centeredIntro}
        >
            <p className='channel-intro__content'>
                <FormattedMessage
                    id='intro_messages.group_message'
                    defaultMessage='This is the start of your group message history with these teammates. Messages and files shared here are not shown to people outside this area.'
                />
            </p>
        </div>
    );
}

function createDMIntroMessage(channel: Channel, centeredIntro: string, isFavorite: boolean, isSetHeaderOpen: boolean, toggleFavorite: () => void, teammate?: UserProfileRedux, teammateName?: string, boardComponent?: PluginComponent, createClasses?: (withSvg: boolean) => string) {
    const channelIntroId = 'channelIntro';
    if (teammate) {
        const src = teammate ? Utils.imageURLForUser(teammate.id, teammate.last_picture_update) : '';
        let setHeaderButton = null;
        let boardCreateButton = null;
        if (!teammate?.is_bot) {
            boardCreateButton = createBoardsButton(channel, boardComponent);
        }
        setHeaderButton = createSetHeaderButton(channel, isSetHeaderOpen, createClasses?.(false));

        return (
            <div
                id={channelIntroId}
                className={'channel-intro d-flex flex-column ' + centeredIntro}
            >
                <div className='post-profile-img__container channel-intro-img'>
                    <ProfilePicture
                        src={src}
                        size='xl-custom-DM'
                        userId={teammate?.id}
                        username={teammate?.username}
                        hasMention={true}
                        status={teammate.is_bot ? '' : channel.status}
                        wrapperClass='status-wrapper-DM'
                        statusClass='DM'
                    />
                </div>
                <h2 className='channel-intro__title'>
                    <UserProfile
                        userId={teammate?.id}
                        disablePopover={false}
                        hasMention={true}
                    />
                </h2>
                <p className='channel-intro__content'>
                    <FormattedMessage
                        id='intro_messages.DM'
                        defaultMessage='This is the start of your conversation with {teammate}.\Direct messages and files shared here are not shown to anyone else.'
                        values={{
                            teammate: teammateName,
                        }}
                    />
                </p>
                <div className='d-flex flex-row'>
                    {boardCreateButton}
                    {setHeaderButton}
                    {createFavoriteButton(isFavorite, toggleFavorite, createClasses?.(false))}
                </div>
            </div>
        );
    }

    return (
        <div
            id={channelIntroId}
            className={'channel-intro ' + centeredIntro}
        >
            <p className='channel-intro__content'>
                <FormattedMessage
                    id='intro_messages.teammate'
                    defaultMessage='This is the start of your direct message history with this teammate. Direct messages and files shared here are not shown to people outside this area.'
                />
            </p>
        </div>
    );
}

export function createDefaultIntroMessage(
    channel: Channel,
    centeredIntro: string,
    stats: any,
    usersLimit: number,
    locale: string,
    creatorName: string,
    isNotificationsOpen: boolean,
    isSetHeaderOpen: boolean,
    currentUser: UserProfileRedux,
    isFavorite: boolean,
    toggleFavorite: () => void,
    enableUserCreation?: boolean,
    isReadOnly?: boolean,
    teamIsGroupConstrained?: boolean,
    boardComponent?: PluginComponent,
    createClasses?: (withSvg: boolean) => string,
) {
    let teamInviteLink = null;
    const totalUsers = stats.total_users_count;
    const isPrivate = channel.type === Constants.PRIVATE_CHANNEL;

    let setHeaderButton = null;
    let boardCreateButton = null;
    if (!isReadOnly) {
        boardCreateButton = createBoardsButton(channel, boardComponent);
        const children = createSetHeaderButton(channel, isSetHeaderOpen, createClasses?.(true));
        if (children) {
            setHeaderButton = (
                <ChannelPermissionGate
                    teamId={channel.team_id}
                    channelId={channel.id}
                    permissions={[isPrivate ? Permissions.MANAGE_PRIVATE_CHANNEL_PROPERTIES : Permissions.MANAGE_PUBLIC_CHANNEL_PROPERTIES]}
                >
                    {children}
                </ChannelPermissionGate>
            );
        }
    }

    const date = (
        <FormattedDate
            value={channel.create_at}
            month={getMonthLong(locale)}
            day='2-digit'
            year='numeric'
        />
    );

    const uiName = channel.display_name;

    let createMessage;
    if (creatorName === '') {
        createMessage = (
            <FormattedMessage
                id='intro_messages.noCreator'
                defaultMessage='Public channel {name} created on {date}.'
                values={{name: (uiName), date}}
            />
        );
    } else {
        createMessage = (
            <span>
                <FormattedMessage
                    id='intro_messages.creator'
                    defaultMessage='Public channel {name} created by {creator} {date}.'
                    values={{
                        name: (uiName),
                        creator: (creatorName),
                        date,
                    }}
                />
            </span>
        );
    }

    if (!isReadOnly && enableUserCreation) {
        teamInviteLink = (
            <TeamPermissionGate
                teamId={channel.team_id}
                permissions={[Permissions.INVITE_USER]}
            >
                <TeamPermissionGate
                    teamId={channel.team_id}
                    permissions={[Permissions.ADD_USER_TO_TEAM]}
                >
                    {!teamIsGroupConstrained &&
                        <AddMembersButton
                            setHeader={setHeaderButton}
                            totalUsers={totalUsers}
                            usersLimit={usersLimit}
                            channel={channel}
                            createBoard={boardCreateButton}
                        />
                    }
                    {teamIsGroupConstrained &&
                    <ToggleModalButton
                        className='intro-links padding-extra color--link'
                        modalId={ModalIdentifiers.ADD_GROUPS_TO_TEAM}
                        dialogType={AddGroupsToTeamModal}
                        dialogProps={{channel}}
                    >
                        <LocalizedIcon
                            className='fa fa-user-plus'
                            title={{id: t('generic_icons.add'), defaultMessage: 'Add Icon'}}
                        />
                        <FormattedMessage
                            id='intro_messages.addGroupsToTeam'
                            defaultMessage='Add other groups to this team'
                        />
                    </ToggleModalButton>
                    }
                </TeamPermissionGate>
            </TeamPermissionGate>
        );
    }

    const headerAndNotification = (
        <span className='d-flex flex-row'>
            {!isReadOnly && setHeaderButton}
            {createNotificationButton(channel, currentUser, isNotificationsOpen, createClasses?.(true))}
            {createFavoriteButton(isFavorite, toggleFavorite, createClasses?.(true))}
        </span>
    );

    const actionsLayout = totalUsers < usersLimit ? teamInviteLink : headerAndNotification;
    return (
        <div
            id='channelIntro'
            className={'channel-intro ' + centeredIntro}
        >
            <TownSquareIntroSvg/>
            <h2 className='channel-intro__title'>
                <FormattedMessage
                    id='intro_messages.beginning'
                    defaultMessage='{name}'
                    values={{
                        name: channel.display_name,
                    }}
                />
            </h2>
            <p className='channel-intro__desc'>
                <GlobeIcon
                    size={14}
                    css={{marginRight: 5}}
                />
                {createMessage}
            </p>
            <p className='channel-intro__content'>
                {!isReadOnly &&
                    <FormattedMessage
                        id='intro_messages.default'
                        defaultMessage='Welcome to {display_name}. Post messages here that you want everyone to see. Everyone \n automatically becomes a member of this channel when they join the team.'
                        values={{
                            display_name: channel.display_name,
                        }}
                    />
                }
                {isReadOnly &&
                    <FormattedMessage
                        id='intro_messages.readonly.default'
                        defaultMessage='Welcome to {display_name}. Everyone automatically becomes a member of this channel when they join the team.'
                        values={{
                            display_name: channel.display_name,
                        }}
                    />
                }
            </p>
            <div className='channel-intro__actions'>
                {actionsLayout}
            </div>
            {teamIsGroupConstrained && boardCreateButton}
            <br/>
        </div>
    );
}

function createStandardIntroMessage(channel: Channel, centeredIntro: string, stats: any, usersLimit: number, currentUser: UserProfileRedux, locale: string, creatorName: string, isInvitingPeople: boolean, isNotificationsOpen: boolean, isSetHeaderOpen: boolean, boardComponent?: PluginComponent, createClasses?: (withSvg: boolean) => string) {
    const uiName = channel.display_name;
    let memberMessage;
    const channelIsArchived = channel.delete_at !== 0;
    const totalUsers = stats.total_users_count;

    if (channelIsArchived) {
        memberMessage = '';
    } else if (channel.type === Constants.PRIVATE_CHANNEL) {
        memberMessage = (
            <FormattedMessage
                id='intro_messages.onlyInvited'
                defaultMessage='Welcome to the {name} channel. Only invited members can see messages posted in this private channel.'
                values={{name: uiName}}
            />
        );
    } else if (channel.type === Constants.OPEN_CHANNEL && totalUsers < usersLimit) {
        memberMessage = (
            <FormattedMessage
                id='intro_messages.anyMember.lessthanten'
                defaultMessage='Welcome to the {name} channel. It looks like there are only a few team members in this workspace. Consider inviting others to collaborate with.'
                values={{name: uiName}}
            />
        );
    } else {
        memberMessage = (
            <FormattedMessage
                id='intro_messages.anyMember'
                defaultMessage='Welcome to the {name} channel. Add some more team members to the channel or start a conversation below.'
                values={{name: uiName}}
            />
        );
    }

    const date = (
        <FormattedDate
            value={channel.create_at}
            month={getMonthLong(locale)}
            day='2-digit'
            year='numeric'
        />
    );

    let createMessage;
    if (creatorName === '') {
        if (channel.type === Constants.PRIVATE_CHANNEL) {
            createMessage = (
                <FormattedMessage
                    id='intro_messages.noCreatorPrivate'
                    defaultMessage='Private channel created on {date}.'
                    values={{date}}
                />
            );
        } else if (channel.type === Constants.OPEN_CHANNEL) {
            createMessage = (
                <FormattedMessage
                    id='intro_messages.noCreator'
                    defaultMessage='Public channel created on {date}.'
                    values={{date}}
                />
            );
        }
    } else if (channel.type === Constants.PRIVATE_CHANNEL) {
        createMessage = (
            <span>
                <FormattedMessage
                    id='intro_messages.creatorPrivate'
                    defaultMessage='Private channel created by {creator} {date}.'
                    values={{
                        creator: (creatorName),
                        date,
                    }}
                />
            </span>
        );
    } else if (channel.type === Constants.OPEN_CHANNEL) {
        createMessage = (
            <span>
                <FormattedMessage
                    id='intro_messages.creator'
                    defaultMessage='Public channel created by {creator} {date}.'
                    values={{
                        creator: (creatorName),
                        date,
                    }}
                />
            </span>
        );
    }

    const isPrivate = channel.type === Constants.PRIVATE_CHANNEL;
    let setHeaderButton = null;
    const children = createSetHeaderButton(channel, isSetHeaderOpen, createClasses?.(true));
    if (children) {
        setHeaderButton = (
            <ChannelPermissionGate
                teamId={channel.team_id}
                channelId={channel.id}
                permissions={[isPrivate ? Permissions.MANAGE_PRIVATE_CHANNEL_PROPERTIES : Permissions.MANAGE_PUBLIC_CHANNEL_PROPERTIES]}
            >
                {children}
            </ChannelPermissionGate>
        );
    }

    const boardCreateButton = createBoardsButton(channel, boardComponent);

    const channelInviteButton = (
        <AddMembersButton
            totalUsers={totalUsers}
            usersLimit={usersLimit}
            channel={channel}
            createBoard={boardCreateButton}
        />
    );

    const headerAndNotification = (
        <span className='d-flex flex-row'>
            {createAddPeopleButton(channel, isInvitingPeople, createClasses?.(true))}
            {setHeaderButton}
            {createNotificationButton(channel, currentUser, isNotificationsOpen, createClasses?.(true))}
        </span>
    );

    const actionsLayoutPublic = totalUsers < usersLimit ? channelInviteButton : headerAndNotification;
    let describingIcon;
    if (isPrivate) {
        describingIcon =
        (
            <GlobeIcon
                size={14}
                css={{marginRight: 5}}
            />
        );
    } else {
        describingIcon =
        (
            <LockOutlineIcon
                size={14}
                css={{marginRight: 5}}
            />
        );
    }
    return (
        <div
            id='channelIntro'
            className={'channel-intro  d-flex flex-column ' + centeredIntro}
        >
            {isPrivate ? <PrivateChannelIntroSvg/> : <PublicChannelIntroSvg/>
            }
            <h2 className='channel-intro__title'>
                {uiName}
            </h2>
            <p className='channel-intro__desc'>
                {describingIcon}
                {createMessage}
            </p>
            <p className='channel-intro__content'>
                {memberMessage}
            </p>
            <div className='channel-intro__actions'>
                {isPrivate ? headerAndNotification : actionsLayoutPublic}
            </div>
        </div>
    );
}

function createSetHeaderButton(channel: Channel, isSetHeaderOpen: boolean, classes?: string) {
    const channelIsArchived = channel.delete_at !== 0;
    if (channelIsArchived) {
        return null;
    }

    const headerId = channel.header ? 'intro_messages.editHeader' : 'intro_messages.setHeader';
    const defaultMessage = channel.header ? 'Edit header' : 'Set header';
    const ariaLabel = channel.header ? Utils.localizeMessage('intro_messages.editHeader', defaultMessage) : Utils.localizeMessage('intro_messages.setHeader', defaultMessage);

    return (
        <ToggleModalButton
            modalId={ModalIdentifiers.EDIT_CHANNEL_HEADER}
            ariaLabel={ariaLabel}
            className={`intro-links ${isSetHeaderOpen ? 'active' : ''} ${classes}`}
            dialogType={EditChannelHeaderModal}
            dialogProps={{channel}}
            noTransparent={true}
        >
            <PencilOutlineIcon size={24}/>
            <FormattedMessage
                id={headerId}
                defaultMessage={defaultMessage}
            />
        </ToggleModalButton>
    );
}

function createBoardsButton(channel: Channel, boardComponent?: PluginComponent) {
    const channelIsArchived = channel.delete_at !== 0;
    if (channelIsArchived || boardComponent === undefined) {
        return null;
    }

    return (
        <button
            className={'intro-links color--link channelIntroButton style--none'}
            onClick={() => {
                if (boardComponent.action) {
                    boardComponent.action();
                }
            }}
            aria-label={Utils.localizeMessage('intro_messages.createBoard', 'Create a board')}
        >
            {boardComponent.icon}
            <FormattedMessage
                id='intro_messages.createBoard'
                defaultMessage='Create a board'
            />
        </button>
    );
}

function createFavoriteButton(isFavorite: boolean, toggleFavorite: () => void, classes?: string) {
    let favoriteText;
    if (isFavorite) {
        favoriteText = (
            <FormattedMessage
                id='channel_info_rhs.top_buttons.favorited'
                defaultMessage='Favorited'
            />);
    } else {
        favoriteText = (
            <FormattedMessage
                id='channel_info_rhs.top_buttons.favorite'
                defaultMessage='Favorite'
            />);
    }
    return (
        <button
            id='toggleFavoriteIntroButton'
            className={`intro-links ${isFavorite ? 'active' : ''}  ${classes}`}
            onClick={toggleFavorite}
            aria-label={'Favorite'}
        >
            {isFavorite ? <StarIcon size={24}/> : <StarOutlineIcon size={24}/>}
            {favoriteText}
        </button>
    );
}

function createNotificationButton(channel: Channel, user: UserProfileRedux, isNotificationsOpen: boolean, classes?: string) {
    return (
        <ToggleModalButton
            modalId={ModalIdentifiers.NOTIFICATIONS}
            ariaLabel={Utils.localizeMessage('intro_messages.notifications', 'Notifications')}
            className={`intro-links ${isNotificationsOpen ? 'active' : ''} ${classes}`}
            dialogType={ChannelNotificationsModal}
            dialogProps={{channel, currentUser: user}}
            noTransparent={true}
        >
            <BellOutlineIcon size={24}/>
            <FormattedMessage
                id='intro_messages.notifications'
                defaultMessage='Notifications'
            />
        </ToggleModalButton>
    );
}

function createAddPeopleButton(channel: Channel, isInvitingPeople: boolean, classes?: string) {
    const channelIsArchived = channel.delete_at !== 0;
    if (channelIsArchived) {
        return null;
    }

    const modalId = channel.type === Constants.GM_CHANNEL ? ModalIdentifiers.CREATE_DM_CHANNEL : ModalIdentifiers.CHANNEL_INVITE;
    const modal = channel.type === Constants.GM_CHANNEL ? MoreDirectChannels : ChannelInviteModal;

    const headerId = 'channel_info_rhs.top_buttons.add_people';
    const defaultMessage = 'Add people';
    const ariaLabel = Utils.localizeMessage('channel_info_rhs.top_buttons.add_people', defaultMessage);

    return (
        <ToggleModalButton
            modalId={modalId}
            ariaLabel={ariaLabel}
            className={`intro-links ${isInvitingPeople ? 'active' : ''} ${classes}`}
            dialogType={modal}
            dialogProps={channel.type === Constants.GM_CHANNEL ? {isExistingChannel: true} : {channel}}
            noTransparent={true}
        >
            <AccountPlusOutlineIcon size={24}/>
            <FormattedMessage
                id={headerId}
                defaultMessage={defaultMessage}
            />
        </ToggleModalButton>
    );
}
