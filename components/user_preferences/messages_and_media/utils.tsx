import { FieldsetRadio } from "components/widgets/modals/generic/radio-item-creator";
import Constants from "utils/constants";
import { t } from "utils/i18n";

const Preferences = Constants.Preferences;

// interface messageAndMediaSettingsType {
//     [Preferences.COLLAPSED_REPLY_THREADS]: string,

// }

// type MessageAndMediaSettingsType = {
//     [key: string]: string | undefined;
//     [Preferences.COLLAPSED_REPLY_THREADS]: string;
//     [Preferences.NAME_NAME_FORMAT]: string;
//     [Preferences.AVAILABILITY_STATUS_ON_POSTS]: string;
//     [Preferences.COLLAPSE_DISPLAY]: string;
//     [Preferences.LINK_PREVIEW_DISPLAY]: string;
//     [Preferences.ONE_CLICK_REACTIONS_ENABLED]: string;
// }

export const messageDisplayTtle = {
    id: t("user.settings.messagesAndMedia.messageDisplay.title"),
    defaultMessage: "Message display",
};

export const messageDisplayDescription = {
    id: t("user.settings.messagesAndMedia.messageDisplay.description"),
    defaultMessage: "Here’s how your messages will look",
};

export const messageDensityTitle = {
    id: t("user.settings.messagesAndMedia.messageDensity.title"),
    defaultMessage: "Message Density",
};

export const MessageDensityData: FieldsetRadio = {
    options: [
        {
            dataTestId: `messageDensity-test-id-clean`,
            title: {
                id: "user.settings.messagesAndMedia.messageDensity.clean",
                defaultMessage: "Clean: Easy to scan and read",
            },
            name: `messageDensity-clean`,
            key: `messageDensity-key-clean`,
            value: Preferences.MESSAGE_DISPLAY_CLEAN,
        },
        {
            dataTestId: `messageDensity-test-id-compact`,
            title: {
                id: "user.settings.messagesAndMedia.messageDensity.compact",
                defaultMessage:
                    "Compact: Fit as many messages on-screen as possible",
            },
            name: `messageDensity-compact`,
            key: `messageDensity-key-compact`,
            value: Preferences.MESSAGE_DISPLAY_COMPACT,
        },
    ],
};

export const messageWidthTitle = {
    id: t("user.settings.messagesAndMedia.messageWidth.title"),
    defaultMessage: "Message width",
};

export const MessageWidthData: FieldsetRadio = {
    options: [
        {
            dataTestId: `messageWidth-test-id-full-width`,
            title: {
                id: "user.settings.messagesAndMedia.messageWidth.full-width",
                defaultMessage: "Full-width",
            },
            name: `messageWidth-full-width`,
            key: `messageWidth-key-full-width`,
            value: Preferences.CHANNEL_DISPLAY_MODE_FULL_SCREEN,
        },
        {
            dataTestId: `messageWidth-test-id-centered`,
            title: {
                id: "user.settings.messagesAndMedia.messageWidth.centered",
                defaultMessage: "Fixed-width, centered",
            },
            name: `messageWidth-centered`,
            key: `messageWidth-key-centered`,
            value: Preferences.CHANNEL_DISPLAY_MODE_CENTERED,
        },
    ],
};

export const teamMateNameDisplayTitle = {
    id: t("user.settings.messagesAndMedia.teammatename.title"),
    defaultMessage: "Teammate name display",
};

export const teammateNameData: FieldsetRadio = {
    options: [
        {
            dataTestId: `teammateName-test-id-username`,
            title: {
                id: "user.settings.messagesAndMedia.teammateName.username",
                defaultMessage: "Show username",
            },
            name: `teammateName-username`,
            key: `teammateName-key-username`,
            value: Constants.TEAMMATE_NAME_DISPLAY.SHOW_USERNAME,
        },
        {
            dataTestId: `teammateName-test-id-firstAndLast`,
            title: {
                id: "user.settings.messagesAndMedia.teammateName.firstAndLast",
                defaultMessage: "Show first and last name",
            },
            name: `teammateName-firstAndLast`,
            key: `teammateName-key-firstAndLast`,
            value: Constants.TEAMMATE_NAME_DISPLAY.SHOW_FULLNAME,
        },
        {
            dataTestId: `teammateName-test-id-nickname`,
            title: {
                id: "user.settings.messagesAndMedia.teammateName.nickname",
                defaultMessage:
                    "Show nickname, otherwise show first and last name",
            },
            name: `teammateName-nickname`,
            key: `teammateName-key-nickname`,
            value: Constants.TEAMMATE_NAME_DISPLAY.SHOW_NICKNAME_FULLNAME,
        },
    ],
};

