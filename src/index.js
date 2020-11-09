import './styles/index.styl';

const widgetButton = document.getElementById('widget-button');
const widgetContent = document.getElementById('widget-content');

widgetButton.onclick = function () {
    setWidgetVisibility();
}

function setWidgetVisibility() {
    const hiddenWidgetClass = 'widget-hidden';
    if (widgetContent.classList.contains(hiddenWidgetClass)) {
        widgetContent.classList.remove(hiddenWidgetClass);
    } else {
        widgetContent.classList.add(hiddenWidgetClass);
    }
}
