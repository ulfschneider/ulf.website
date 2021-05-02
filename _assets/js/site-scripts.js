/* Service Worker */
if (navigator.serviceWorker) {
    navigator
        .serviceWorker
        .register('/serviceworker.js')
        .catch(error => {
            console.error(error);
        });
    addEventListener("load", function() {
        if (navigator.serviceWorker.controller) {
            navigator
                .serviceWorker
                .controller
                .postMessage({ "command": "trimCache" });
        }
    });
}

/* Back to top */
function maintainBackToStartVisibility() {
    let backToStart = document.getElementById('back-to-start');
    if (backToStart) {
        let windowHeight = window.innerHeight;
        let documentHeight = document.body.scrollHeight;

        if (windowHeight * 1.5 < documentHeight) {
            backToStart.style.display = '';
        } else {
            backToStart.style.display = 'none';
        }
    }
}

/* Page load time */
function displayLoadTime() {
    let loadTime = document.getElementById('load-time');

    if (!loadTime) {
        return;
    }

    //PerformanceNavigationTiming API
    let entries = performance.getEntriesByType("navigation")
    if (entries && entries.length) {
        duration = entries[0].loadEventStart;
    }

    if (duration) {
        let seconds = (duration / 1000).toFixed(2);
        let templateString = loadTime.innerText;
        if (templateString) {
            templateString = templateString.replace('${seconds}', seconds);
        } else {
            templateString = `This page loaded in ${seconds} seconds`;
        }
        loadTime.innerHTML = templateString;
        loadTime.style.display = '';
    } else {
        loadTime.style.display = 'none';
    }
}


addEventListener('load', event => maintainBackToStartVisibility());
addEventListener('scroll', event => maintainBackToStartVisibility());
addEventListener('resize', event => maintainBackToStartVisibility());

addEventListener('load', event => displayLoadTime());

//initial idea from https://www.delftstack.com/howto/javascript/javascript-sort-html-table/
//and incorporated ideas from https://adrianroselli.com/2021/04/sortable-table-columns.html
//plus my own
const ROW_SELECTOR = 'tr:nth-child(n+2):not(table table tr)';

let defaults = {
    indicatorAsc: 'ᐃ',
    indicatorDsc: 'ᐁ',
    sortHint: 'Sort the table by clicking on a column heading.',
    restoreHint: 'Restore the original order by clicking <button>Restore Order</button>.'
}
let settings;

function setConfig(options) {
    settings = Object.assign({}, defaults, options);
}

function getIndexedRowValue(row, columnIndex) {
    return row.children[columnIndex].innerText || row.children[columnIndex].textContent;
}

function getColumnIndex(th) {
    return Array.from(th.parentNode.children).indexOf(th);
}

function getColumn(table, columnIndex) {
    let rows = Array.from(table.querySelectorAll('tr'));
    return rows.map(row => row.children[columnIndex]);
}

function canColumnSort(column) {
    if (column.length && column[0].tagName != 'TH') {
        //first element is not a th
        return false;
    }
    return true;
}

function isTableSorted(table) {
    return table.querySelector('.asc:not(table table asc)') ||  table.querySelector('.dsc:not(table table dsc)');
}

function getCellValue(cell) {
    return cell.innerText || cell.textContent;
}

function compareValues(value1, value2) {
    if (!isNaN(value1) && !isNaN(value2)) {
        return value1 - value2;
    } else {
        return String(value1).localeCompare(String(value2));
    }
}

function isColumnAsc(column) {
    //is the column sorted ascending
    let values = column.filter(cell => cell.tagName != 'TH').map(cell => getCellValue(cell));
    let sortedValues = [...values].sort(compareValues);
    return String(values) == String(sortedValues);
}

function comparer(columnIndex, asc) {
    //compare table cell values of two rows for the given column index
    return function(row1, row2) {
        return compareValues(getIndexedRowValue(asc ? row1 : row2, columnIndex), getIndexedRowValue(asc ? row2 : row1, columnIndex));
    }
}

function clearTableSortIndication(table) {
    //remove all sort indicators
    table.querySelectorAll('th.sortable-column:not(table table th)').forEach(th => {
        th.classList.remove('asc');
        th.classList.remove('dsc');
        th.ariaSort = null;
        th.querySelectorAll('.indicator').forEach(indicator => indicator.remove());
    });
}


