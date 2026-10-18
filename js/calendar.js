// Builds the class calendar from classDates, classTimes and classEndTimes (js/info.js).
(function () {
  if (typeof classDates === 'undefined' || !classDates.length) return;

  const MONTHS = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
  const WEEKDAYS = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

  const pad = n => String(n).padStart(2, '0');
  const toKey = d => `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
  const fromKey = key => {
    const [y, m, d] = key.split('-').map(Number);
    return new Date(y, m - 1, d);
  };

  const sortedKeys = [...classDates].sort();
  const classSet = new Set(sortedKeys);
  const first = fromKey(sortedKeys[0]);
  const last = fromKey(sortedKeys[sortedKeys.length - 1]);
  const todayKey = toKey(new Date());

  const timesPanel = document.createElement('div');
  timesPanel.className = 'class-times';
  timesPanel.setAttribute('role', 'tooltip');
  timesPanel.id = 'class-times';
  timesPanel.hidden = true;
  document.body.appendChild(timesPanel);
  let openButton = null;

  function closeTimes() {
    timesPanel.hidden = true;
    if (openButton) openButton.removeAttribute('aria-describedby');
    openButton = null;
  }

  // Floats the times box right next to the date (to its left if there is no room on the right).
  function showTimes(button) {
    if (openButton === button) return;
    closeTimes();
    const count = Math.min(classTimes.length, classEndTimes.length);
    const list = document.createElement('ul');
    for (let i = 0; i < count; i++) {
      const li = document.createElement('li');
      li.textContent = `${classTimes[i]} - ${classEndTimes[i]}`;
      list.appendChild(li);
    }
    timesPanel.replaceChildren(list);
    timesPanel.hidden = false;
    button.setAttribute('aria-describedby', timesPanel.id);
    openButton = button;

    const gap = 8;
    const rect = button.getBoundingClientRect();
    const box = timesPanel.getBoundingClientRect();
    let left = rect.right + gap;
    if (left + box.width > window.innerWidth - gap) left = rect.left - gap - box.width;
    left = Math.max(gap, left);
    const top = Math.min(Math.max(gap, rect.top + rect.height / 2 - box.height / 2), window.innerHeight - box.height - gap);
    timesPanel.style.left = `${left}px`;
    timesPanel.style.top = `${top}px`;
  }

  function buildMonth(year, month) {
    const card = document.createElement('section');
    card.className = 'month';

    const table = document.createElement('table');
    const caption = document.createElement('caption');
    caption.textContent = `${MONTHS[month]} ${year}`;
    table.appendChild(caption);

    const headRow = document.createElement('tr');
    WEEKDAYS.forEach(day => {
      const th = document.createElement('th');
      th.scope = 'col';
      th.textContent = day.slice(0, 3);
      th.abbr = day;
      headRow.appendChild(th);
    });
    const thead = document.createElement('thead');
    thead.appendChild(headRow);
    table.appendChild(thead);

    const tbody = document.createElement('tbody');
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    let row = document.createElement('tr');
    for (let i = 0; i < new Date(year, month, 1).getDay(); i++) {
      row.appendChild(document.createElement('td'));
    }

    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(year, month, day);
      const key = toKey(date);
      const td = document.createElement('td');
      const num = document.createElement('span');
      num.className = 'day-num';
      num.textContent = day;

      if (classSet.has(key)) {
        td.className = 'class-day';
        const button = document.createElement('button');
        button.type = 'button';
        button.setAttribute('aria-label', `${WEEKDAYS[date.getDay()]}, ${MONTHS[month]} ${day}, class`);
        const label = document.createElement('span');
        label.className = 'day-label';
        label.textContent = 'Class';
        button.append(num, label);
        button.addEventListener('mouseenter', () => showTimes(button));
        button.addEventListener('mouseleave', closeTimes);
        button.addEventListener('focus', () => showTimes(button));
        button.addEventListener('blur', closeTimes);
        // Touch screens have no hover: a tap shows (or hides) the times.
        button.addEventListener('click', () => (openButton === button ? closeTimes() : showTimes(button)));
        td.appendChild(button);
      } else if (date.getDay() === 0 && date > first && date < last) {
        td.className = 'no-class';
        td.setAttribute('aria-label', `${WEEKDAYS[0]}, ${MONTHS[month]} ${day}, no class`);
        const label = document.createElement('span');
        label.className = 'day-label';
        label.textContent = 'No class';
        td.append(num, label);
      } else {
        td.appendChild(num);
      }
      if (key === todayKey) td.classList.add('today');
      if (key < todayKey) td.classList.add('past');

      row.appendChild(td);
      if (date.getDay() === 6 || day === daysInMonth) {
        while (row.children.length < 7) row.appendChild(document.createElement('td'));
        tbody.appendChild(row);
        row = document.createElement('tr');
      }
    }

    table.appendChild(tbody);
    card.appendChild(table);
    return card;
  }

  const wrapper = document.createElement('div');
  wrapper.className = 'calendar';

  const legend = document.createElement('ul');
  legend.className = 'legend';
  legend.innerHTML =
    '<li><span class="swatch swatch-class"></span> Class</li>' +
    '<li><span class="swatch swatch-none"></span> No class</li>' +
    '<li><span class="swatch swatch-today"></span> Today</li>';
  wrapper.appendChild(legend);

  const months = [...new Set(sortedKeys.map(k => k.slice(0, 7)))];
  months.forEach(ym => {
    const [y, m] = ym.split('-').map(Number);
    wrapper.appendChild(buildMonth(y, m - 1));
  });

  const signup = document.createElement('a');
  signup.className = 'signup-link';
  signup.href = 'signup.html';
  signup.textContent = 'Sign Up For Classes!';
  wrapper.appendChild(signup);

  document.addEventListener('keydown', e => {
    if (e.key === 'Escape') closeTimes();
  });
  window.addEventListener('scroll', closeTimes, { passive: true });

  const comingSoon = document.querySelector('main article');
  if (comingSoon) comingSoon.style.display = 'none';
  document.querySelector('main').appendChild(wrapper);
})();
