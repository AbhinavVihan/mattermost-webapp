import { FieldsetRadio } from "components/widgets/modals/generic/radio-item-creator";
import { NotificationLevels, Preferences } from "utils/constants";
import * as Utils from "utils/utils";
import Constants from "utils/constants";

export const desktopOrMobileConstants = {
    DesktopActivity: "desktopActivity",
    DesktopSound: "desktopSound",
    DesktopNotificationSound: "desktopNotificationSound",
    DesktopThreads: "desktopThreads",
    MobileActivity: "pushActivity",
    MobileStatus: "pushStatus",
    MobileThreads: "pushThreads",
};

export const DesktopNotificationsTitle = {
    id: "user.preferences.notifications.DesktopNotifications.title",
    defaultMessage: "Desktop & web notifications",
};

export const DesktopNotificationsDesc = {
    id: "user.preferences.notifications.DesktopNotifications.desc",
    defaultMessage:
        "Available on Chrome, Edge, Firefox, and the Mattermost Desktop App.",
};

export const notifyAboutTitle = {
    id: "user.preferences.notifications.desktop.title",
    defaultMessage: "Notify me about…",
};

export const notifyAboutData = (key: "desktop" | "mobile") => {
    return {
        options: [
            {
                dataTestId: `${key}-${NotificationLevels.ALL}`,
                title: {
                    id: "user.preferences.notifications.notifyAbout.all",
                    defaultMessage: "All new messages",
                },
                name: `${key}-${NotificationLevels.ALL}`,
                key: `${key}-${NotificationLevels.ALL}`,
                value: NotificationLevels.ALL,
            },
            {
                dataTestId: `${key}-${NotificationLevels.MENTION}`,
                title: {
                    id: "user.preferences.notifications.notifyAbout.mentions",
                    defaultMessage:
                        "Mentions, direct messages, and keywords only",
                },
                name: `${key}-${NotificationLevels.MENTION}`,
                key: `${key}-${NotificationLevels.MENTION}`,
                value: NotificationLevels.MENTION,
            },
            {
                dataTestId: `${key}-${NotificationLevels.NONE}`,
                title: {
                    id: "user.preferences.notifications.notifyAbout.nothing",
                    defaultMessage: "Nothing",
                },
                name: `${key}-${NotificationLevels.NONE}`,
                key: `${key}-${NotificationLevels.NONE}`,
                value: NotificationLevels.NONE,
            },
        ],
    };
};

export const threadNotificationsTitle = {
    id: "user.preferences.notifications.desktop.title",
    defaultMessage: "Thread reply notifications",
};

export const threadNotificationsData = (dataKey: "mobile" | "desktop") => {
    return {
        dataTestId: `${dataKey}-test-id`,
        title: {
            id: "user.settings.notifications.threadNotifications.checkbox.title",
            defaultMessage: "Notify me about replies to threads I’m following",
        },
        name: `${dataKey}-name`,
        key: `${dataKey}-key`,
        value: NotificationLevels.ALL,
    };
};

export const soundsTitle = {
    id: "user.preferences.notifications.sounds.title",
    defaultMessage: "Sounds",
};

export const soundsData = {
    dataTestId: "sounds-test-id",
    title: {
        id: "user.settings.notifications.sounds.checkbox.title",
        defaultMessage: "Enable notification sounds",
    },
    name: "sounds-name",
    key: "sounds-key",
};

const sounds = Array.from(Utils.notificationSounds.keys());
export const soundOptions = sounds.map((sound) => {
    return { value: sound, label: sound };
});


export const emailNotificationSettingTitle = {
    id: 'user.settings.notifications.emailNotifications.title',
    defaultMessage: 'Email Notifications',
};
export const emailNotificationSettingDesc = {
    id: 'user.settings.notifications.emailNotifications.desc',
    defaultMessage: 'Email notifications are sent for mentions and direct messages when you are offline or away for more than 5 minutes.',
};

export const mobileNotificationsTitle = {
    id: "user.preferences.notifications.mobileNotifications.title",
    defaultMessage: "Mobile notifications",
};

export const mobileNotificationsDescription = {
    id: "user.preferences.notifications.mobileNotifications.description",
    defaultMessage:
        "Notification alerts are pushed to your mobile device when there is activity in Mattermost.",
};

export const useSameAsDesktopDataCheckbox = {
    dataTestId: "threadNotifications-test-id",
    title: {
        id: "user.settings.notifications.mobileNotifications.checkbox.title",
        defaultMessage: "Use the same notification settings as desktop",
    },
    name: "mobileNotifications-name",
    key: "mobileNotifications-key",
};

