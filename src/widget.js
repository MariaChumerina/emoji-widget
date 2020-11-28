import emojiData from './data/emojis';
import categoriesData from './data/categories';

export class Widget {
    constructor() {
        this.emojiList = emojiData.emojis;
        this.categoriesData = categoriesData;

        this.initTabs();
        this.showPageByCategory(1);
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

        emojiContainerEl.innerHTML = '';
        emojiListContent.forEach(emoji => {
            const emojiEl = document.createElement('span');

            emojiEl.innerHTML = emoji.html;
            emojiEl.setAttribute('title', emoji.name);
            emojiContainerEl.appendChild(emojiEl);
        });

        this.setSelectedCategory(index);
    }
}
