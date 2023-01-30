// Copyright (c) 2015-present Mattermost, Inc. All Rights Reserved.
// See LICENSE.txt for license information.

import { t } from "utils/i18n";
import React, { MouseEvent, RefObject } from "react";

import {
    Theme,
    ThemeKey,
} from "mattermost-redux/selectors/entities/preferences";
import { Preferences } from "mattermost-redux/constants";

import { FieldsetCheckbox } from "components/widgets/modals/generic/checkbox-item-creator";
import { defineMessages, FormattedMessage } from "react-intl";
import Popover from "components/widgets/popover";
import OverlayTrigger from "components/overlay_trigger";
import ColorChooser from "components/user_preferences/display/user_settings_theme/color_chooser/color_chooser";
import Constants from "utils/constants";

import { Props } from "./user_settings_themes";
export const PreMadeLightTheme: Partial<Record<ThemeKey, Theme>> = {
    denim: Preferences.THEMES.denim,
    sapphire: Preferences.THEMES.sapphire,
    quartz: Preferences.THEMES.quartz,
};

export const PreMadeDarkTheme: Partial<Record<ThemeKey, Theme>> = {
    indigo: Preferences.THEMES.indigo,
    onyx: Preferences.THEMES.onyx,
};

export enum ThemeSettings {
    SYNC_THEME_WITH_OS = "sync_theme_with_os",
    WEB_DARK_THEME = "web_dark_theme",
    WEB_LIGHT_THEME = "web_light_theme",
    APPLY_TO_ALL_TEAMS = "applyToAllTeams",
}

export const SyncWithOsSectionTitle = {
    id: t("user.settings.themes.syncWithOs.title"),
    defaultMessage: "Sync with OS appearance",
};

export const SyncWithOsSectionDesc = {
    id: t("user.settings.themes.syncWithOs.desc"),
    defaultMessage:
        "Automatically switch between light and dark themes when your system does. ",
};

export const SyncWithOsSectionInputFieldData: FieldsetCheckbox = {
    title: {
        id: t("user.settings.themes.syncWithOs.input"),
        defaultMessage: "Sync with OS appearance",
    },
    name: "syncWithOs",
    dataTestId: "syncWithOs",
};

export const ThemeColorsSectionTitle = {
    id: t("user.settings.themes.themeColors.title"),
    defaultMessage: "Theme colors",
};

export const ThemeColorsSectionDesc = {
    id: t("user.settings.themes.themeColors.desc"),
    defaultMessage: "Choose a theme from the options below or",
};

export const LightThemeColorsSectionTitle = {
    id: t("user.settings.themes.lightTheme.title"),
    defaultMessage: "Light theme",
};

export const LightThemeColorsSectionDesc = {
    id: t("user.settings.themes.lightTheme.desc"),
    defaultMessage: "Choose a light theme from the options below or",
};

export const DarkThemeColorsSectionTitle = {
    id: t("user.settings.themes.darkTheme.title"),
    defaultMessage: "Dark theme",
};

export const DarkThemeColorsSectionDesc = {
    id: t("user.settings.themes.darkTheme.desc"),
    defaultMessage: "Choose a dark theme from the options below or",
};

type Messages = {
    [key: string]: {
        id: string;
        defaultMessage: string;
    };
};