export const triggerMobileNotificationsTitle = {
    id: "user.preferences.notifications.triggerMobileNotifications.title",
    defaultMessage: "Only trigger mobile notifications when I am…",
};

export const triggers = new Map([
    [Constants.UserStatuses.ONLINE, "Online, away or offline"],
    [Constants.UserStatuses.AWAY, "Away or offline"],
    [Constants.UserStatuses.OFFLINE, "Offline"],
]);
export const triggerNotificationsOptions: any[] = Array.from(
    triggers.keys()
).map((option) => {
    return { value: option, label: triggers.get(option) };
});

export const setHaveChangesTrue = (props: any) => {
    props.setParentState("haveChanges", true);
};

export const emailNotificationsData = {
    dataTestId: "emailNotifications-test-id",
    title: {
        id: "user.settings.notifications.emailNotifications.checkbox.title",
        defaultMessage: "Enable email notifications",
    },
    name: "emailNotifications-name",
    key: "emailNotifications-key",
};

export const emailNotificationsRadioData: FieldsetRadio = {
    options: [
        {
            dataTestId: `emailNotifications-${Preferences.INTERVAL_IMMEDIATE}`,
            title: {
                id: "user.preferences.notifications.emailNotifications.Immediately",
                defaultMessage: "Immediately",
            },
            name: `emailNotifications-${Preferences.INTERVAL_IMMEDIATE}`,
            key: `emailNotifications-${Preferences.INTERVAL_IMMEDIATE}`,
            value: Preferences.INTERVAL_IMMEDIATE,
        },
        {
            dataTestId: `emailNotifications-${Preferences.INTERVAL_FIFTEEN_MINUTES}`,
            title: {
                id: "user.preferences.notifications.emailNotifications.15minutes",
                defaultMessage: "Once every 15 minutes",
            },
            name: `emailNotifications-${Preferences.INTERVAL_FIFTEEN_MINUTES}`,
            key: `emailNotifications-${Preferences.INTERVAL_FIFTEEN_MINUTES}`,
            value: Preferences.INTERVAL_FIFTEEN_MINUTES,
        },
        {
            dataTestId: `emailNotifications-${Preferences.INTERVAL_HOUR}`,
            title: {
                id: "user.preferences.notifications.emailNotifications.hour",
                defaultMessage: "Once every hour",
            },
            name: `emailNotifications-${Preferences.INTERVAL_HOUR}`,
            key: `emailNotifications-${Preferences.INTERVAL_HOUR}`,
            value: Preferences.INTERVAL_HOUR,
        },
    ],
};

export const mentionKeyWordsTitle = {
    id: "user.preferences.notifications.mentionKeyWords.title",
    defaultMessage: "Keywords that trigger mentions",
};

export const mentionKeyWordsDesc = {
    id: "user.preferences.notifications.mentionKeyWords.desc",
    defaultMessage:
        "Mentions trigger notifications when someone sends a message that includes your username (@matthew.birtch), or any of the options selected below.",
};

export const caseSensitiveFirstNameData = (firstName: string) => {
    return {
        dataTestId: "caseSensitiveFirstName-test-id",
        title: {
            id: "user.settings.notifications.caseSensitiveFirstName.checkbox.title",
            defaultMessage: `Your case sensitive first name ${firstName}`,
        },
        name: "caseSensitiveFirstName-name",
        key: "caseSensitiveFirstName-key",
    };
};

export const channelWideMentionsData = {
    dataTestId: "channelWideMentions-test-id",
    title: {
        id: "user.settings.notifications.channelWideMentions.checkbox.title",
        defaultMessage: `Channel-wide mentions "@channel", "@all", "@here"`,
    },
    name: "channelWideMentions-name",
    key: "channelWideMentions-key",
};

export const autoRepliesTitle = {
    id: "user.preferences.notifications.autoReplies.title",
    defaultMessage: "Automatic replies for direct messages",
};

export const autoRepliesTDesc = {
    id: "user.preferences.notifications.autoReplies.desc",
    defaultMessage:
        "Set a custom message that will be automatically sent in response to Direct Messages. Enabling this setting will set your status to Out of Office and will disable notifications.",
};
export const enableAutoReplyData = {
    dataTestId: "enableAutoReply-test-id",
    title: {
        id: "user.settings.notifications.enableAutoReply.checkbox.title",
        defaultMessage: `Enable automatic replies`,
    },
    name: "enableAutoReply-name",
    key: "enableAutoReply-key",
};
