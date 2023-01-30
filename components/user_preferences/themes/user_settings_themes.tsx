// Copyright (c) 2015-present Mattermost, Inc. All Rights Reserved.
// See LICENSE.txt for license information.

import React, { useCallback, useState } from "react";

import { Theme } from "mattermost-redux/selectors/entities/preferences";
import { applyTheme } from "utils/utils";
import { Preferences } from "mattermost-redux/constants";
import SectionCreator from "components/widgets/modals/generic/section_creator";
import SaveChangesPanel from "components/widgets/modals/generic/save_changes_panel";
import CheckboxItemCreator from "components/widgets/modals/generic/checkbox-item-creator";

import { PreferenceType } from "@mattermost/types/preferences";

import PremadeThemeChooser from "./premade_theme_chooser";

import {
    DarkThemeColorsSectionDesc,
    DarkThemeColorsSectionTitle,
    LightThemeColorsSectionDesc,
    LightThemeColorsSectionTitle,
    PreMadeDarkTheme,
    PreMadeLightTheme,
    showElements,
    SyncWithOsSectionDesc,
    SyncWithOsSectionInputFieldData,
    SyncWithOsSectionTitle,
    ThemeColorsSectionTitle,
    ThemeSettings,
    // toggleSidebarStyles,
} from "./utils";
import Constants from "utils/constants";
import ColorChooser from "../display/user_settings_theme/color_chooser/color_chooser";
import { defineMessages, FormattedMessage } from "react-intl";
import OverlayTrigger from "components/overlay_trigger";
import Popover from "components/widgets/popover";
import { ActionFunc, ActionResult } from "mattermost-redux/types/actions";
import './user_settings_themes.scss'
export type Props = {
    currentUserId: string;
    teamId: string;
    theme: Theme;
    syncThemeWithOs: boolean;
    webLightTheme: Theme;
    webDarkTheme: Theme;
    savePreferences: (
        userId: string,
        preferences: PreferenceType[]
    ) => Promise<{ data: boolean }>;
    saveTheme: (teamId: string, theme: Theme) => void;
    deleteTeamSpecificThemes: () => void;
    applyToAllTeams: boolean;
};
type SettingsType = {
    [ThemeSettings.SYNC_THEME_WITH_OS]: boolean;
    [ThemeSettings.WEB_LIGHT_THEME]: Theme;
    [ThemeSettings.WEB_DARK_THEME]: Theme;
    [ThemeSettings.APPLY_TO_ALL_TEAMS]: boolean;
    [key: string]: boolean | string | undefined | Theme;
};

