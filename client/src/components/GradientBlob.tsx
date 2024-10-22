import React from 'react';

interface GradientBlobProps {
    top?: string | number;
    left?: string | number;
    right?: string | number;
    scale?: number;
}

const GradientBlob: React.FC<GradientBlobProps> = ({ top, left, right, scale = 1 }) => {
    return (
        <svg
            width="882"
            height="874"
            viewBox="0 0 882 874"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            style={{
                position: 'absolute',
                opacity: 0.25,
                top,
                left,
                right,
                transform: `scale(${scale})`,
                zIndex: -1
            }}
        >
            <g opacity="0.6" filter="url(#filter0_f_113_2)">
                <mask
                    id="mask0_113_2"
                    style={{ maskType: 'alpha' }}
                    maskUnits="userSpaceOnUse"
                    x="180"
                    y="180"
                    width="522"
                    height="514"
                >
                    <path
                        d="M701.458 532.908C701.516 530.206 700.784 527.375 699.339 524.701C697.894 522.028 695.787 519.608 693.232 517.69L504.057 375.613L679.337 208.045C681.599 205.739 682.771 202.59 682.665 199.105C682.559 195.62 681.182 192.002 678.754 188.833C676.326 185.664 672.989 183.129 669.28 181.636C665.572 180.142 661.708 179.778 658.31 180.601L189.469 326.146C186.828 326.864 184.605 328.29 183.03 330.278C181.455 332.266 180.586 334.744 180.511 337.456C180.436 340.168 181.158 343.016 182.604 345.707C184.049 348.397 186.165 350.833 188.733 352.762L375.082 492.715L206.167 665.514C204.005 667.882 202.938 671.058 203.134 674.538C203.33 678.017 204.779 681.601 207.25 684.718C209.721 687.835 213.072 690.307 216.77 691.74C220.469 693.173 224.301 693.484 227.659 692.625L692.672 544.26C695.282 543.514 697.471 542.071 699.014 540.077C700.558 538.082 701.401 535.609 701.458 532.908Z"
                        fill="black"
                    />
                </mask>
                <g mask="url(#mask0_113_2)">
                    <g filter="url(#filter1_f_113_2)">
                        <path
                            d="M297.101 334.211L417.928 368.432C391.924 606.278 493.551 834.522 644.492 877.273L623.676 1067.67C406.125 1006.05 259.621 677.018 297.101 334.211Z"
                            fill="url(#paint0_linear_113_2)"
                        />
                        <path
                            d="M360.085 352.049L461.642 380.813C439.791 580.678 525.211 772.523 652.048 808.446L634.552 968.475C451.701 916.687 328.589 640.13 360.085 352.049Z"
                            fill="url(#paint1_linear_113_2)"
                        />
                        <path
                            d="M284.63 448.572L405.457 482.794C431.461 244.947 575.392 86.2519 726.333 129.002L747.149 -61.3918C529.598 -123.008 322.109 105.765 284.63 448.572Z"
                            fill="url(#paint2_linear_113_2)"
                        />
                        <path
                            d="M167.357 476.091L288.184 510.313C314.188 272.466 458.119 113.771 609.06 156.521L629.876 -33.8727C412.325 -95.4887 204.836 133.284 167.357 476.091Z"
                            fill="url(#paint3_linear_113_2)"
                        />
                    </g>
                    <g filter="url(#filter2_f_113_2)">
                        <path
                            d="M408.355 400.049L458.816 414.341C447.956 513.674 490.399 608.996 553.437 626.85L544.744 706.365C453.887 680.632 392.703 543.217 408.355 400.049Z"
                            fill="url(#paint4_linear_113_2)"
                        />
                        <path
                            d="M735.894 469.416L750.188 545.254C577.94 540.917 452.32 614.453 470.172 709.169L332.256 705.696C306.52 569.152 487.62 463.166 735.894 469.416Z"
                            fill="url(#paint5_linear_113_2)"
                        />
                        <path
                            d="M735.435 386.405L749.729 462.242C577.481 457.906 451.86 531.441 469.713 626.157L331.797 622.685C306.061 486.14 487.161 380.154 735.435 386.405Z"
                            fill="url(#paint6_linear_113_2)"
                        />
                        <path
                            d="M536.359 522.094L550.653 597.931C378.406 593.595 252.785 667.13 270.637 761.846L132.722 758.374C106.985 621.829 288.085 515.843 536.359 522.094Z"
                            fill="url(#paint7_linear_113_2)"
                        />
                        <path
                            d="M403.147 447.811L453.608 462.103C464.468 362.77 524.579 296.494 587.616 314.348L596.31 234.833C505.453 209.1 418.799 304.643 403.147 447.811Z"
                            fill="url(#paint8_linear_113_2)"
                        />
                        <path
                            d="M497.374 394.13L547.835 408.422C558.695 309.089 618.805 242.813 681.843 260.667L690.537 181.152C599.68 155.419 513.026 250.962 497.374 394.13Z"
                            fill="url(#paint9_linear_113_2)"
                        />
                    </g>
                </g>
            </g>
            <defs>
                <filter
                    id="filter0_f_113_2"
                    x="0.505371"
                    y="0.170685"
                    width="880.956"
                    height="872.93"
                    filterUnits="userSpaceOnUse"
                    colorInterpolationFilters="sRGB"
                >
                    <feFlood floodOpacity="0" result="BackgroundImageFix" />
                    <feBlend mode="normal" in="SourceGraphic" in2="BackgroundImageFix" result="shape" />
                    <feGaussianBlur stdDeviation="90" result="effect1_foregroundBlur_113_2" />
                </filter>
                <filter
                    id="filter1_f_113_2"
                    x="10.3183"
                    y="-228.457"
                    width="893.869"
                    height="1453.16"
                    filterUnits="userSpaceOnUse"
                    colorInterpolationFilters="sRGB"
                >
                    <feFlood floodOpacity="0" result="BackgroundImageFix" />
                    <feBlend mode="normal" in="SourceGraphic" in2="BackgroundImageFix" result="shape" />
                    <feGaussianBlur stdDeviation="78.5193" result="effect1_foregroundBlur_113_2" />
                </filter>
                <filter
                    id="filter2_f_113_2"
                    x="51.7656"
                    y="98.4451"
                    width="776.942"
                    height="741.92"
                    filterUnits="userSpaceOnUse"
                    colorInterpolationFilters="sRGB"
                >
                    <feFlood floodOpacity="0" result="BackgroundImageFix" />
                    <feBlend mode="normal" in="SourceGraphic" in2="BackgroundImageFix" result="shape" />
                    <feGaussianBlur stdDeviation="39.2597" result="effect1_foregroundBlur_113_2" />
                </filter>
                <linearGradient
                    id="paint0_linear_113_2"
                    x1="494.387"
                    y1="390.08"
                    x2="326.327"
                    y2="983.459"
                    gradientUnits="userSpaceOnUse"
                >
                    <stop stopColor="#FD8A03" />
                    <stop offset="1" stopColor="#FED500" />
                </linearGradient>
                <linearGradient
                    id="paint1_linear_113_2"
                    x1="525.873"
                    y1="398.998"
                    x2="384.636"
                    y2="897.67"
                    gradientUnits="userSpaceOnUse"
                >
                    <stop stopColor="#FD6C03" />
                    <stop offset="1" stopColor="#FEC600" />
                </linearGradient>
                <linearGradient
                    id="paint2_linear_113_2"
                    x1="481.918"
                    y1="504.458"
                    x2="649.978"
                    y2="-88.9196"
                    gradientUnits="userSpaceOnUse"
                >
                    <stop stopColor="#FF8412" />
                    <stop offset="1" stopColor="#FFB912" />
                </linearGradient>
                <linearGradient
                    id="paint3_linear_113_2"
                    x1="364.645"
                    y1="531.977"
                    x2="532.705"
                    y2="-61.4005"
                    gradientUnits="userSpaceOnUse"
                >
                    <stop stopColor="#FF3D12" />
                    <stop offset="1" stopColor="#FFB912" />
                </linearGradient>
                <linearGradient
                    id="paint4_linear_113_2"
                    x1="490.748"
                    y1="423.382"
                    x2="420.561"
                    y2="671.197"
                    gradientUnits="userSpaceOnUse"
                >
                    <stop stopColor="#FD8A03" />
                    <stop offset="1" stopColor="#FEC600" />
                </linearGradient>
                <linearGradient
                    id="paint5_linear_113_2"
                    x1="759.234"
                    y1="593.218"
                    x2="326.449"
                    y2="674.791"
                    gradientUnits="userSpaceOnUse"
                >
                    <stop stopColor="#FD7B03" />
                    <stop offset="1" stopColor="#FEB700" />
                </linearGradient>
                <linearGradient
                    id="paint6_linear_113_2"
                    x1="758.775"
                    y1="510.206"
                    x2="325.99"
                    y2="591.779"
                    gradientUnits="userSpaceOnUse"
                >
                    <stop stopColor="#FD5D03" />
                    <stop offset="1" stopColor="#FEB700" />
                </linearGradient>
                <linearGradient
                    id="paint7_linear_113_2"
                    x1="559.7"
                    y1="645.895"
                    x2="126.915"
                    y2="727.468"
                    gradientUnits="userSpaceOnUse"
                >
                    <stop stopColor="#FD4E03" />
                    <stop offset="1" stopColor="#FEC600" />
                </linearGradient>
                <linearGradient
                    id="paint8_linear_113_2"
                    x1="485.541"
                    y1="471.15"
                    x2="555.728"
                    y2="223.336"
                    gradientUnits="userSpaceOnUse"
                >
                    <stop stopColor="#FFA012" />
                    <stop offset="1" stopColor="#FFB912" />
                </linearGradient>
                <linearGradient
                    id="paint9_linear_113_2"
                    x1="579.768"
                    y1="417.469"
                    x2="649.955"
                    y2="169.655"
                    gradientUnits="userSpaceOnUse"
                >
                    <stop stopColor="#FF9212" />
                    <stop offset="1" stopColor="#FFB912" />
                </linearGradient>
            </defs>
        </svg>
    );
};

export default GradientBlob;