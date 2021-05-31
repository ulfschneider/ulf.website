//authored by Ulf Schneider
//initial idea from https://www.delftstack.com/howto/javascript/javascript-sort-html-table/
//and incorporated ideas from https://adrianroselli.com/2021/04/sotable-columns.html
//plus my own
const ROW_SELECTOR = 'tr:nth-child(n+2):not(table table tr)';

let defaults = {
    indicatorAsc: 'ᐃ',
    indicatorDsc: 'ᐁ',
    sortHint: 'Sort the table by clicking on a column heading.',
    restoreHint: 'Restore the original order by clicking <button>Restore Order</button>.',
    whiteList: '',
    blackList: ''
}
let settings;
let whiteElements;
let blackElements;

function getArray(value) {
    if (value && typeof value === 'string' || value instanceof String) {
        return value.split(',');
    } else if (value) {
        //assuming value is an array
        return value;
    }
    return [];
}

function isWhitelisted(table) {
    if (whiteElements.size) {
        return whiteElements.has(table);
    }
    return true;
}

function isBlacklisted(table) {
    if (table.classList.contains('no-so')) {
        return true;
    }

    return blackElements.has(table);
}

function setConfig(options) {
    settings = Object.assign({}, defaults, options);
    whiteElements = new Set();
    blackElements = new Set();

    for (let white of getArray(settings.whiteList)) {
        for (let element of document.querySelectorAll(white)) {
            whiteElements.add(element);
        }
    }
    for (let black of getArray(settings.blackList)) {
        for (let element of document.querySelectorAll(black)) {
            blackElements.add(element);
        }
    }
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
    return table.querySelector('.asc:not(table table asc)') || table.querySelector('.dsc:not(table table dsc)');
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
    //is the column sorted ascending?
    let values = column.filter(cell => cell.tagName != 'TH').map(cell => getCellValue(cell));
    let sortedValues = [...values].sort(compareValues);
    return String(values) == String(sortedValues);
}

function comparer(columnIndex, asc) {
    //compare table cell values of two rows for the given column index
    return function (row1, row2) {
        return compareValues(getIndexedRowValue(asc ? row1 : row2, columnIndex), getIndexedRowValue(asc ? row2 : row1, columnIndex));
    }
}

function clearTableSortIndication(table) {
    //remove all sort indicators
    table.querySelectorAll('th.sotable-column:not(table table th)').forEach(th => {
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
        //th.sotable-column>button is referring to
        //this element
        return th.firstChild;
    }
}

function sotable(options) {
    setConfig(options);
    document.querySelectorAll('tr:first-child>th:not(.no-so)').forEach(th => {

        let table = th.closest('table');
        if (!isBlacklisted(table) && isWhitelisted(table)) {
            let columnIndex = getColumnIndex(th);
            let column = getColumn(table, columnIndex);

            if (canColumnSort(column)) {
                storeOrigTableOrder(table);
                let toggle = insertColumnSortToggle(th);
                if (toggle) {
                    th.classList.add('sotable-column');
                    table.classList.add('sotable');
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


try {
    if (module && module.exports) {
        module.exports.sotable = sotable;
        module.exports.run = sotable;
    }
} catch (e) {
    //not using module exports
}
