var intro_section;
var resources_section;
var security_schemes_section;
var documentation_section;
var types_section;
var searchbar;

function bindNavToggle() {
  function bindItem(el) {
    el.addEventListener("click", function () {
      el.parentElement.classList.toggle("nav-tree__item--collapsed");
    });
  }

  var links = document.querySelectorAll(".nav-tree__item__label--togglable");

  for (var i = 0; i < links.length; i++) bindItem(links.item(i));
}

/**
 * Binds collapsibles
 */
function bindCollapsibles() {
  function bindItem(el) {
    el.addEventListener("click", function () {
      const targetId = el.getAttribute("data-target");
      const targetEl = document.getElementById(targetId);

      if (targetEl) targetEl.classList.toggle("collapsible--collapsed");
    });
  }

  var links = document.querySelectorAll(".collapsible__toggler");

  for (var i = 0; i < links.length; i++) bindItem(links.item(i));
}

/**
 * Binds tab components
 */
function bindTabs() {
  function bindTabsEl(el) {
    var links = el.querySelectorAll("a");

    if (links.length === 0) return;

    function activateTab(linkEl) {
      for (var i = 0; i < links.length; i++) {
        var itemEl = links.item(i);
        var targetEl = document.getElementById(itemEl.href.split("#", 2)[1]);

        if (!targetEl) {
          console.warn(
            "Tab container element '%s' not found.",
            itemEl.href.split("#", 2)[1]
          );
          continue;
        }

        if (links.item(i) === linkEl) {
          itemEl.parentElement.classList.add("tabs__item--active");
          targetEl.classList.add("tabs__content--active");
        } else {
          itemEl.parentElement.classList.remove("tabs__item--active");
          targetEl.classList.remove("tabs__content--active");
        }
      }
    }

    function bindLink(linkEl) {
      linkEl.addEventListener("click", function (ev) {
        ev.preventDefault();
        activateTab(linkEl);
        return false;
      });
    }

    for (var i = 0; i < links.length; i++) bindLink(links.item(i));

    activateTab(links.item(0));
  }

  var tabEls = document.querySelectorAll(".tabs");

  for (var i = 0; i < tabEls.length; i++) bindTabsEl(tabEls.item(i));
}

function bindFilters() {
  function updateFilter(el) {
    if (el.checked) {
      document.body.classList.remove(
        "annot-hide-" + el.getAttribute("data-annotation")
      );
      localStorage["raml2html_filters_" + el.getAttribute("data-annotation")] =
        "1";
    } else {
      document.body.classList.add(
        "annot-hide-" + el.getAttribute("data-annotation")
      );
      localStorage["raml2html_filters_" + el.getAttribute("data-annotation")] =
        "0";
    }
  }

  function bindFilterOption(el) {
    el.addEventListener("change", () => updateFilter(el));

    if (
      localStorage["raml2html_filters_" + el.getAttribute("data-annotation")] ==
      "0"
    ) {
      el.checked = false;
      updateFilter(el);
    }
  }

  var filterOptEls = document.querySelectorAll(".nav-tree__filter-checkbox");

  for (var i = 0; i < filterOptEls.length; i++)
    bindFilterOption(filterOptEls.item(i));
}

$(document).ready(function () {
  createReferences();

  onSearch();

  onSelectResource();

  onSelectType();
});

function createReferences() {
  intro_section = $("#intro-section");
  resources_section = $("#resources-section");
  security_schemes_section = $("#security-schemes-section");
  documentation_section = $("#documentation-section");
  types_section = $("#types-section");
  searchbar = $("#searchbar");
}

function rebuildMain({
  intro,
  resources,
  doc,
  types,
  schemes
}) {
  if (intro) {
    intro_section.show();
  } else {
    intro_section.hide();
  }

  if (resources) {
    resources_section.show();
  } else {
    resources_section.hide();
  }

  if (doc) {
    documentation_section.show();
  } else {
    documentation_section.hide();
  }

  if (types) {
    types_section.show();
  } else {
    types_section.hide();
  }

  if (schemes) {
    security_schemes_section.show();
  } else {
    security_schemes_section.hide();
  }
}

function onSearch() {
  searchbar.keyup(function (event) {
    let value = searchbar.val();

    $(".nav-tree__item ").each(function (index) {
      let urlNames = $(this).attr("value");

      if (
        urlNames &&
        urlNames.toUpperCase().indexOf(value.toUpperCase()) != -1
      ) {
        $(this).show();
      } else {
        let types;
        let level = $(this).attr("class");
        types = level.split(" ")[3];
        level = level.split(" ")[1];
        level = level[level.length - 1];

        if (types) types = types.substring(types.length - 5);

        if (level === "1" || types === "types") $(this).hide();
      }
    });
  });
}

function onSelectResource() {
  $(".nav-tree__item__label").click(function (event) {
    let url_value = $(this).attr("href");

    if (url_value === undefined) {
      return;
    }

    url_value = url_value.split("/");

    if (url_value[0] !== "#resources:") {
      return;
    }

    url_value = url_value[1].split(":");

    $(".record").each(function (index) {
      if (
        $(this)
        .text()
        .split(" ")[1]
        .indexOf("/" + url_value[0]) != -1
      ) {
        $(this).show();
      } else {
        $(this).hide();
      }
    });

    rebuildMain({
      intro: false,
      resources: true,
      doc: false,
      types: false
    });
  });
}

function onSelectType() {
  $(".nav-tree__item--nav-bar-types").click(function (event) {
    let url_value = $(this).text();

    console.log(url_value);

    $(".record").each(function (index) {
      if (
        $(this)
        .text()
        .split(" ")[1]
        .indexOf(url_value) != -1
      ) {
        $(this).show();
      } else {
        $(this).hide();
      }
    });

    rebuildMain({
      intro: false,
      resources: false,
      doc: false,
      types: true
    });
  });
}

window.addEventListener("load", function () {
  bindNavToggle();
  bindCollapsibles();
  bindTabs();
  bindFilters();
});