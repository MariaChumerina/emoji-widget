import './styles/widget.styl';
import './styles/theming.css';

export class Widget {

    create(inputEl, config = { darkMode: false }) {
        return new Promise((resolve, reject) => {
            const { data, categories, theming, darkMode } = config;
            this.inputEl = inputEl;
            this.recentlyUsed = [];
            this.theme = darkMode ? 'dark': 'light';

            if (theming) {
                this.theming = theming;
            } else {
                import('./data/theming').then(res => {
                    this.theming = res.default;
                });
            }

            if (data && categories) {
                this.emojiList = data;
                this.categoriesData = categories;

                resolve(this.render());
            } else {
                Promise.all([
                    import('./data/emojis'),
                    import('./data/categories')
                ])
                .then(([ data, categoriesData ]) => {
                    this.emojiList = data.emojis;
                    this.categoriesData = categoriesData.default;

                    resolve(this.render());
                })
                .catch(reject)
            }
        });
    }

    setTheme(theme) {
        const selectedTheme = this.theming[theme];

        if (selectedTheme) {
            Object.keys(selectedTheme).forEach(themeVar => {
                this.mainEl.style.setProperty(themeVar, selectedTheme[themeVar]);
            });
        }
    }

    render() {
        this.mainEl = document.createElement('article');
        const buttonEl = document.createElement('button');

        this.mainEl.classList.add('widget-container');
        buttonEl.classList.add('widget-button', 'widget-button-position');
        buttonEl.setAttribute('id', 'widget-button');

        this.mainEl.innerHTML = `
            <div class="widget widget-hidden" id="widget-content">
                <nav class="widget-navigation">
                    <div class="widget-tabs" id="widgetTabs"></div>
                    <div class="search-field">
                        <input class="search-input" id="search-input" placeholder="Поиск Emoji">
                        <button class="search-button" id="searchButton"></button>
                    </div>
                </nav>
                <div class="emoji-container" id="emojiContainer"></div>
            </div>
        `;
        const searchButtonEl = this.mainEl.querySelector('#searchButton');

        searchButtonEl.innerHTML = require(`./images/categories/search.svg`);
        searchButtonEl.querySelector('svg').classList.add('search-icon');

        this.inputEl.parentNode.insertBefore(this.mainEl, this.inputEl.nextSibling);
        this.inputEl.parentNode.insertBefore(buttonEl, this.inputEl.nextSibling);

        this.setTheme(this.theme);

        this.init();

        return this.mainEl;
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
        const DEFAULT_CATEGORY = Object.keys(this.categoriesData)[0];
        const widgetTabsEl = document.getElementById('widgetTabs');

        Object.keys(this.categoriesData).forEach((categoryId, index) => {
            const { title } = this.categoriesData[categoryId];
            const tabButtonEl = document.createElement('button');

            tabButtonEl.setAttribute('title', title);
            tabButtonEl.classList.add('tab-item');
            tabButtonEl.innerHTML = require(`./images/categories/cat-${categoryId}.svg`);
            tabButtonEl.addEventListener('click', () => {
                if (categoryId === DEFAULT_CATEGORY) {
                    this.showEmoji(this.recentlyUsed);
                    this.setSelectedCategory(categoryId);
                } else {
                    this.showPageByCategory(Number(categoryId));
                }
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
        const RECENTLY_USED_LENGTH = 54;
        const emojiContainerEl = document.getElementById('emojiContainer');

        emojiContainerEl.innerHTML = '';
        emojiListContent.forEach(emojiItem => {
            const emojiEl = document.createElement('button');
            emojiEl.classList.add('emoji-button');

            emojiEl.innerHTML = emojiItem.html;
            emojiEl.setAttribute('title', emojiItem.name);
            emojiEl.addEventListener('click', () => {
                this.inputEl.value += emojiItem.emoji;
                if (!this.recentlyUsed.includes(emojiItem)) {
                    this.recentlyUsed.unshift(emojiItem);
                }
                if (this.recentlyUsed.length > RECENTLY_USED_LENGTH) {
                    this.recentlyUsed.pop();
                }
            });
            emojiContainerEl.appendChild(emojiEl);
        });
    }
}
