import './styles/index.styl';
import './styles/theming.css';

import { Widget } from "./widget";

const messageInputEl = document.getElementById('messageInput');
const widget = new Widget(messageInputEl);

