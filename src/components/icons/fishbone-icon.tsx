import React from "react";

export const FishboneIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        {...props}
    >
        <path d="M12 12a3 3 0 100-6 3 3 0 000 6z" />
        <path d="M12 12v6" />
        <path d="M16 14l-4-2-4 2" />
        <path d="M16 11l-4-2-4 2" />
        <path d="M16 8l-4-2-4 2" />
    </svg>
);
