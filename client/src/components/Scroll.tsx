import React, { useEffect } from 'react';

const style = `
	.scroller {
		height: max-content;
	}

	.scroller[data-direction="horizontal-left"] .scroller__inner {
		width: fit-content;
		animation: scroll-horizontal 30s linear infinite;
	}
	.scroller[data-direction="horizontal-right"] .scroller__inner {
		width: fit-content;
		animation: scroll-horizontal 30s reverse linear infinite;
	}

	.scroller[data-direction="vertical-down"] .scroller__inner {
		width: fit-content;
		animation: scroll-vertical 30s reverse linear infinite;
	}

	.scroller[data-direction="vertical-up"] .scroller__inner {
		width: fit-content;
		animation: scroll-vertical 30s linear infinite;
	}

	@keyframes scroll-horizontal {
		to {
			transform: translate(calc(-50% - 4px), 0);
		}
	}

	@keyframes scroll-vertical {
		to {
			transform: translate(0, calc(-50% - 4px));
		}
	}

	@media (max-width: 768px) {
		.scroller[data-direction="vertical-down"] .scroller__inner {
			width: fit-content;
			animation: scroll-horizontal 30s reverse linear infinite;
		}

		.scroller[data-direction="vertical-up"] .scroller__inner {
			width: fit-content;
			animation: scroll-horizontal 30s linear infinite;
		}
	}
`;

interface ScrollProps {
	children: React.ReactNode;
	direction: 'horizontal-left' | 'horizontal-right' | 'vertical-down' | 'vertical-up';
}

const Scroll: React.FC<ScrollProps> = ({ children, direction }) => {
	useEffect(() => {
		const scrollers = document.querySelectorAll<HTMLElement>(".scroller");

		scrollers.forEach(scroller => {
			const scrollerInner = scroller.querySelector<HTMLElement>(".scroller__inner");

			if (scrollerInner) {
				const scrollerContent = Array.from(scrollerInner.children);

				scrollerContent.forEach(item => {
					const duplicatedItem = item.cloneNode(true);
					scrollerInner.appendChild(duplicatedItem);
				});
			}
		});
	}, []);

	return (
		<div data-direction={direction} className="scroller">
			<style>{style}</style>
			<div className={`scroller__inner flex gap-2 ${direction.startsWith("vertical") ? "md:flex-col min-w-full min-h-full" : ""}`}>
				{children}
			</div>
		</div>
	);
}

export default Scroll;