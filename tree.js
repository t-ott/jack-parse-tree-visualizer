// override defaults for text editing with Jack textarea
document.getElementById('jackTextArea')
    .addEventListener('keydown', function(e) {
        if (e.key == 'Tab') {
            e.preventDefault();
            var start = this.selectionStart;
            var end = this.selectionEnd;

            this.value = `${this.value.substring(0, start)}  ${this.value.substring(end)}`;
            this.selectionStart = this.selectionEnd = start + 2;
        }
    });


function makeTree(xmlStr) {
    console.log("Starting makeTree() in tree.js")

    // xmlStr to xmlDoc
    parser = new DOMParser();
    xmlDoc = parser.parseFromString(xmlStr, "text/xml");

    // TODO:
    // handle parseerror:
    // https://stackoverflow.com/questions/11563554/how-do-i-detect-xml-parsing-errors-when-using-javascripts-domparser-in-a-cross
    
    // Building a Tree Visualization of World Countries with D3.js
    // https://www.youtube.com/watch?v=jfpV7OBptYE
    
    const svg = d3.select('svg');
    // clear existing svg
    svg.selectAll("*").remove();
    
    const width = document.body.clientWidth;
    const height = document.body.clientHeight;
    const margin = {top: 0, right: 100, bottom: 0, left: 60};
    const innerWidth = width - margin.left - margin.right;
    const innerHeight = height - margin.top - margin.bottom;
    const tree = d3.tree().size([innerHeight, innerWidth]);
    
    const zoomG = svg
        .attr('width', width)
        .attr('height', height)
        .append('g');
    
    const g = zoomG.append('g')
        .attr('transform', `translate(${margin.left},${margin.top})`);
    
    svg.call(d3.zoom().on('zoom', (event) => {
        zoomG.attr('transform', event.transform);
    }))
    
    const root = d3.hierarchy(xmlDoc);
    const links = tree(root).links();
    
    // one path element for each link in links
    g.selectAll('path').data(links)
        .enter()
        .append('path')
        .attr('d', d3.linkHorizontal()
            .x(d => d.y)
            .y(d => d.x)
        )
    
    // nodes
    g.selectAll('text').data(root.descendants())
        .enter()
        .append('text')
        .attr('dy', '0.32em')
        .attr('x', d => d.y)
        .attr('y', d => d.x)
        .text(d => (d.height == 0) ? 
            d.data.tagName+" "+d.data.innerHTML :
            d.data.tagName
        );
}


function getXmlStr() {
    currentXmlStr = document.getElementById("xmlText").value;
    if (currentXmlStr != xmlStr) {
        makeTree(currentXmlStr);
        xmlStr = currentXmlStr;
    }
}

var xmlStr = ""; // initialize global xmlStr var
setInterval(getXmlStr, 500);
