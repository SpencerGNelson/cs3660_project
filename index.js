async function include(element, page) {
    var response = await fetch(page);
    var content = await response.text();
    element.innerHTML = content;
    element.querySelectorAll("[href").forEach(
        subelement => {
            var href = subelement.getAttribute("href");
            if (!href.startsWith("http") && !href.startsWith("/")) {
                subelement.setAttribute("href", basedir + href)
            }
        }   
    )
    element.querySelectorAll("[src").forEach(
        subelement => {
            var src = subelement.getAttribute("src");
            if (!src.startsWith("http") && !src.startsWith("/")) {
                subelement.setAttribute("src", basedir + src)
            }
        }   
    )
}

function includeall() {
    document.querySelectorAll("[data-include]").forEach(
        element => {
            include(element, element.getAttribute("data-include"))
        })
    }