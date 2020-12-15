export class Widget {
    constructor(inputEl, config = {}) {
        this.inputEl = inputEl;
        const { data, categories } = config;
        if (data && categories) {
            this.emojiList = data;
            this.categoriesData = categories;

            this.renderAfter();
        } else {
            Promise.all([
                import('./data/emojis'),
                import('./data/categories')
            ]).then(([ data, categoriesData ]) => {
                this.emojiList = data.emojis;
                this.categoriesData = categoriesData.default;

                this.renderAfter();
            });
        }
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

        widgetButton.onclick = function () {
            setWidgetVisibility();
        };

        function setWidgetVisibility() {
            const hiddenWidgetClass = 'widget-hidden';
            if (widgetContent.classList.contains(hiddenWidgetClass)) {
                widgetContent.classList.remove(hiddenWidgetClass);
            } else {
                widgetContent.classList.add(hiddenWidgetClass);
            }
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
        emojiListContent.forEach(emoji => {
            const emojiEl = document.createElement('span');

            emojiEl.innerHTML = emoji.html;
            emojiEl.setAttribute('title', emoji.name);
            emojiEl.addEventListener('click', () => {
                this.inputEl.value += emoji.emoji;
            });
            emojiContainerEl.appendChild(emojiEl);
        });
    }


}
