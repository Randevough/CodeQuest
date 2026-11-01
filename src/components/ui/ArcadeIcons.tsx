import React from "react";

export interface IconProps extends React.SVGProps<SVGSVGElement> {
    className?: string;
    size?: number;
}

/**
 * Trophy icon replacing 'emoji_events'
 */
export function TrophyIcon({ className = "w-5 h-5", size, ...props }: IconProps) {
    return (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            width={size}
            height={size}
            fill="currentColor"
            aria-hidden="true"
            className={className}
            {...props}
        >
            <path d="M19 4h-3V3a1 1 0 0 0-1-1H9a1 1 0 0 0-1 1v1H5a2 2 0 0 0-2 2v2a5 5 0 0 0 4.5 4.96A6 6 0 0 0 11 16.91V19H8a1 1 0 0 0 0 2h8a1 1 0 0 0 0-2h-3v-2.09a6 6 0 0 0 3.5-2.95A5 5 0 0 0 21 8V6a2 2 0 0 0-2-2zM5 8V6h3v4.61A3.01 3.01 0 0 1 5 8zm14 0a3.01 3.01 0 0 1-3 2.61V6h3v2z" />
        </svg>
    );
}

/**
 * Military medal icon replacing 'military_tech'
 */
export function MedalIcon({ className = "w-5 h-5", size, ...props }: IconProps) {
    return (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            width={size}
            height={size}
            fill="currentColor"
            aria-hidden="true"
            className={className}
            {...props}
        >
            <path d="M12 2 8 8h8l-4-6zm-5.5 0-3 6h5.33L8.5 2h-2zm11 0-1.67 6h5.33l-3-6h-.66zm-5.5 9a5.5 5.5 0 1 0 5.5 5.5A5.5 5.5 0 0 0 12 11zm1.2 7.7-1.2-.7-1.2.7.3-1.4-1-1 1.4-.2.7-1.3.7 1.3 1.4.2-1 1 .3 1.4z" />
        </svg>
    );
}

/**
 * Premium badge/ribbon icon replacing 'workspace_premium'
 */
export function PremiumBadgeIcon({ className = "w-5 h-5", size, ...props }: IconProps) {
    return (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            width={size}
            height={size}
            fill="currentColor"
            aria-hidden="true"
            className={className}
            {...props}
        >
            <path d="M12 2a6 6 0 0 0-6 6c0 2.22 1.21 4.16 3 5.2V22l3-2 3 2v-8.8c1.79-1.04 3-2.98 3-5.2a6 6 0 0 0-6-6zm0 2a4 4 0 1 1 0 8 4 4 0 0 1 0-8zm-1.8 14.5-1.2.8v-3.32a6.07 6.07 0 0 0 3 .02v3.3l-1.8-.8z" />
        </svg>
    );
}

/**
 * Rocket launch icon replacing 'rocket_launch'
 */
export function RocketLaunchIcon({ className = "w-5 h-5", size, ...props }: IconProps) {
    return (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            width={size}
            height={size}
            fill="currentColor"
            aria-hidden="true"
            className={className}
            {...props}
        >
            <path d="M9.2 12.3c.7-.7 1.6-1.1 2.5-1.3 1.5-.3 3.1-.1 4.4.7l1.7-1.7C19.2 8.6 20 6.6 20 4.5V4h-.5c-2.1 0-4.1.8-5.5 2.2L12.3 8c.8 1.3 1 2.9.7 4.4-.2.9-.6 1.8-1.3 2.5l-2.5-2.6zM4.7 19.3c.3.3.8.4 1.3.4.4 0 .9-.1 1.2-.4l2.1-2.1-2.5-2.5-2.1 2.1c-.6.7-.6 1.8 0 2.5zm14.8-16.8c-.3-.3-.7-.5-1.1-.5H18c-2.7 0-5.3 1.1-7.2 3L9.1 6.7C7.6 7 6.3 7.8 5.3 9L3.1 11.2c-.4.4-.5 1-.3 1.5.2.5.7.8 1.2.8l2.5.2 2.7 2.7.2 2.5c0 .5.3 1 .8 1.2.2.1.4.1.6.1.4 0 .7-.1 1-.4l2.2-2.2c1.2-1 2-2.3 2.3-3.8l1.7-1.7c1.9-1.9 3-4.5 3-7.2v-.4c0-.4-.2-.8-.5-1.1z" />
        </svg>
    );
}