export default function UserSettingsThemes(props: Props): JSX.Element {
    const [haveChanges, setHaveChanges] = useState(false);
    const [currentTheme, setCurrentTheme] = useState(props.theme);

    const [settings, setSettings] = useState<SettingsType>({
        [ThemeSettings.SYNC_THEME_WITH_OS]: props.syncThemeWithOs,
        [ThemeSettings.WEB_LIGHT_THEME]: props.webLightTheme,
        [ThemeSettings.WEB_DARK_THEME]: props.webDarkTheme,
        [ThemeSettings.APPLY_TO_ALL_TEAMS]: props.applyToAllTeams,
    });

    type ShowType = {
        [key: string]: { modal: string; open: boolean };
    };
    let initial = { modal: "", open: false };
    const [show, setShow] = useState<ShowType>({
        sidebarElements: initial,
        centerChannelElements: initial,
        statusElements: initial,
        linkAndButtonElements: initial,
    });
    const [showColorsElement, setShowColorsElement] = useState(false);

    const handleChange = useCallback(
        (values: Record<string, boolean | string | Theme>) => {
            setSettings({ ...settings, ...values });
            setHaveChanges(true);
        },
        [settings]
    );

    function handleCancel() {
        setSettings({
            [ThemeSettings.SYNC_THEME_WITH_OS]: props.syncThemeWithOs,
            [ThemeSettings.WEB_LIGHT_THEME]: props.webLightTheme,
            [ThemeSettings.WEB_DARK_THEME]: props.webDarkTheme,
            [ThemeSettings.APPLY_TO_ALL_TEAMS]: props.applyToAllTeams
        });
        setHaveChanges(false);
    }

    const handleSubmit = async (): Promise<void> => {
        const teamId = settings[ThemeSettings.APPLY_TO_ALL_TEAMS] ? '' : props.teamId;

        const preferences: PreferenceType[] = [];
        const { savePreferences, currentUserId } = props;

        Object.keys(settings).forEach((setting) => {
            const category = Preferences.CATEGORY_THEME;
            preferences.push({
                user_id: currentUserId,
                category,
                name: setting,
                value:
                    typeof settings[setting] === "string"
                        ? String(settings[setting])
                        : JSON.stringify(settings[setting]),
            });
        });

        await savePreferences(currentUserId, preferences);
        if (settings[ThemeSettings.APPLY_TO_ALL_TEAMS]) {
            await props.deleteTeamSpecificThemes();
        }
        setHaveChanges(false);
        await props.saveTheme(teamId, currentTheme);
    };

    const SyncWithOsSectionContent = (
        <>
            <CheckboxItemCreator
                inputFieldValue={settings[ThemeSettings.SYNC_THEME_WITH_OS]}
                inputFieldData={SyncWithOsSectionInputFieldData}
                handleChange={(e) =>
                    handleChange({ [ThemeSettings.SYNC_THEME_WITH_OS]: e })
                }
            />
        </>
    );

    const updateTheme = (newTheme: Theme): void => {
        let themeChanged = currentTheme.length === newTheme.length;
        if (!themeChanged) {
            for (const field in newTheme) {
                if (newTheme[field]) {
                    if (currentTheme[field] !== newTheme[field]) {
                        themeChanged = true;
                        break;
                    }
                }
            }
        }
        setCurrentTheme(newTheme);
        applyTheme(newTheme);
    };

    const PreMadeThemeContent = (
        <>
            <div>
                <FormattedMessage
                    id="user.settings.themes.themeColors.desc"
                    defaultMessage="Choose a theme from the options below or "
                />
                <span style={{color: 'blue', cursor: 'pointer'}} onClick={() => setShowColorsElement(true)}>
                    create a custom theme
                </span>
            </div>
            <PremadeThemeChooser
                theme={props.theme}
                updateTheme={updateTheme}
            />
        </>
    );

    const PreMadeDarkThemeContent = (
        <PremadeThemeChooser
            themes={PreMadeDarkTheme}
            theme={settings[ThemeSettings.WEB_DARK_THEME]}
            updateTheme={(newTheme) =>
                handleChange({ [ThemeSettings.WEB_DARK_THEME]: newTheme })
            }
        />
    );

    const PreMadeLightThemeContent = (
        <PremadeThemeChooser
            themes={PreMadeLightTheme}
            theme={settings[ThemeSettings.WEB_LIGHT_THEME]}
            updateTheme={(newTheme) => {
                handleChange({ [ThemeSettings.WEB_LIGHT_THEME]: newTheme });
            }}
        />
    );

    const handleShowModal = (id: string, open: boolean) => {
        switch (id) {
            case "sidebarElements":
            case "centerChannelElements":
            case "statusElements":
            case "linkAndButtonElements":
                setShow({ ...show, [id]: { modal: id, open } });
                break;
            default:
                setShow({ ...show });
        }
    };

    const handleColorChange = (settingId: string, color: string) => {
        const { theme } = props;
        if (theme[settingId] !== color) {
            const newTheme: Theme = {
                ...theme,
                type: "custom",
                [settingId]: color,
            };

            // For backwards compatability
            if (settingId === "mentionBg") {
                newTheme.mentionBj = color;
            }

            updateTheme(newTheme);

            // const copyTheme = this.setCopyTheme(newTheme);

            // this.setState({
            //     copyTheme,
            // });
        }
    };

    return (
        <>
            <SectionCreator
                title={SyncWithOsSectionTitle}
                content={SyncWithOsSectionContent}
                description={SyncWithOsSectionDesc}
            />
            {!settings[ThemeSettings.SYNC_THEME_WITH_OS] && (
                <>
                    <div className="user-settings-modal__divider" />
                    {
                        <SectionCreator
                            title={ThemeColorsSectionTitle}
                            content={PreMadeThemeContent}
                            // description={ThemeColorsSectionDesc}
                        />
                    }
                </>
            )}
            {settings[ThemeSettings.SYNC_THEME_WITH_OS] && (
                <>
                    <div className="user-settings-modal__divider" />
                    {
                        <SectionCreator
                            title={LightThemeColorsSectionTitle}
                            content={
                                !showColorsElement
                                    ? PreMadeLightThemeContent
                                    : undefined
                            }
                            description={LightThemeColorsSectionDesc}
                        />
                    }
                    <div className="user-settings-modal__divider" />
                    <SectionCreator
                        title={DarkThemeColorsSectionTitle}
                        content={PreMadeDarkThemeContent}
                        description={DarkThemeColorsSectionDesc}
                    />
                </>
            )}

            {showColorsElement &&
                showElements(props, handleColorChange).map((el, index) => (
                    <div key={el.id + index}>
                        <SectionCreator
                            key={el.message.id + index}
                            content={
                                <div
                                    id="sidebarStyles"
                                    style={{ cursor: "pointer" }}
                                    onClick={() =>
                                        handleShowModal(
                                            el.id,
                                            !show[el.id]?.open
                                        )
                                    }
                                >
                                    {console.log({ ...el.message })}
                                    <FormattedMessage {...el.message} />
                                </div>
                            }
                        />
                        {showColorsElement && show[el.id]?.open && (
                            <div 
                                key={el.id + index}
                                style={show[el.id].open ? { overflowY: 'inherit'} : { overflowY: 'hidden'}}
                                className={`theme-elements__body ${show[el.id].open ? 'open' : ''}`}
                            >
                                {el.element}
                            </div>
                        )}
                    </div>
                ))}

            {haveChanges && (
                <SaveChangesPanel
                    handleSubmit={handleSubmit}
                    handleCancel={handleCancel}
                />
            )}
        </>
    );
}