export const messages: Messages = defineMessages({
    sidebarBg: {
        id: t("user.settings.custom_theme.sidebarBg"),
        defaultMessage: "Sidebar BG",
    },
    sidebarText: {
        id: t("user.settings.custom_theme.sidebarText"),
        defaultMessage: "Sidebar Text",
    },
    sidebarHeaderBg: {
        id: t("user.settings.custom_theme.sidebarHeaderBg"),
        defaultMessage: "Sidebar Header BG",
    },
    sidebarTeamBarBg: {
        id: t("user.settings.custom_theme.sidebarTeamBarBg"),
        defaultMessage: "Team Sidebar BG",
    },
    sidebarHeaderTextColor: {
        id: t("user.settings.custom_theme.sidebarHeaderTextColor"),
        defaultMessage: "Sidebar Header Text",
    },
    sidebarUnreadText: {
        id: t("user.settings.custom_theme.sidebarUnreadText"),
        defaultMessage: "Sidebar Unread Text",
    },
    sidebarTextHoverBg: {
        id: t("user.settings.custom_theme.sidebarTextHoverBg"),
        defaultMessage: "Sidebar Text Hover BG",
    },
    sidebarTextActiveBorder: {
        id: t("user.settings.custom_theme.sidebarTextActiveBorder"),
        defaultMessage: "Sidebar Text Active Border",
    },
    sidebarTextActiveColor: {
        id: t("user.settings.custom_theme.sidebarTextActiveColor"),
        defaultMessage: "Sidebar Text Active Color",
    },
    onlineIndicator: {
        id: t("user.settings.custom_theme.onlineIndicator"),
        defaultMessage: "Online Indicator",
    },
    awayIndicator: {
        id: t("user.settings.custom_theme.awayIndicator"),
        defaultMessage: "Away Indicator",
    },
    dndIndicator: {
        id: t("user.settings.custom_theme.dndIndicator"),
        defaultMessage: "Do Not Disturb Indicator",
    },
    mentionBg: {
        id: t("user.settings.custom_theme.mentionBg"),
        defaultMessage: "Mention Jewel BG",
    },
    mentionColor: {
        id: t("user.settings.custom_theme.mentionColor"),
        defaultMessage: "Mention Jewel Text",
    },
    centerChannelBg: {
        id: t("user.settings.custom_theme.centerChannelBg"),
        defaultMessage: "Center Channel BG",
    },
    centerChannelColor: {
        id: t("user.settings.custom_theme.centerChannelColor"),
        defaultMessage: "Center Channel Text",
    },
    newMessageSeparator: {
        id: t("user.settings.custom_theme.newMessageSeparator"),
        defaultMessage: "New Message Separator",
    },
    linkColor: {
        id: t("user.settings.custom_theme.linkColor"),
        defaultMessage: "Link Color",
    },
    buttonBg: {
        id: t("user.settings.custom_theme.buttonBg"),
        defaultMessage: "Button BG",
    },
    buttonColor: {
        id: t("user.settings.custom_theme.buttonColor"),
        defaultMessage: "Button Text",
    },
    errorTextColor: {
        id: t("user.settings.custom_theme.errorTextColor"),
        defaultMessage: "Error Text Color",
    },
    mentionHighlightBg: {
        id: t("user.settings.custom_theme.mentionHighlightBg"),
        defaultMessage: "Mention Highlight BG",
    },
    mentionHighlightLink: {
        id: t("user.settings.custom_theme.mentionHighlightLink"),
        defaultMessage: "Mention Highlight Link",
    },
    codeTheme: {
        id: t("user.settings.custom_theme.codeTheme"),
        defaultMessage: "Code Theme",
    },
});

export const sidebarColorsTitle = {
    id: t("user.settings.themes.sidebarColors.title"),
    defaultMessage: "Sidebar colors",
};

export const centerChannelColorsTitle = {
    id: t("user.settings.themes.centerChannel.title"),
    defaultMessage: "Center channel colors",
};

export const statusColorsTitle = {
    id: t("user.settings.themes.statusColors.title"),
    defaultMessage: "Status and badge colors",
};

export const linkColorsTitle = {
    id: t("user.settings.themes.linkColors.title"),
    defaultMessage: "Link and button colors",
};

