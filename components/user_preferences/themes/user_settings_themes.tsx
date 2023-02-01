// Copyright (c) 2015-present Mattermost, Inc. All Rights Reserved.
// See LICENSE.txt for license information.

import React, {useCallback, useState, MouseEvent, useRef, ClipboardEvent} from 'react';

import {FormattedMessage} from 'react-intl';

import {Theme} from 'mattermost-redux/selectors/entities/preferences';
import {applyTheme} from 'utils/utils';
import {Preferences} from 'mattermost-redux/constants';
import SectionCreator from 'components/widgets/modals/generic/section_creator';
import SaveChangesPanel from 'components/widgets/modals/generic/save_changes_panel';
import CheckboxItemCreator from 'components/widgets/modals/generic/checkbox-item-creator';

import {PreferenceType} from '@mattermost/types/preferences';

import {
    appltForALlTeamData,
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
} from './utils';
import PremadeThemeChooser from './premade_theme_chooser';
import './user_settings_themes.scss';
import { setThemeDefaults } from 'mattermost-redux/utils/theme_utils';
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
    [key: string]: boolean | string | undefined | Theme;
};

export default function UserSettingsThemes(props: Props): JSX.Element {
    const [haveChanges, setHaveChanges] = useState(false);
    const [currentTheme, setCurrentTheme] = useState(props.theme);
    const linkAndButtonStylesHeaderRef = useRef<HTMLDivElement>(null);
    const linkAndButtonStylesRef = useRef<HTMLDivElement>(null);
    const sidebarStylesHeaderRef = useRef<HTMLDivElement>(null);
    const centerChannelStylesHeaderRef = useRef<HTMLDivElement>(null);
    const sidebarStylesRef = useRef<HTMLDivElement>(null);
    const centerChannelStylesRef = useRef<HTMLDivElement>(null);
    const statusStylesHeaderRef = useRef<HTMLDivElement>(null);
    const statusStylesRef = useRef<HTMLDivElement>(null);
    const textareaRef = useRef<HTMLTextAreaElement>(null);

    const [applyToAllTeams, setApplyToAllTeams] = useState(props.applyToAllTeams)

    const [settings, setSettings] = useState<SettingsType>({
        [ThemeSettings.SYNC_THEME_WITH_OS]: props.syncThemeWithOs,
        [ThemeSettings.WEB_LIGHT_THEME]: props.webLightTheme,
        [ThemeSettings.WEB_DARK_THEME]: props.webDarkTheme,
    });
    const [copyTheme, setCopyTheme] = useState<string>(
        setCopytheme(props.theme),
    );

    type ModalType = {
        [key: string]: {
            headerRef: React.RefObject<HTMLDivElement>;
            contentRef: React.RefObject<HTMLDivElement>;
        };
    };

    const initialRefs = (
        headerRef: React.RefObject<HTMLDivElement>,
        contentRef: React.RefObject<HTMLDivElement>,
    ) => {
        return {headerRef, contentRef};
    };
    const modal: ModalType = {
        sidebarElements: initialRefs(sidebarStylesHeaderRef, sidebarStylesRef),
        centerChannelElements: initialRefs(
            centerChannelStylesHeaderRef,
            centerChannelStylesRef,
        ),
        statusElements: initialRefs(statusStylesHeaderRef, statusStylesRef),
        linkAndButtonElements: initialRefs(
            linkAndButtonStylesHeaderRef,
            linkAndButtonStylesRef,
            ),
    };
    const [showCustomElements, setShowCustomElements] = useState(false);

    const handleChange = useCallback(
        (values: Record<string, boolean | string | Theme>) => {
            setSettings({...settings, ...values});
            setHaveChanges(true);
        },
        [settings],
    );

    function handleCancel() {
        setSettings({
            [ThemeSettings.SYNC_THEME_WITH_OS]: props.syncThemeWithOs,
            [ThemeSettings.WEB_LIGHT_THEME]: props.webLightTheme,
            [ThemeSettings.WEB_DARK_THEME]: props.webDarkTheme,
        });
        setApplyToAllTeams(props.applyToAllTeams)
        setHaveChanges(false);
    }

    const handleSubmit = async (): Promise<void> => {
        const teamId = applyToAllTeams ?
            '' :
            props.teamId;

        const preferences: PreferenceType[] = [];
        const {savePreferences, currentUserId} = props;

        Object.keys(settings).forEach((setting) => {
            const category = Preferences.CATEGORY_THEME;
            preferences.push({
                user_id: currentUserId,
                category,
                name: setting,
                value:
                    typeof settings[setting] === 'string' ?
                        String(settings[setting]) :
                        JSON.stringify(settings[setting]),
            });
        });

        await savePreferences(currentUserId, preferences);
        if (applyToAllTeams) {
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
                    handleChange({[ThemeSettings.SYNC_THEME_WITH_OS]: e})
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
                    id='user.settings.themes.themeColors.desc'
                    defaultMessage='Choose a theme from the options below or '
                />
                <span
                    style={{color: 'blue', cursor: 'pointer'}}
                    onClick={() => setShowCustomElements(!showCustomElements)}
                >
                    {!showCustomElements ?
                        'create a custom theme' :
                        'create a preset theme'}
                </span>
            </div>
            {!showCustomElements && (
                <PremadeThemeChooser
                    theme={props.theme}
                    updateTheme={updateTheme}
                />
            )}
        </>
    );

    const PreMadeDarkThemeContent = (
        <PremadeThemeChooser
            themes={PreMadeDarkTheme}
            theme={settings[ThemeSettings.WEB_DARK_THEME]}
            updateTheme={(newTheme) =>
                handleChange({[ThemeSettings.WEB_DARK_THEME]: newTheme})
            }
        />
    );

    const PreMadeLightThemeContent = (
        <PremadeThemeChooser
            themes={PreMadeLightTheme}
            theme={settings[ThemeSettings.WEB_LIGHT_THEME]}
            updateTheme={(newTheme) => {
                handleChange({[ThemeSettings.WEB_LIGHT_THEME]: newTheme});
            }}
        />
    );

    const handleColorChange = (settingId: string, color: string) => {
        const {theme} = props;
        if (theme[settingId] !== color) {
            const newTheme: Theme = {
                ...theme,
                type: 'custom',
                [settingId]: color,
            };

            // For backwards compatability
            if (settingId === 'mentionBg') {
                newTheme.mentionBj = color;
            }

            new Promise((res) => {
                res(updateTheme(newTheme))
            }).then(() => setHaveChanges(true))

            const copyTheme = setCopytheme(newTheme);

            setCopyTheme(copyTheme);
        }
    };

    function setCopytheme(theme: Theme) {
        const copyTheme = Object.assign({}, theme);
        delete copyTheme.type;
        delete copyTheme.image;

        return JSON.stringify(copyTheme);
    }

    const toggleStyles = (
        e: MouseEvent<HTMLDivElement>,
        el: {
            id: string;
        },
    ) => {
        e.preventDefault();
        modal[el.id].headerRef?.current?.classList.toggle('open');
        toggleSection(modal[el.id].contentRef?.current);
    };

    function toggleSection(node: HTMLDivElement | null) {
        if (!node) {
            return;
        }
        node.classList.toggle('open');

        // set overflow after animation, so the colorchooser is fully shown
        node.ontransitionend = () => {
            if (node.classList.contains('open')) {
                node.style.overflowY = 'inherit';
            } else {
                node.style.overflowY = 'hidden';
            }
        };
    }

    const onCodeThemeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const theme: Theme = {
            ...props.theme,
            type: 'custom',
            codeTheme: e.target.value,
        };

        updateTheme(theme);
    };

    const pasteBoxChange = (e: ClipboardEvent<HTMLTextAreaElement>) => {
        let text = '';

        if ((window as any).clipboardData && (window as any).clipboardData.getData) { // IE
            text = (window as any).clipboardData.getData('Text');
        } else {
            text = e.clipboardData.getData('Text');//e.clipboardData.getData('text/plain');
        }

        if (text.length === 0) {
            return;
        }

        let theme;
        try {
            theme = JSON.parse(text);
        } catch (err) {
            return;
        }

        theme = setThemeDefaults(theme);

        setCopyTheme(JSON.stringify(theme))


        theme.type = 'custom';
        updateTheme(theme);
    }
    
    const selectTheme = () => {
        textareaRef.current?.focus();
        textareaRef.current?.setSelectionRange(0, copyTheme.length);
    }

    return (
        <div className='appearance-section'>
            <SectionCreator
                title={SyncWithOsSectionTitle}
                content={SyncWithOsSectionContent}
                description={SyncWithOsSectionDesc}
            />
            {!settings[ThemeSettings.SYNC_THEME_WITH_OS] && (
                <>
                    <div className='user-settings-modal__divider'/>
                    {
                        <SectionCreator
                            title={ThemeColorsSectionTitle}
                            content={PreMadeThemeContent}
                        />
                    }
                </>
            )}
            {settings[ThemeSettings.SYNC_THEME_WITH_OS] && (
                <>
                    <div className='user-settings-modal__divider'/>
                    {
                        <SectionCreator
                            title={LightThemeColorsSectionTitle}
                            content={
                                !showCustomElements ?
                                    PreMadeLightThemeContent :
                                    undefined
                            }
                            description={LightThemeColorsSectionDesc}
                        />
                    }
                    <div className='user-settings-modal__divider'/>
                    <SectionCreator
                        title={DarkThemeColorsSectionTitle}
                        content={PreMadeDarkThemeContent}
                        description={DarkThemeColorsSectionDesc}
                    />
                </>
            )}

            {showCustomElements &&
                showElements(props, handleColorChange, onCodeThemeChange).map(
                    (el, index) => (
                        <div
                            className='theme-elements row'
                            key={el.id + index}
                        >
                            <SectionCreator
                                key={el.message.id + index}
                                content={
                                    <div
                                        ref={modal[el.id].headerRef}
                                        className='theme-elements__header'
                                        id='sidebarStyles'
                                        style={{cursor: 'pointer'}}
                                        onClick={(e) => toggleStyles(e, el)}
                                    >
                                        <FormattedMessage {...el.message}/>
                                    </div>
                                }
                            />
                            <div
                                ref={modal[el.id].contentRef}
                                key={el.id + index}
                                className='theme-elements__body'
                            >
                                {el.element}
                            </div>
                        </div>
                    ),
                )}
                
                <SectionCreator 
                    content =
                    {
                        <CheckboxItemCreator
                            inputFieldData={appltForALlTeamData}
                            inputFieldValue={applyToAllTeams}
                            handleChange={(e) => {setApplyToAllTeams(e); setHaveChanges(true)}}
                        />
                    }
                />

            {haveChanges && (
                <SaveChangesPanel
                    handleSubmit={handleSubmit}
                    handleCancel={handleCancel}
                />
            )}
        </div>
    );
}


// const darkThemeMq = window.matchMedia("(prefers-color-scheme: dark)");
// darkThemeMq.addListener(e => {
//  if (e.matches) {
//   // Theme set to dark.
//  } else {
//     // Theme set to light.
//   }
// });