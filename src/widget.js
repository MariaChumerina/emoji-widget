export class Widget {
    constructor(config = {}) {
        const { data, categories } = config;

        if (data && categories) {
            this.emojiList = data;
            this.categoriesData = categories;

            this.init();
        } else {
            Promise.all([
                import('./data/emojis'),
                import('./data/categories')
            ]).then(([ data, categoriesData ]) => {
                this.emojiList = data.emojis;
                this.categoriesData = categoriesData.default;

                this.init();
            });
        }
    }

    init() {
        const DEFAULT_CATEGORY = Object.keys(this.categoriesData)[0];

        this.initTabs();
        this.showPageByCategory(Number(DEFAULT_CATEGORY));
    }

    initTabs() {
        const widgetTabsEl = document.getElementById('widgetTabs');

        Object.keys(this.categoriesData).forEach((categoryId, index) => {
            const { title } = this.categoriesData[categoryId];
            const tabButtonEl = document.createElement('button');

            tabButtonEl.setAttribute('title', title);
            tabButtonEl.classList.add('tab-item');
            tabButtonEl.innerHTML = require(`./images/categories/cat-${categoryId}.svg`);
            tabButtonEl.addEventListener('click', () => {
                this.showPageByCategory(Number(categoryId));
            });

            widgetTabsEl.appendChild(tabButtonEl);
        });
        this.widgetButtonElList = document.querySelectorAll('#widgetTabs .tab-item');
    }

    setSelectedCategory(index) {
        this.widgetButtonElList.forEach(el => el.classList.remove('selected'));
        this.widgetButtonElList[index].classList.add('selected');
    }

    showPageByCategory(categoryId) {
        const index = Object.keys(this.categoriesData).indexOf(categoryId.toString());
        const emojiListContent = this.emojiList.filter(e => e.category === categoryId);
        const emojiContainerEl = document.getElementById('emojiContainer');
        const input = document.getElementById('input-field');

        emojiContainerEl.innerHTML = '';
        emojiListContent.forEach(emoji => {
            const emojiEl = document.createElement('span');

            emojiEl.innerHTML = emoji.html;
            emojiEl.setAttribute('title', emoji.name);
            emojiEl.addEventListener('click', () => {
                input.value = input.value += emoji.emoji;
            });
            emojiContainerEl.appendChild(emojiEl);
        });


        this.setSelectedCategory(index);
    }
}
