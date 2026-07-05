import { throttle } from "./libs/utils";
import { Swiper } from "swiper/bundle";
import { Autoplay, Pagination, Navigation } from "swiper/modules";
import { driveTabs } from "../js/libs/driveTabs";

import "./polyfills.js";
import "./blocks.js";

// Функции

const lockScroll = () => {
	document.body.classList.add('scroll-lock');
};

const unlockScroll = () => {
	document.body.classList.remove('scroll-lock');
};

// Ширина скроллбара
const setScrollbarWidth = () => {
	document.documentElement.style.setProperty('--sw', `${window.innerWidth - document.documentElement.clientWidth}px`);
}

const setCatalogCards = () => {
	const sections = document.querySelectorAll(".catalog-items");

	if (!sections.length) return; // Проверяем длину, так как querySelectorAll всегда возвращает объект

	sections.forEach(section => {
		const cards = section.querySelectorAll(".catalog-items__slide");

		cards.forEach(card => {
			// Теперь инициализируем табы для каждой конкретной карточки
			const tabs = driveTabs({
				container: card, // Указываем текущую карточку как родительский контейнер
				controls: '.catalog-items__gallery-navigation span',
				selects: [
					'.catalog-items__gallery-photo',
					'.catalog-items__gallery-pagination span'
				],
				cls: 'active',
				events: 'click, mouseenter',
				onInit() {
					console.log(this);
				},
				onClick(i) {
					console.log(this, i);
				},
				onTab(set, i) {
					console.log(this, set, i);
				},
				onTick(i) {
					console.log(this, i);
				},
			});
		});
	});
}

const setSwipers = () => {
	const catalogItemsSections = document.querySelectorAll(".catalog-items");

	catalogItemsSections.forEach(section => {
		const catalogItemsSwiper = new Swiper(section.querySelector('.catalog-items__swiper'), {
			modules: [Navigation],
			slidesPerView: 1.1,
			spaceBetween: 15,
			navigation: {
				prevEl: section.querySelector('.catalog-items__navigation-btn_prev'),
				nextEl: section.querySelector('.catalog-items__navigation-btn_next')
			},
			breakpoints: {
				780: {
					slidesPerView: 2,
					spaceBetween: 24
				},
				960: {
					slidesPerView: 3,
					spaceBetween: 24
				},
				1280: {
					slidesPerView: 4,
					spaceBetween: 24
				},
			}
		})
	})

	const heroSwiper = new Swiper('.hero__swiper', {
		modules: [Autoplay, Pagination],
		loop: true,
		speed: 1000,
		slidesPerView: 1,
		spaceBetween: 0,
		allowTouchMove: false,
		autoplay: {
			delay: 3000
		},
		pagination: {
			el: '.hero__pagination-items',
			clickable: true,
		}
	});
}

const setHeaderScroll = () => {
	const header = document.querySelector('.header');

	if (!header) return;

	if (!document.querySelector('.hero')) {
		header.classList.add('is-scrolled');
		return;
	}

	const onScroll = () => {
		header.classList.toggle('is-scrolled', window.scrollY > 0);
	};

	onScroll();
	window.addEventListener('scroll', throttle(onScroll, 100));
};

const setFiltersScript = () => {
	const dropdownBlocks = document.querySelectorAll('.catalog__filter, .catalog__sort');
	const filtersWrapper = document.querySelector('.catalog__filters-wrapper');
	const openFiltersBtn = document.querySelector('.catalog__open-filters');

	if (!dropdownBlocks.length) return;

	const closeAll = () => {
		dropdownBlocks.forEach(block => block.classList.remove('active'));

		filtersWrapper?.classList.remove('active');

		document.body.classList.remove('filters-open');
		unlockScroll();
	};

	openFiltersBtn?.addEventListener('click', (e) => {
		e.stopPropagation();

		filtersWrapper?.classList.add('active');
		document.body.classList.add('filters-open');

		lockScroll();
	});

	document.addEventListener('click', (event) => {
		const clickedTitle = event.target.closest('.catalog__filter-title, .catalog__sort-title');

		const clickedInsideFilters = event.target.closest('.catalog__filters');
		const clickedInsideSort = event.target.closest('.catalog__sort-selects');

		if (clickedTitle) {
			const currentBlock = clickedTitle.parentElement;
			const isActive = currentBlock.classList.contains('active');

			dropdownBlocks.forEach(block => block.classList.remove('active'));

			if (!isActive) {
				currentBlock.classList.add('active');

				if (window.innerWidth <= 960) {
					document.body.classList.add('filters-open');
					lockScroll();
				}
			}

			return;
		}

		if (!clickedInsideFilters && !clickedInsideSort) {
			closeAll();
		}
	});

	window.addEventListener('resize', () => {
		if (window.innerWidth > 960) {
			closeAll();
		}
	});
};

const setHeaderMenu = () => {
	const btn = document.querySelector('.header__menu-open');
	const menu = document.querySelector('.header__menu');

	const mobileBtn = document.querySelector('.header__navigation-button_menu');
	const mobileMenu = document.querySelector('.header__mobile-menu');

	if (btn && menu) {
		btn.addEventListener('click', (e) => {
			e.preventDefault();

			const isActive = menu.classList.contains('active');

			if (isActive) {
				menu.classList.remove('active');
				btn.classList.remove('active');
				document.body.classList.remove('filters-open');
				unlockScroll();
			} else {
				menu.classList.add('active');
				btn.classList.add('active');
				document.body.classList.add('filters-open');
				lockScroll();
			}
		});
	}

	if (mobileBtn && mobileMenu) {
		mobileBtn.addEventListener('click', (e) => {
			e.preventDefault();

			const isActive = mobileMenu.classList.contains('active');

			if (isActive) {
				mobileMenu.classList.remove('active');
				document.body.classList.remove('filters-open');
				unlockScroll();
			} else {
				mobileMenu.classList.add('active');
				document.body.classList.add('filters-open');
				lockScroll();
			}
		});
	}

	// Закрытие по клику вне
	document.addEventListener('click', (e) => {
		const clickedInside = e.target.closest(
			'.header__menu, .header__menu-open, .header__mobile-menu, .header__navigation-button_menu'
		);

		if (!clickedInside) {
			if (menu) menu.classList.remove('active');
			if (btn) btn.classList.remove('active');
			if (mobileMenu) mobileMenu.classList.remove('active');

			document.body.classList.remove('filters-open');
			unlockScroll();
		}
	});

	// Закрытие при ресайзе
	window.addEventListener('resize', () => {
		if (menu) menu.classList.remove('active');
		if (btn) btn.classList.remove('active');
		if (mobileMenu) mobileMenu.classList.remove('active');

		document.body.classList.remove('filters-open');
		unlockScroll();
	});
};

const setProduct = () => {
	const section = document.querySelector(".product");
	if (!section) return;

	const tabs = driveTabs({
		container: '.product__tabs',
		controls: '.product__tabs-button',
		selects: '.product__tab',
		cls: 'active'
	});

	const swiper = new Swiper('.product__gallery', {
		slidesPerView: 1,
		spaceBetween: 8,
		enabled: true,
		breakpoints: {
			960: {
				enabled: false
			}
		}
	});
}

// Запуск функций
document.addEventListener('DOMContentLoaded', () => {
	setSwipers();
	setScrollbarWidth();
	setHeaderScroll();
	setCatalogCards();
	setFiltersScript();
	setHeaderMenu();
	setProduct();
});