function indicateColumnSortDirection(table, th, asc) {
    //if the table has been sorted
    //provide the indication in the 
    //column headings
    clearTableSortIndication(table);

    let indicator = document.createElement('span');
    th.firstChild.appendChild(indicator);
    indicator.classList.add('indicator');
    indicator.ariaHidden = true;

    if (asc) {
        th.classList.add('asc');
        th.ariaSort = 'ascending';
        indicator.innerHTML = settings.indicatorAsc;
    } else {
        th.classList.add('dsc');
        th.ariaSort = 'descending';
        indicator.innerHTML = settings.indicatorDsc;
    }

    indicateRestoreTableOrder(table);
}

function storeOrigTableOrder(table) {
    //store the original order of the table
    //for later re-use
    let order = 1;
    table.querySelectorAll(`${ROW_SELECTOR}:not([orig-order])`).forEach(tr => {
        tr.setAttribute('orig-order', order);
        order++;
    });
}

function restoreOrigTableOrder(table) {
    //restore the original order of the table
    clearTableSortIndication(table);

    Array.from(table.querySelectorAll(`${ROW_SELECTOR}[orig-order]`))
        .sort((row1, row2) => {
            return parseInt(row1.getAttribute('orig-order')) - parseInt(row2.getAttribute('orig-order'));
        })
        .forEach(tr => table.appendChild(tr));
}

function indicateRestoreTableOrder(table) {
    //show a hint how to restore the original order 
    table.querySelectorAll('caption p.indicator:not(table table caption p.indicator)').forEach(indicator => {
        if (!indicator.querySelector('.restore-hint') && settings.restoreHint) {
            indicator.innerHTML += ` <span class="restore-hint">${settings.restoreHint}</span>`;
            //in case the hint contained a button, 
            //assign a css class and a restore order action to that button
            indicator.querySelectorAll('.restore-hint button').forEach(button => {
                button.classList.add('restore-order');
                button.addEventListener('click', () => {
                    restoreOrigTableOrder(table);
                });
            })
        }
    });
}

function indicateSortableTable(table) {
    //prepare a table caption element
    //to contain a hint that the table
    //can be sorted
    let caption = table.querySelector('caption');
    if (!caption) {
        caption = document.createElement('caption');
        table.prepend(caption);
    }
    let indicator = table.querySelector('p.indicator');
    if (!indicator) {
        indicator = document.createElement('p');
        indicator.classList.add('indicator');
        indicator.innerHTML = settings.sortHint;
        caption.appendChild(indicator);
    }
    indicateRestoreTableOrder(table);
}

function insertColumnSortToggle(th) {
    //convert the table th´s so that their previous content
    //is wrapped inside of a button element
    //that button will toggle the sorting of the column

    if (th.querySelectorAll(':not(abbr):not(b):not(br):not(cite):not(code):not(em):not(i):not(img):not(kbd):not(label):not(mark):not(small):not(span):not(strong):not(sub):not(sup):not(svg):not(time)').length) {
        //in this case
        //we cannot replace the th content with a button
        //because buttons are allowed to only contain phrasing content
        //https://html.spec.whatwg.org/multipage/form-elements.html#the-button-element
        return null;
    } else {
        //use a button toggle for accessibility
        th.innerHTML = `<button>${th.innerHTML}</button>`;
        //watch out for the css
        //th.sortable-column>button is referring to
        //this element
        return th.firstChild;
    }
}


function tableSorter(options) {
    setConfig(options);
    document.querySelectorAll('tr:first-child>th:not(.no-sort)').forEach(th => {

        let table = th.closest('table');
        if (!table.classList.contains('no-sort')) {
            let columnIndex = getColumnIndex(th);
            let column = getColumn(table, columnIndex);

            if (canColumnSort(column)) {
                storeOrigTableOrder(table);
                let toggle = insertColumnSortToggle(th);
                if (toggle) {
                    th.classList.add('sortable-column');
                    table.classList.add('sortable-table');
                    indicateSortableTable(table);
                    toggle.addEventListener('click', () => {
                        let asc = !isColumnAsc(getColumn(table, columnIndex))
                        Array.from(table.querySelectorAll(ROW_SELECTOR))
                            .sort(comparer(getColumnIndex(th), asc))
                            .forEach(tr => table.appendChild(tr));
                        indicateColumnSortDirection(table, th, asc);
                    })
                }
            }
        }
    });
}

addEventListener('load', () => tableSorter());