const tabItems = document.querySelectorAll('.tab-item');
const tabContentItems = document.querySelectorAll('.tab-content-item');

//select tab content item
function selectItem(e) {
    removeBorder();
    removeShow();
    //thêm border vào dưới tab
    this.classList.add('tab-border');
    //grab content item from DOM
    const tabContentItem = document.querySelector(`#${this.id}-content`);
    //add show tab
    tabContentItem.classList.add('show');
}

function removeBorder(e) {
    tabItems.forEach(item => item.classList.remove('tab-border'));
}

function removeShow(e) {
    tabContentItems.forEach(item => item.classList.remove('show'));
}

//listen for tab click
tabItems.forEach(item => item.addEventListener('click', selectItem))