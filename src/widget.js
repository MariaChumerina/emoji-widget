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

export function initTabs() {
    const widgetTabsEl = document.getElementById('widgetTabs');

    categories.forEach(category => {
        const tabButtonEl = document.createElement('button');

        tabButtonEl.classList.add('tab-item', `cat-${category}`);
        widgetTabsEl.appendChild(tabButtonEl);
    });
}

export function showEmojiPage(emojiList) {
    const emojiContainerEl = document.getElementById('emojiContainer');

    emojiList.forEach(emoji => {
        const emojiEl = document.createElement('span');

        emojiEl.textContent = String.fromCodePoint(emoji);
        emojiContainerEl.appendChild(emojiEl);
    });
}