export const profileStatusTitle = {
    id: t("user.settings.messagesAndMedia.profileStatus.title"),
    defaultMessage: "Online status on profile images",
};

export const profileStatusData = {
    dataTestId: "profileStatus-test-id",
    title: {
        id: "user.settings.messagesAndMedia.profileStatus",
        defaultMessage: "Show online status on profile images",
    },
    name: "profileStatus-name",
    key: "profileStatus-key",
};

export const threadsTitle = {
    id: t("user.settings.messagesAndMedia.threads.title"),
    defaultMessage: "Threads",
};
export const enableCRTData = {
    dataTestId: "enableCRT-test-id",
    title: {
        id: "user.settings.messagesAndMedia.enableCRT.title",
        defaultMessage: "Enabled collapsed replies (Beta)",
    },
    description: {
        id: "user.settings.messagesAndMedia.enableCRT.description",
        defaultMessage:
            "        When enabled, replies aren't shown in the channel. You'll be notified about threads you're following in the Threads view. Please review our documentation for known issues and help provide feedback in our community channel.",
    },
    name: "enableCRT-name",
    key: "enableCRT-key",
};

export const openThreadsData = {
    dataTestId: "openThreads-test-id",
    title: {
        id: "user.settings.messagesAndMedia.openThreads",
        defaultMessage: "Click to open threads",
    },
    description: {
        id: "user.settings.messagesAndMedia.openThreads.description",
        defaultMessage:
            "    When enabled, select any part of a message to open the reply thread.",
    },
    name: "openThreads-name",
    key: "openThreads-key",
};

export const previewsTitle = {
    id: t("user.settings.messagesAndMedia.previewsTitle.title"),
    defaultMessage: "Image and link previews",
};

export const imagePreviewsData = {
    dataTestId: "imagePreview-test-id",
    title: {
        id: "user.settings.messagesAndMedia.imagePreview.title",
        defaultMessage: "Show expanded image previews",
    },
    name: "imagePreview-name",
    key: "imagePreview-key",
};

export const websitePreviewsData = {
    dataTestId: "websitePreview-test-id",
    title: {
        id: "user.settings.messagesAndMedia.websitePreview.title",
        defaultMessage: "Show website link previews",
    },
    name: "websitePreview-name",
    key: "websitePreview-key",
};

export const quickReactionTitle = {
    id: t("user.settings.messagesAndMedia.quickReaction.title"),
    defaultMessage: "Quick reactions",
};

export const quickReactionDescription = {
    id: "user.settings.messagesAndMedia.quickReaction.description",
    defaultMessage:
        "React quickly with recent or frequent reactions when hovering over a message.",
};

export const quickReactionCheckboxData = {
    dataTestId: "quickReactionCheckbox-test-id",
    title: {
        id: "user.settings.messagesAndMedia.quickReactionCheckbox.title",
        defaultMessage: "Enable quick reactions on messages",
    },
    name: "quickReactionCheckbox-name",
    key: "quickReactionCheckbox-key",
};

export const quickReactionRadioTitle = {
    id: "user.settings.messagesAndMedia.quickReactionRadio.title",
    defaultMessage: "Which reactions would you prefer to show?",
};

export const quickReactionRadioData: FieldsetRadio = {
    options: [
        {
            dataTestId: `quickReactionRadio-test-id-frequent`,
            title: {
                id: "user.settings.messagesAndMedia.quickReactionRadio.frequent.title",
                defaultMessage: "Show my most frequently used reactions",
            },
            name: `quickReactionRadio-frequent`,
            key: `quickReactionRadio-key-frequent`,
            value: Constants.TEAMMATE_NAME_DISPLAY.SHOW_USERNAME,
        },
        {
            dataTestId: `quickReaction-test-id-preffered`,
            title: {
                id: "user.settings.messagesAndMedia.quickReaction.preffered",
                defaultMessage: "Show my preferred reactions",
            },
            name: `quickReaction-preffered`,
            key: `quickReaction-key-preffered`,
            value: Constants.TEAMMATE_NAME_DISPLAY.SHOW_FULLNAME,
        },
    ],
};

export const reactionsDemoTitle = {
    id: t("user.settings.messagesAndMedia.reactionsDemo.title"),
    defaultMessage: "Here’s how your reactions will look",
};
