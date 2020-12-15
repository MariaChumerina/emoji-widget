import './styles/index.styl';
import { Widget } from './widget';

const messageInputEl = document.getElementById('messageInput');
const darkModeCheckEl = document.getElementById('darkModeCheck');

const lightTheme = `
    --body-background: #fefefe;
    --input-background: #fff;
    --contrast: #333;
`;
const darkTheme = `
    --body-background: #30353d;
    --input-background: #60666f;
    --contrast: #eee;
`;

const widget = new Widget();
widget.create(messageInputEl).then(() => {
    console.log('widget was init');
});

darkModeCheckEl.addEventListener('click', () => {
    setOuterTheme(darkModeCheckEl.checked);
    widget.setTheme(darkModeCheckEl.checked ? 'dark' : 'light');
});

function setOuterTheme(isDark) {
    document.documentElement.style.cssText = isDark ? darkTheme : lightTheme;
}

