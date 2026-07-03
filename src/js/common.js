import { throttle } from "./libs/utils";
import { Swiper } from "swiper/bundle";
import { Autoplay, Pagination, Navigation } from "swiper/modules";
import { driveTabs } from "../js/libs/driveTabs";

import "./polyfills.js";
import "./blocks.js";

// Функции

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

	const onScroll = () => {
		if (window.scrollY > 0) {
			header.classList.add('is-scrolled');
		} else {
			header.classList.remove('is-scrolled');
		}
	}

	window.addEventListener('scroll', throttle(onScroll, 100));

	if (!document.querySelector('.hero')) {
		header.classList.add('is-scrolled')
	} else {
		onScroll();
		window.addEventListener('scroll', throttle(onScroll, 100));
	}
}

const setFiltersScript = () => {

	const dropdownBlocks = document.querySelectorAll('.catalog__filter, .catalog__sort');

	if(!dropdownBlocks) return;

	document.addEventListener('click', (event) => {
		if (window.innerWidth < 960) {
			return;
		}

		const clickedTitle = event.target.closest('.catalog__filter-title, .catalog__sort-title');

		const clickedInsideMenu = event.target.closest('.catalog__filter-menu, .catalog__sort-selects');

		if (clickedTitle) {

			const currentBlock = clickedTitle.parentElement;
			const isActive = currentBlock.classList.contains('active');

			dropdownBlocks.forEach(block => block.classList.remove('active'));

			if (!isActive) {
				currentBlock.classList.add('active');
			}
		} else if (!clickedInsideMenu) {
			dropdownBlocks.forEach(block => block.classList.remove('active'));
		}
	});

	window.addEventListener('resize', () => {
		if (window.innerWidth < 960) {
			dropdownBlocks.forEach(block => block.classList.remove('active'));
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
});