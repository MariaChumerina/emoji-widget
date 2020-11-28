import './styles/index.styl';
import initWidget from "./widget";

const widgetButton = document.getElementById('widget-button');
const widgetContent = document.getElementById('widget-content');

widgetButton.onclick = function () {
    setWidgetVisibility();
};
initWidget();

function setWidgetVisibility() {
    const hiddenWidgetClass = 'widget-hidden';
    if (widgetContent.classList.contains(hiddenWidgetClass)) {
        widgetContent.classList.remove(hiddenWidgetClass);
    } else {
        widgetContent.classList.add(hiddenWidgetClass);
    }
}
