// Copyright (c) 2015-present Mattermost, Inc. All Rights Reserved.
// See LICENSE.txt for license information.

import React from 'react';

import EmojiPlayer from 'components/post_view/post_attachment_opengraph/gif_player_index';

interface PostEmojiProps {
    name: string;
    imageUrl: string;
    autoplayGifAndEmojis: string;
}
declare module 'react' {
    interface HTMLAttributes<T> extends AriaAttributes, DOMAttributes<T> {
        alt?: string;
    }
}

export default class PostEmoji extends React.PureComponent<PostEmojiProps> {
    public render() {
        const emojiText = ':' + this.props.name + ':';

        if (!this.props.imageUrl) {
            return emojiText;
        }

        if (this.props.autoplayGifAndEmojis === 'true') {
            return (
                <span
                    alt={emojiText}
                    className='emoticon'
                    title={emojiText}
                    style={{backgroundImage: 'url(' + this.props.imageUrl + ')'}}
                >
                    {emojiText}
                </span>
            );
        }
        return (
            <div
                className='emoticon'
                alt={emojiText}
                title={emojiText}
            >
                <EmojiPlayer
                    gif={this.props.imageUrl}
                    playButton={false}
                />
            </div>
        );
    }
}
