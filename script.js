const rowPosts = [
  { image: "image_9", uploadDate: "2016-04-11" },
  { image: "image_8", uploadDate: "2016-05-18" },
  { image: "image_14", uploadDate: "2016-06-02" },
  { image: "image_3", uploadDate: "2016-07-22" },
  { image: "image_4", uploadDate: "2016-08-09" },
  { image: "image_6", uploadDate: "2016-09-14" },
  { image: "image_10", uploadDate: "2016-10-01" },
  { image: "image_13", uploadDate: "2016-11-25" },
  { image: "image_2", uploadDate: "2016-12-30" },
];

const tilePosts = [
  { image: "image_8", uploadDate: "2016-05-18" },
  { image: "image_11", uploadDate: "2016-03-15" },
  { image: "image_5", uploadDate: "2016-06-28" },
  { image: "image_8", uploadDate: "2016-05-18" },
  { image: "image_1", uploadDate: "2016-01-10" },
  { image: "image_15", uploadDate: "2016-02-17" },
  { image: "image_12", uploadDate: "2016-08-30" },
  { image: "image_7", uploadDate: "2016-11-11" },
];

function formatDisplayDate(isoDate) {
  const [year, month, day] = isoDate.split("-");
  return `${day}-${month}-${year}`;
}

function parseUploadDate(isoDate) {
  const [year, month, day] = isoDate.split("-").map(Number);
  return new Date(year, month - 1, day);
}

function startOfDay(date) {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate());
}

function metric(iconName, value) {
  return `
    <span class="metric">
      <img src="assets/${iconName}.svg" alt="" aria-hidden="true" />
      <span>${value}</span>
    </span>
  `;
}

function createRow({ image, uploadDate }) {
  const displayDate = formatDisplayDate(uploadDate);

  return `
    <article class="post-row" data-upload-date="${uploadDate}">
      <img class="post-row__image" src="assets/${image}.jpg" alt="" />
      <div class="row-group row-group--primary">
        <div>
          <div class="row-title">Today</div>
          <div class="row-metrics">
            ${metric("heart", "128")}
            ${metric("comment", "31")}
          </div>
        </div>
      </div>
      <div class="row-group row-group--secondary">
        <div>
          <div class="row-title">9-08-2016</div>
          <div class="row-metrics">
            ${metric("heart", "67")}
            ${metric("comment", "22")}
          </div>
        </div>
      </div>
      <div class="row-group row-group--upload">
        <div class="row-title">Image upload</div>
        <span class="upload-date">${displayDate}</span>
      </div>
    </article>
  `;
}

function createTile({ image, uploadDate }) {
  const displayDate = formatDisplayDate(uploadDate);

  return `
    <article class="post-tile" data-upload-date="${uploadDate}">
      <img class="post-tile__image" src="assets/${image}.jpg" alt="" />
      <div class="post-tile__body">
        <div class="tile-heading">
          <span class="tile-title">Today</span>
          <span class="tile-title">9-08-2016</span>
        </div>
        <div class="tile-metrics">
          <div class="tile-metric-column">
            ${metric("heart", "128")}
            ${metric("comment", "31")}
          </div>
          <div class="tile-metric-column">
            ${metric("heart", "67")}
            ${metric("comment", "22")}
          </div>
        </div>
        <div class="tile-upload">
          <span class="row-title">Image upload</span>
          <span class="upload-date">${displayDate}</span>
        </div>
      </div>
    </article>
  `;
}

document.querySelector('[data-view="rows"]').innerHTML = rowPosts.map(createRow).join("");
document.querySelector('[data-view="tiles"]').innerHTML = tilePosts.map(createTile).join("");

const viewIcons = {
  tiles: { active: "assets/grid.svg", inactive: "assets/grid-inactive.svg" },
  rows: { active: "assets/list.svg", inactive: "assets/list-inactive.svg" },
};

const viewButtons = document.querySelectorAll("[data-view-button]");
const views = document.querySelectorAll("[data-view]");

function setViewIcon(button, isCurrent) {
  const icon = button.querySelector("img");
  const sources = viewIcons[button.dataset.viewButton];
  if (icon && sources) {
    icon.src = isCurrent ? sources.active : sources.inactive;
  }
}

viewButtons.forEach((button) => {
  button.addEventListener("click", () => {
    const nextView = button.dataset.viewButton;

    views.forEach((view) => {
      view.classList.toggle("is-visible", view.dataset.view === nextView);
    });

    viewButtons.forEach((item) => {
      const isCurrent = item.dataset.viewButton === nextView;
      item.classList.toggle("is-current", isCurrent);
      item.setAttribute("aria-pressed", String(isCurrent));
      setViewIcon(item, isCurrent);
    });
  });
});

if (new URLSearchParams(window.location.search).get("view") === "tiles") {
  document.querySelector('[data-view-button="tiles"]').click();
}

let filterFrom = null;
let filterTo = null;

function applyDateFilter() {
  const invalidRange = filterFrom && filterTo && filterFrom > filterTo;

  document.querySelectorAll("[data-view] article").forEach((article) => {
    if (invalidRange) {
      article.hidden = true;
      return;
    }

    const uploadDate = parseUploadDate(article.dataset.uploadDate);
    let visible = true;

    if (filterFrom && uploadDate < filterFrom) {
      visible = false;
    }

    if (filterTo && uploadDate > filterTo) {
      visible = false;
    }

    article.hidden = !visible;
  });
}

const datepickerOptions = {
  wrap: true,
  allowInput: true,
  clickOpens: true,
  dateFormat: "d_m_Y",
  disableMobile: true,
  monthSelectorType: "static",
  position: "below left",
  prevArrow: "‹‹",
  nextArrow: "››",
};

flatpickr("#date-from", {
  ...datepickerOptions,
  onChange(selectedDates) {
    filterFrom = selectedDates[0] ? startOfDay(selectedDates[0]) : null;
    applyDateFilter();
  },
});

flatpickr("#date-to", {
  ...datepickerOptions,
  onChange(selectedDates) {
    filterTo = selectedDates[0] ? startOfDay(selectedDates[0]) : null;
    applyDateFilter();
  },
});
