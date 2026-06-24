const rowImages = [
  "image_9",
  "image_8",
  "image_14",
  "image_3",
  "image_4",
  "image_6",
  "image_10",
  "image_13",
  "image_2",
];

const tileImages = [
  "image_8",
  "image_11",
  "image_5",
  "image_8",
  "image_1",
  "image_15",
  "image_12",
  "image_7",
];

function metric(iconName, value) {
  return `
    <span class="metric">
      <img src="assets/${iconName}.svg" alt="" aria-hidden="true" />
      <span>${value}</span>
    </span>
  `;
}

function createRow(image) {
  return `
    <article class="post-row">
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
        <span class="upload-date">11-04-2016</span>
      </div>
    </article>
  `;
}

function createTile(image) {
  return `
    <article class="post-tile">
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
          <span class="upload-date">11-04-2016</span>
        </div>
      </div>
    </article>
  `;
}

document.querySelector('[data-view="rows"]').innerHTML = rowImages.map(createRow).join("");
document.querySelector('[data-view="tiles"]').innerHTML = tileImages.map(createTile).join("");

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

const datepickerOptions = {
  wrap: true,
  allowInput: true,
  clickOpens: true,
  dateFormat: "d_m_Y",
  disableMobile: true,
  monthSelectorType: "static",
  position: "below left",
  prevArrow: "‹",
  nextArrow: "›",
};

flatpickr("#date-from", datepickerOptions);

flatpickr("#date-to", {
  ...datepickerOptions,
});