export const showElements = (
    props: Props,
    handleColorChange: (settingId: string, color: string) => void
) => {
    const sidebarElements: JSX.Element[] = [];
    const centerChannelElements: JSX.Element[] = [];
    const statusElements: JSX.Element[] = [];
    const linkAndButtonElements: JSX.Element[] = [];
    Constants.THEME_ELEMENTS.forEach((element, index) => {
        if (element.id === "codeTheme") {
            const codeThemeOptions: JSX.Element[] = [];
            let codeThemeURL = "";

            element.themes?.forEach((codeTheme, codeThemeIndex) => {
                if (codeTheme.id === props.theme[element.id]) {
                    codeThemeURL = codeTheme.iconURL;
                }
                codeThemeOptions.push(
                    <option
                        key={"code-theme-key" + codeThemeIndex}
                        value={codeTheme.id}
                    >
                        {codeTheme.uiName}
                    </option>
                );
            });

            const popoverContent = (
                <Popover
                    popoverStyle="info"
                    id="code-popover"
                    className="code-popover"
                >
                    <img
                        width="200"
                        alt={"code theme image"}
                        src={codeThemeURL}
                    />
                </Popover>
            );

            centerChannelElements.push(
                <div
                    className="col-sm-6 form-group"
                    key={"custom-theme-key" + index}
                >
                    <label className="custom-label">
                        <FormattedMessage {...messages[element.id]} />
                    </label>
                    <div
                        className="input-group theme-group group--code dropdown"
                        id={element.id}
                    >
                        <select
                            id="codeThemeSelect"
                            className="form-control"
                            defaultValue={props.theme[element.id]}
                            // onChange={this.onCodeThemeChange}
                        >
                            {codeThemeOptions}
                        </select>
                        <OverlayTrigger
                            placement="top"
                            overlay={popoverContent}
                            // ref={this.headerOverlayRef}
                        >
                            <span className="input-group-addon">
                                <img
                                    alt={"code theme image"}
                                    src={codeThemeURL}
                                />
                            </span>
                        </OverlayTrigger>
                    </div>
                </div>
            );
        } else if (element.group === "centerChannelElements") {
            centerChannelElements.push(
                <div
                    className="col-sm-6 form-group element"
                    key={"custom-theme-key" + index}
                >
                    <ColorChooser
                        id={element.id}
                        label={<FormattedMessage {...messages[element.id]} />}
                        value={props.theme[element.id] || ""}
                        onChange={handleColorChange}
                    />
                </div>
            );
        } else if (element.group === "sidebarElements") {
            // Need to support old typo mentionBj element for mentionBg
            let color = props.theme[element.id];
            if (!color && element.id === "mentionBg") {
                color = props.theme.mentionBj;
            }

            sidebarElements.push(
                <div
                    className="col-sm-6 form-group element"
                    key={"custom-theme-key" + index}
                >
                    {/* {console.log("i am running dash times")} */}

                    <ColorChooser
                        id={element.id}
                        label={<FormattedMessage {...messages[element.id]} />}
                        value={color || ""}
                        onChange={handleColorChange}
                    />
                </div>
            );
        } else if (element.group === "statusElements") {
            // Need to support old typo mentionBj element for mentionBg
            let color = props.theme[element.id];
            if (!color && element.id === "mentionBg") {
                color = props.theme.mentionBj;
            }

            statusElements.push(
                <div
                    className="col-sm-6 form-group element"
                    key={"custom-theme-key" + index}
                >
                    <ColorChooser
                        id={element.id}
                        label={<FormattedMessage {...messages[element.id]} />}
                        value={color || ""}
                        onChange={handleColorChange}
                    />
                </div>
            );
        } else {
            linkAndButtonElements.push(
                <div
                    className="col-sm-6 form-group element"
                    key={"custom-theme-key" + index}
                >
                    <ColorChooser
                        id={element.id}
                        label={<FormattedMessage {...messages[element.id]} />}
                        value={props.theme[element.id] || ""}
                        onChange={handleColorChange}
                    />
                </div>
            );
        }
    });
    return [
        {
            element: sidebarElements,
            id: "sidebarElements",
            message: sidebarColorsTitle,
        },
        {
            element: centerChannelElements,
            id: "centerChannelElements",
            message: centerChannelColorsTitle,
        },
        {
            element: statusElements,
            id: "statusElements",
            message: statusColorsTitle,
        },
        {
            element: linkAndButtonElements,
            id: "linkAndButtonElements",
            message: linkColorsTitle,
        },
    ];
};
