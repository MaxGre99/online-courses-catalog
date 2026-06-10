'use strict';

// DATA
const COURSES = [
	// Initially visible
	{
		id: 1,
		cat: 'Marketing',
		title: 'The Ultimate Google Ads Training Course',
		price: 100,
		author: 'Jerome Bell',
		photo: 'men/32',
	},
	{
		id: 2,
		cat: 'Management',
		title: 'Product Management Fundamentals',
		price: 480,
		author: 'Marvin McKinney',
		photo: 'men/45',
	},
	{
		id: 3,
		cat: 'HR & Recruting',
		title: 'HR Management and Analytics',
		price: 200,
		author: 'Leslie Alexander Li',
		photo: 'women/23',
	},
	{
		id: 4,
		cat: 'Marketing',
		title: 'Brand Management & PR Communications',
		price: 530,
		author: 'Kristin Watson',
		photo: 'women/44',
	},
	{
		id: 5,
		cat: 'Design',
		title: 'Graphic Design Basic',
		price: 500,
		author: 'Guy Hawkins',
		photo: 'men/67',
	},
	{
		id: 6,
		cat: 'Management',
		title: 'Business Development Management',
		price: 400,
		author: 'Dianne Russell',
		photo: 'women/15',
	},
	{
		id: 7,
		cat: 'Development',
		title: 'Highload Software Architecture',
		price: 600,
		author: 'Brooklyn Simmons',
		photo: 'men/55',
	},
	{
		id: 8,
		cat: 'HR & Recruting',
		title: 'Human Resources \u2013 Selection and Recruitment',
		price: 150,
		author: 'Kathryn Murphy',
		photo: 'women/77',
	},
	{
		id: 9,
		cat: 'Design',
		title: 'User Experience. Human-centered Design',
		price: 240,
		author: 'Cody Fisher',
		photo: 'men/89',
	},

	// Hidden -- revealed by "Load more"
	{
		id: 10,
		cat: 'Marketing',
		title: 'Advanced SEO & Content Marketing Strategy',
		price: 350,
		author: 'Jacob Jones',
		photo: 'men/22',
	},
	{
		id: 11,
		cat: 'Marketing',
		title: 'Social Media Marketing Mastery',
		price: 280,
		author: 'Cameron Williamson',
		photo: 'women/33',
	},
	{
		id: 12,
		cat: 'Management',
		title: 'Agile Project Management',
		price: 320,
		author: 'Ronald Richards',
		photo: 'men/11',
	},
	{
		id: 13,
		cat: 'HR & Recruting',
		title: 'Employee Engagement & Retention Strategies',
		price: 180,
		author: 'Eleanor Pena',
		photo: 'women/55',
	},
	{
		id: 14,
		cat: 'HR & Recruting',
		title: 'Talent Acquisition Masterclass',
		price: 260,
		author: 'Bessie Cooper',
		photo: 'women/66',
	},
	{
		id: 15,
		cat: 'HR & Recruting',
		title: 'Modern Onboarding Best Practices',
		price: 140,
		author: 'Theresa Webb',
		photo: 'women/11',
	},
	{
		id: 16,
		cat: 'Development',
		title: 'React.js Complete Guide',
		price: 450,
		author: 'Floyd Miles',
		photo: 'men/77',
	},
	{
		id: 17,
		cat: 'Development',
		title: 'Node.js & REST API Development',
		price: 380,
		author: 'Albert Flores',
		photo: 'men/88',
	},
];

// Category --> BEM modifier class
const CAT_MOD = {
	Marketing: 'marketing',
	Management: 'management',
	'HR & Recruting': 'hr',
	Design: 'design',
	Development: 'development',
};

const INITIAL_VISIBLE = 9;
const LOAD_STEP = 3;

// STATE
const state = {
	activeFilter: 'all',
	searchQuery: '',
	shown: INITIAL_VISIBLE,
};

// DOM references
const gridEl = document.getElementById('catalogGrid');
const emptyEl = document.getElementById('catalogEmpty');
const loadMoreWrap = document.getElementById('loadMoreWrap');
const loadMoreBtn = document.getElementById('loadMoreBtn');
const searchInput = document.getElementById('courseSearch');
const filterBtns = document.querySelectorAll('.catalog__filter');

// HELPERS

// Returns filtered + searched subset
const getFiltered = () => {
	const q = state.searchQuery.trim().toLowerCase();

	return COURSES.filter((course) => {
		const matchCat =
			state.activeFilter === 'all' || course.cat === state.activeFilter;
		const matchQ =
			!q ||
			course.title.toLowerCase().includes(q) ||
			course.author.toLowerCase().includes(q);
		return matchCat && matchQ;
	});
};

// Builds HTML string for one card
const buildCardHTML = (course, index) => {
	const mod = CAT_MOD[course.cat] || 'marketing';
	const photoSrc = `https://randomuser.me/api/portraits/${course.photo}.jpg`;
	const delay = (index % LOAD_STEP) * 55; // stagger only new cards

	return `
    <article
      class="course-card"
      role="listitem"
      data-id="${course.id}"
      style="animation-delay:${delay}ms"
    >
      <div class="course-card__thumb">
        <img
          src="${photoSrc}"
          alt="Photo of ${course.author}"
          loading="lazy"
          width="300"
          height="300"
        />
      </div>
      <div class="course-card__body">
        <span class="course-card__badge course-card__badge--${mod}">${course.cat}</span>
        <h2 class="course-card__name">${course.title}</h2>
        <div class="course-card__meta">
          <span class="course-card__price">$${course.price}</span>
          <span class="course-card__sep">|</span>
          <span class="course-card__author">by ${course.author}</span>
        </div>
      </div>
    </article>`;
};

// RENDER
const render = () => {
	const filtered = getFiltered();
	const visible = filtered.slice(0, state.shown);

	if (filtered.length === 0) {
		gridEl.innerHTML = '';
		emptyEl.hidden = false;
		loadMoreWrap.hidden = true;
		return;
	}

	emptyEl.hidden = true;
	gridEl.innerHTML = visible.map((c, i) => buildCardHTML(c, i)).join('');
	loadMoreWrap.hidden = state.shown >= filtered.length;
};

// EVENT HANDLERS
// Filter tabs
filterBtns.forEach((btn) => {
	btn.addEventListener('click', () => {
		if (btn.dataset.cat === state.activeFilter) return;

		// Update active styles + aria
		filterBtns.forEach((b) => {
			b.classList.remove('catalog__filter--active');
			b.setAttribute('aria-pressed', 'false');
		});
		btn.classList.add('catalog__filter--active');
		btn.setAttribute('aria-pressed', 'true');

		state.activeFilter = btn.dataset.cat;
		state.shown = INITIAL_VISIBLE;
		render();
	});
});

// Search -- debounced
let searchTimer;
searchInput.addEventListener('input', () => {
	clearTimeout(searchTimer);
	searchTimer = setTimeout(() => {
		state.searchQuery = searchInput.value;
		state.shown = INITIAL_VISIBLE;
		render();
	}, 200);
});

// Load more
loadMoreBtn.addEventListener('click', () => {
	state.shown += LOAD_STEP;
	render();
});

// INIT
render();
