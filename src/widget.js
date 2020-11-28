import emojiData from './data/emojis';

const emojiContent = emojiData.emojis.map(e => e.html);

const categories = [
    'recent',
    'smiles',
    'animals',
    'food',
    'activity',
    'travel',
    'objects',
    'symbols',
    'flags',
];

export default function initWidget() {
    console.log(emojiContent);
    initTabs();
    showEmojiPage(emojiContent);
}

function initTabs() {
    const widgetTabsEl = document.getElementById('widgetTabs');

    categories.forEach(category => {
        const tabButtonEl = document.createElement('button');

        tabButtonEl.classList.add('tab-item', `cat-${category}`);
        widgetTabsEl.appendChild(tabButtonEl);
    });
}

function showEmojiPage(emojiList) {
    const emojiContainerEl = document.getElementById('emojiContainer');

    emojiList.forEach(emoji => {
        const emojiEl = document.createElement('span');

        emojiEl.innerHTML = emoji;
        emojiContainerEl.appendChild(emojiEl);
    });
}
