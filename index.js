async function include(element, page) {
    var response = await fetch(page);
    var content = await response.text();
    element.innerHTML = content;
}

function includeall() {
    document.querySelectorAll("[data-include]").forEach(
        element => {
            include(element, element.getAttribute("data-include"))
        })
    }