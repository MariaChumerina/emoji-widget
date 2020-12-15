export class Widget {
    create(inputEl, config = {}) {
        return new Promise((resolve, reject) => {
            this.inputEl = inputEl;
            const { data, categories } = config;
            if (data && categories) {
                this.emojiList = data;
                this.categoriesData = categories;

                resolve(this.renderAfter());
            } else {
                Promise.all([
                    import('./data/emojis'),
                    import('./data/categories')
                ])
                .then(([ data, categoriesData ]) => {
                    this.emojiList = data.emojis;
                    this.categoriesData = categoriesData.default;

                    resolve(this.renderAfter());
                })
                .catch(reject)
            }
        });
    }

    renderAfter() {
        const mainEl = document.createElement('article');

        mainEl.innerHTML = `
            <button type="button" class="widget-button widget-button-position" id="widget-button">
            </button>
            <div class="widget widget-hidden" id="widget-content">
                <nav class="widget-navigation">
                    <div class="widget-tabs" id="widgetTabs"></div>
                    <div class="search-field">
                        <input class="search-input" id="search-input" placeholder="Поиск Emoji">
                        <button class="search-button"></button>
                    </div>
                </nav>
                <div class="emoji-container" id="emojiContainer"></div>
            </div>
        `;
        this.inputEl.parentNode.insertBefore(mainEl, this.inputEl.nextSibling);

        this.init();

        return mainEl;
    }

    init() {
        const DEFAULT_CATEGORY = Object.keys(this.categoriesData)[0];

        this.initWidgetVisibility();
        this.initTabs();
        this.showPageByCategory(Number(DEFAULT_CATEGORY));
        this.setEmojiSearch();
    }

    initWidgetVisibility() {
        const widgetButton = document.getElementById('widget-button');
        const widgetContent = document.getElementById('widget-content');

        widgetButton.addEventListener('click', setWidgetVisibility);

        function setWidgetVisibility() {
            const hiddenWidgetClass = 'widget-hidden';
            widgetContent.classList.toggle(hiddenWidgetClass);
        }
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

            tabButtonEl.querySelector('svg').classList.add('tab-icon');
            widgetTabsEl.appendChild(tabButtonEl);
        });
        this.widgetButtonElList = document.querySelectorAll('#widgetTabs .tab-item');
    }

    setSelectedCategory(index) {
        this.widgetButtonElList.forEach(el => el.classList.remove('selected'));
        this.widgetButtonElList[index]?.classList.add('selected');
    }

    setEmojiSearch() {
        const searchInput = document.getElementById('search-input');
        searchInput.addEventListener('input', (e) => {
            const { value } = e.target;
            const regexp = new RegExp(`\\b${value}`, 'i');
            const emojis = this.emojiList.filter(c => c.name.match(regexp));
            if (value.length > 0) {
                this.setSelectedCategory(-1);
            }
            this.showEmoji(emojis);
        });
    }

    showPageByCategory(categoryId) {
        const index = Object.keys(this.categoriesData).indexOf(categoryId.toString());
        const emojiListContent = this.emojiList.filter(e => e.category === categoryId);
        this.showEmoji(emojiListContent);
        this.setSelectedCategory(index);
    }

    showEmoji(emojiListContent) {
        const emojiContainerEl = document.getElementById('emojiContainer');

        emojiContainerEl.innerHTML = '';
        emojiListContent.forEach(emojiItem => {
            const emojiEl = document.createElement('button');
            emojiEl.classList.add('emoji-button');

            emojiEl.innerHTML = emojiItem.html;
            emojiEl.setAttribute('title', emojiItem.name);
            emojiEl.addEventListener('click', () => {
                this.inputEl.value += emojiItem.emoji;
            });
            emojiContainerEl.appendChild(emojiEl);
        });
    }


}
