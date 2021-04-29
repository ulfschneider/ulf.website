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
//plus my own, which will make it more robust
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

function canSort(column) {
    let foundOne = false;
    if (column.length && column[0].tagName != 'TH') {
        //first element is not a th
        return false;
    }
    for (let cell of column) {
        if (!foundOne) {
            foundOne = cell.tagName == 'TH';
        } else if (cell.tagName == 'TH') {
            //more than one th in a single column
            return false;
        }
    }
    return true;
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

function compareCells(cell1, cell2) {
    return compareValues(getCellValue(cell1), getCellValue(cell2));
}

function isAsc(column) {
    let values = column.filter(cell => cell.tagName != 'TH').map(cell => getCellValue(cell));
    let sortedValues = [...values].sort(compareValues);
    return String(values) == String(sortedValues);
}

function comparer(columnIndex, asc) {
    return function(row1, row2) {
        return compareValues(getIndexedRowValue(asc ? row1 : row2, columnIndex), getIndexedRowValue(asc ? row2 : row1, columnIndex));
    }
}

function indicateSortDirection(table, th, asc) {
    table.querySelectorAll('th.sortable-column:not(table table th)').forEach(th => {
        th.classList.remove('asc');
        th.classList.remove('dsc');
        th.ariaSort = null;
    });
    th.classList.add(asc ? 'asc' : 'dsc');
    //use ariaSort for accessibility
    th.ariaSort = asc ? 'ascending' : 'descending';
}

function insertToggle(th) {
    if (th.innerText != th.innerHTML) {
        //we cannot replace the th content with a button
        return null;
    } else {
        //use a button toggle for accessibility
        th.innerHTML = `<button>${th.innerText}</button>`;
        //watch out for the css
        //th.sortable-column>*:first-child is referring to
        //this element
        return th.firstChild;
    }
}

// do the work...
document.querySelectorAll('th').forEach(th => {

    let table = th.closest('table');
    let columnIndex = getColumnIndex(th);
    let column = getColumn(table, columnIndex);

    if (canSort(column)) {
        let toggle = insertToggle(th);
        if (toggle) {
            th.classList.add('sortable-column');
            toggle.addEventListener('click', () => {
                let asc = !isAsc(getColumn(table, columnIndex))
                Array.from(table.querySelectorAll('tr:nth-child(n+2)'))
                    .sort(comparer(getColumnIndex(th), asc))
                    .forEach(tr => table.appendChild(tr));
                indicateSortDirection(table, th, asc)
            })
        }
    }
});